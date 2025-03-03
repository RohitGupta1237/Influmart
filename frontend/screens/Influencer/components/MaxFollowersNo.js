import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { Image } from "expo-image";
import { MaxFollowersNoStyles } from "./MaxFollowers.scss";
import { Padding } from "../../../GlobalStyles";

const socialAccounts = [
  {
    name: "Instagram",
    description: "Share your photos and videos",
    image: require("../../../assets/instagram_symbol.png"),
  },
  {
    name: "YouTube",
    description: "Watch, stream, and upload videos",
    image: require("../../../assets/yt_symbol.png"),
  },
  {
    name: "TikTok",
    description: "Create and discover short videos",
    image: require("../../../assets/tt_symbol.png"),
  },
];

const MaxFollowersNo = ({ route, navigation }) => {
  const [value, setValue] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [disableButton,setDisableButton] = useState(true)
  const price = route.params?.price;
  const social = route.params?.social;
  const photo = route.params?.photo
  const isCompleted=route.params?.isCompleted
  const redirect=route.params?.redirect
  useEffect(() => {
    if (route.params?.follower) {
      const { platform, value } = route.params.follower;
      setPlatform(platform);
      setValue(value.toString());
    }
  }, [route.params]);
  useEffect(()=>{
    if(platform!="" && value!=""){
      setDisableButton(false)
    }else{
      setDisableButton(true)
    }
  },[value,platform])
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.addAccountButton}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(redirect, {
                price,
                social,
                photo,
                isCompleted
              })
            }
          >
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../../../assets/cross_symbol.png")}
            />
          </TouchableOpacity>
          <Text style={styles.addAccountText}>Add a social account</Text>
          <View style={{width:20,height:20}}></View>
        </View>
      </View>
      <View style={{width:"100%",padding:Padding.p_base}}>
        <Text style={styles.desc}>
            Choose atleast one platform
        </Text>
      </View>
      {socialAccounts.map((account, index) => (
        <View key={index} style={[styles.accountContainer, platform==account.name && styles.activeAccount]}>
            <Image
              style={styles.accountIcon}
              contentFit="cover"
              source={account.image}
            />
            <TouchableOpacity onPress={()=>setPlatform(account.name)}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountDescription}>
                {account.description}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.followerCountContainer}>
        <TextInput
          style={styles.enterFollowerCountText}
          value={value}
          onChangeText={(value) => setValue(value)}
          placeholder={"Enter your follower count"}
        />
      </View>
      <TouchableOpacity
        disabled={disableButton}
        style={disableButton?styles.ButtonDisabled:styles.confirmButton}
        onPress={() =>
          navigation.navigate(redirect, {
            follower: { platform: platform, value: value },
            price,
            social,
            photo,
            isCompleted:{...isCompleted,addSocialFollowers:true}
          })
        }
      >
        <Text style={disableButton?styles.ButtonDisabledText: styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create(MaxFollowersNoStyles);

export default MaxFollowersNo;
