import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import InfluPrice from "../signup/components/InfluPrice";
import HeadingDescToggle from "../signup/components/HeadingDescToggle";
import { InfluencerVerify } from "../../controller/signupController";
import { InfluencerRegistrationFormStyles } from "./InfluencerRegstrationForm.scss";
import { useAlert } from "../../util/AlertContext";
import { Color, FontSize } from "../../GlobalStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MultipleSelectList from "../../shared/MultiSelect";
import { CountryPicker } from "react-native-country-codes-picker";
import DropDown from "../../shared/DropDown";
import Loader from "../../shared/Loader";
import PlaceSearchBar from "../../shared/PlaceSearchBar";
import MultiDropDown from "../../shared/MultiDropDown";

const FormField = ({
  label,
  value,
  setValue,
  secureTextEntry = false,
  showPassword,
  setShowPassword,
  style,
  setInfluTypeDropdown,
  setGenderDropdown
}) => (
  <View style={[styles.fieldContainer, style]}>
    <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.madantoryText}>*</Text>
    </View>
    <View style={secureTextEntry}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        placeholder={label}
        secureTextEntry={secureTextEntry && !showPassword}
        onFocus={() => {
          setInfluTypeDropdown(false)
          setGenderDropdown(false)
        }}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.password}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const InfluencerRegistrationForm = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selected, setSelected] = useState([]);
  const [over18, setOver18] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [industryAssociation, setIndustryAssociation] = useState(false);
  const [location, setLocation] = useState("");
  const social = route.params?.social;
  const follower = route.params?.follower;
  const price = route.params?.price;
  const { showAlert } = useAlert();
  const photo = route.params?.photo;
  const isCompleted = route.params?.isCompleted || {
    addSocialProfile: false,
    addProfilePhoto: false,
    addSocialFollowers: false,
    pricePerPost: false,
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openCountryCode, setOpenCountryCode] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNoVerified, setMobileNoVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [influTypeDropdown, setInfluTypeDropdown] = useState(false)
  const [genderDropdown, setGenderDropdown] = useState(false)
  const data = [
    { key: "grocery", value: "Grocery" },
    { key: "electronics", value: "Electronics" },
    { key: "fashion", value: "Fashion" },
    { key: "toys", value: "Toys" },
    { key: "beauty", value: "Beauty" },
    { key: "home-decoration", value: "Home Decoration" },
    { key: "fitness", value: "Fitness" },
    { key: "education", value: "Education" },
    { key: "others", value: "Others" },
  ];

  const genderData = [
    {
      key: "male",
      value: "Male",
    },
    {
      key: "female",
      value: "Female",
    },
    {
      key: "other",
      value: "Other",
    },
    {
      key: "not prefer to say",
      value: "Not prefer to say",
    },
  ];
  const handlePlaceSelected = (details) => {
    setLocation(details);
  };
  useEffect(() => {
    if (
      name &&
      mobileNumber &&
      email &&
      password &&
      username &&
      //location &&  // In production, location is mandatory. But for testing, it is optional. in production, uncomment this line
      agreedToTerms &&
      social &&
      follower &&
      price
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    email,
    password,
    username,
    location,
    over18,
    agreedToTerms,
    social,
    follower,
    price,
  ]);
  useEffect(() => {
    if (!route.params) {
      setEmail("");
      setPassword("");
      setUsername("");
      setOver18(false);
      setAgreedToTerms(false);
      setIndustryAssociation(false);
      setLocation("");
      setName("");
      setMobileNumber("");
      setSelected([]);
    }
  }, [route.params]);
  const handleSelectPlan = async () => {
    setLoading(true);
    const payload = {
      email,
      password,
      userName: username,
      over18,
      agreedToTerms,
      industryAssociation,
      social,
      follower,
      price,
      location,
      profileUrl: photo,
      name,
      country: countryCode,
      number: mobileNumber,
      selected,
      gender,
    };
    await InfluencerVerify(payload, navigation, showAlert);
    setLoading(false);
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      {loading && <Loader loading={loading} />}
      <ScrollView style={{ backgroundColor: Color.colorWhite }}>
        <View style={styles.influencerRegistrationForm}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BrandorInfluencer")}
          >
            <View style={styles.header}>
              <Image
                style={styles.headerNavigation}
                resizeMode="cover"
                source={require("../../assets/depth-4-frame-Backarrow3x.png")}
              />
              <Text style={styles.headerText}>Sign up</Text>
              <View style={styles.headerNavigation} />
            </View>
          </TouchableOpacity>
          <FormField label="Name" value={name} setValue={setName} setInfluTypeDropdown={setInfluTypeDropdown} setGenderDropdown={setGenderDropdown} />
          <FormField label="Email" value={email} setValue={setEmail} setInfluTypeDropdown={setInfluTypeDropdown} setGenderDropdown={setGenderDropdown} />
          <FormField
            label="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            setInfluTypeDropdown={setInfluTypeDropdown}
            setGenderDropdown={setGenderDropdown}
          />
          <FormField label="Username" value={username} setValue={setUsername} setInfluTypeDropdown={setInfluTypeDropdown} setGenderDropdown={setGenderDropdown} />
          <View style={[styles.depth1Frame2, { zIndex: 15 }]}>
            <View style={[styles.depth2Frame02, styles.frameLayout]}>
              <View style={styles.frameLayout}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>Gender</Text>
                  <Text style={styles.madantoryText}>*</Text>
                </View>
                <View>
                  <View>
                    <DropDown
                      name={gender}
                      items={genderData}
                      placeholder={"Gender"}
                      icon={"none"}
                      dropDownOptionStyle={{
                        width: "100%",
                        paddingVertical: 16,
                      }}
                      dropDownContainerStyle={{ width: "100%" }}
                      dropDownItemsStyle={{ width: "100%" }}
                      titleStyle={{ paddingStart: 12, color: "#4F7A94" }}
                      selectedValue={setGender}
                      showElements={genderDropdown}
                      setShowElement={setGenderDropdown}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.mobileNoWrap}>
            <View style={[styles.fieldContainer, { width: "100%" }]}>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <Text style={styles.madantoryText}>*</Text>
              </View>
              <View style={[styles.textInput, styles.mobileNoWrap]}>
                <View
                  style={{
                    width: "85%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setOpenCountryCode(true);
                    }}
                  >
                    <Text
                      style={{
                        color: "#4F7A94",
                        fontSize: FontSize.size_base,
                        paddingEnd: 12,
                        borderRightWidth: 2,
                        borderRightColor: "#ccc",
                      }}
                    >
                      {countryCode}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      color: "#4F7A94",
                      fontSize: FontSize.size_base,
                      outlineStyle: "none",
                      width: "90%",
                      height: "100%",
                      paddingStart: 8,
                    }}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder={"Mobile Number"}
                    keyboardType="phone-pad"
                    onFocus={() => {
                      setInfluTypeDropdown(false)
                      setGenderDropdown(false)
                    }}
                  />
                </View>
                {mobileNoVerified ? (
                  <Image
                    style={{ width: 28, height: 28 }}
                    source={require("../../assets/verified_symbol.png")}
                  />
                ) : (
                  <TouchableOpacity onPress={() => setMobileNoVerified(true)}>
                    <Image
                      style={{ width: 28, height: 28 }}
                      source={require("../../assets/verify_symbol.png")}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={[styles.depth1Frame2, { height: "auto" }]}>
            <View style={[styles.depth2Frame02, styles.frameLayout, { height: "auto" }]}>
              <View style={[styles.frameLayout, { height: "auto" }]}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>
                    Influencer Type
                  </Text>
                  <Text style={styles.madantoryText}>*</Text>
                </View>
                <View>
                  <View>
                    <MultiDropDown
                      name={selected?.join(", ")}
                      items={data}
                      placeholder={"Select option"}
                      icon={"none"}
                      dropDownOptionStyle={{
                        width: "100%",
                        paddingVertical: 16,
                      }}
                      dropDownContainerStyle={{ width: "100%" }}
                      dropDownItemsStyle={{ width: "100%", top: "100%" }}
                      titleStyle={{ paddingStart: 12, color: "#4F7A94" }}
                      selectedValue={selected}
                      setSelectedValues={setSelected}
                      close={influTypeDropdown}
                      setClose={setInfluTypeDropdown}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.labelWrapper}>
                <Text style={styles.sectionHeaderText}>
                  Add social profiles
                </Text>
                <Text style={styles.madantoryText}>*</Text>
              </View>
              <Text style={styles.desc}>Atleast one field is mandatory</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setInfluTypeDropdown(false);
                setGenderDropdown(false)
                navigation.navigate("InfluencerSocialHandles", {
                  price,
                  follower,
                  photo,
                  social,
                  isCompleted,
                  email,
                  redirect: "InfluencerRegistrationForm",
                })
              }
              }
            >
              <Image
                style={styles.icon}
                contentFit="cover"
                source={
                  isCompleted?.addSocialProfile
                    ? require(`../../assets/green_tick.png`)
                    : require(`../../assets/depth-3-frame-11.png`)
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <View style={styles.labelWrapper}>
              <Text style={styles.sectionHeaderText}>Add Profile Photo</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setInfluTypeDropdown(false)
                setGenderDropdown(false)
                navigation.navigate("UserProfilePhoto", {
                  price,
                  follower,
                  social,
                  photo,
                  isCompleted,
                  redirect: "InfluencerRegistrationForm",
                })
              }
              }
            >
              <Image
                style={styles.icon}
                contentFit="cover"
                source={
                  isCompleted?.addProfilePhoto
                    ? require(`../../assets/green_tick.png`)
                    : require(`../../assets/depth-3-frame-11.png`)
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.labelWrapper}>
                <Text style={styles.sectionHeaderText}>
                  Add Social Followers
                </Text>
                <Text style={styles.madantoryText}>*</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setInfluTypeDropdown(false)
                setGenderDropdown(false)
                navigation.navigate("MaxFollowersNo", {
                  price,
                  social,
                  photo,
                  follower,
                  isCompleted,
                  redirect: "InfluencerRegistrationForm",
                })
              }
              }
            >
              <Image
                style={styles.icon}
                contentFit="cover"
                source={
                  isCompleted?.addSocialFollowers
                    ? require(`../../assets/green_tick.png`)
                    : require(`../../assets/depth-3-frame-11.png`)
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <View style={styles.labelWrapper}>
              <Text style={styles.sectionHeaderText}>
                Content and age restriction
              </Text>
            </View>
          </View>
          <HeadingDescToggle
            heading="I am over 18"
            desc="You must be at least 18 to use this service."
            toggleOn={over18}
            setToggleOn={setOver18}
          />
          <HeadingDescToggle
            heading="I agree to the terms of service"
            desc="You need to agree to the terms of service."
            toggleOn={agreedToTerms}
            setToggleOn={setAgreedToTerms}
            require={true}
          />

          <View style={styles.sectionHeader}>
            <View style={styles.labelWrapper}>
              <Text style={styles.sectionHeaderText}>Industry association</Text>
            </View>
          </View>
          <HeadingDescToggle
            heading="I am a member of an industry association"
            toggleOn={industryAssociation}
            setToggleOn={setIndustryAssociation}
          />
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.labelWrapper}>
                <Text style={styles.sectionHeaderText}>Price per post</Text>
                <Text style={styles.madantoryText}>*</Text>
              </View>
              <Text style={styles.desc}>Atleast one field is mandatory</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setGenderDropdown(false)
                setInfluTypeDropdown(false)
                navigation.navigate("PricePerPost", {
                  social,
                  follower,
                  photo,
                  price,
                  isCompleted,
                  redirect: "InfluencerRegistrationForm",
                })
              }
              }
            >
              <Image
                style={styles.icon}
                contentFit="cover"
                source={
                  isCompleted?.pricePerPost
                    ? require(`../../assets/green_tick.png`)
                    : require(`../../assets/depth-3-frame-11.png`)
                }
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.fieldContainer]}>
            <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.madantoryText}>*</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.textInput}>{location || "Search for location"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSelectPlan}
            disabled={!isFormValid}
            style={[
              styles.selectPlanButton,
              !isFormValid && styles.selectPlanButtonDisabled,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.selectPlanButtonText,
                  !isFormValid && styles.selectPlanButtonDisabledText,
                ]}
              >
                Select Plan
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.loginFrame}>
            <Text>Already have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CountryPicker
        show={openCountryCode}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setOpenCountryCode(false);
        }}
        onBackdropPress={() => {
          setOpenCountryCode(false)
        }}
        style={{
          modal: {
            height: 300,
            width: "100%",
            maxWidth: "100%",
          },
        }}
      />
      <PlaceSearchBar
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handlePlaceSelected={handlePlaceSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create(InfluencerRegistrationFormStyles);

export default InfluencerRegistrationForm;
