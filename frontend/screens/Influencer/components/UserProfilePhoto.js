import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { UserProfilePhotoStyles } from "./UserProfilePhoto.scss";
import { useAlert } from "../../../util/AlertContext";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { handleImageSelection } from "../../../util/imagePickerUtil";
import avatarImages from "../../../constants/Avatars";

const UserProfilePhoto = ({ route, navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const social = route.params?.social;
  const { showAlert } = useAlert();
  const follower = route.params?.follower;
  const price = route.params?.price;
  const isCompleted = route.params?.isCompleted
  const redirect = route.params?.redirect
  const [photo, setPhoto] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState("")

  function readImage(url, callback) {
    var request = new
      XMLHttpRequest(); request.onload = function () {
        var file = new FileReader();
        file.onloadend = function () {
          callback(file.result);
        }
        file.readAsDataURL(request.response);
      };
    request.open('GET', url);
    request.responseType = 'blob';
    request.send();
  }

  useEffect(() => {
    if (route.params) {
      const { photo } = route.params;
      if (photo && photo.uri) {
        setSelectedImage(photo.uri);
        setPhoto(photo);
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedAvatarIndex !== "") {
      readImage(`../../../assets/avatars/avatar${selectedAvatarIndex + 1}.png`, function (base64) {
        setPhoto({ name: `avatar${selectedAvatarIndex}`, uri: base64, type: "image/png", isSelected: true, file: `avatar${selectedAvatarIndex + 1}` });
        setSelectedImage(base64)
      });
    }
  }, [selectedAvatarIndex]);
  const handleImagePick = async (type) => {
    const result = await handleImageSelection(type);
    if (result.canceled) {
      if (result.error) {
        showAlert("Alert", result.error);
      }
      return;
    }
    setPhoto(result);
    setSelectedImage(result.uri);
    setSelectedAvatarIndex("")
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const uri = URL.createObjectURL(file);
      setSelectedImage(uri);
    }
    setSelectedAvatarIndex("")
  };

  return (
    <ScrollView style={styles.userProfilePhoto}>
      {Platform.OS === "web" && (
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(redirect, {
              social,
              price,
              follower,
            })
          }
        >
          <Image
            style={styles.profileImage}
            contentFit="cover"
            source={require("../../../assets/cross_symbol.png")}
          />
        </TouchableOpacity>
        <Text style={styles.profilePhotoText}>Profile Photo</Text>
        <View style={{ width: 20, height: 20 }}></View>
      </View>
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.selectedImage}
            contentFit="contain"
          />
        </View>
      )}
      <Text style={styles.tipTitle}>Select your first avatar.You can always change your style later.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarsContainer}>
        {
          avatarImages && avatarImages?.map((avatar, index) => {
            return (
              <TouchableOpacity style={[styles.avatarContainer, selectedAvatarIndex === index && styles.selectedAvatar]} key={index} onPress={() => { setSelectedAvatarIndex(index) }}>
                <Image style={styles.avatarImage} source={avatar.imageUrl} contentFit="contain" />
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
      <View style={styles.divider}>
        <Text style={styles.orText}>or</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={() => handleImagePick("library")}
        >
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.takePhotoButton]}
          onPress={() => handleImagePick("camera")}
        >
          <Text style={[styles.buttonText, styles.takePhotoButtonText]}>Take Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate(redirect, { social, price, follower, photo, isCompleted: { ...isCompleted, addProfilePhoto: true } })}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create(UserProfilePhotoStyles);

export default UserProfilePhoto;
