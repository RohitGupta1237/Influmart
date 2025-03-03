import React, { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Color } from "../../GlobalStyles";
import MultipleSelectList from "../../shared/MultiSelect";
import { SendOtp } from "../../controller/signupController";
import { signupStyles } from "./SignUpStyles.scss";
import { useAlert } from "../../util/AlertContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon component
import Loader from '../../shared/Loader'
import MultiDropDown from '../../shared/MultiDropDown'

const BrandRegistrationForm = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false)
  const { showAlert } = useAlert();
  const payload = route.params?.payload;
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const[brandTypeDropdown,setBrandTypeDropdown]=useState(false)
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
  const clearForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setUsername("");
    setSelected([]);
  }, []);


  // Listen for navigation focus to clear form data
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", clearForm);
    return unsubscribe;
  }, [navigation, clearForm]);

  const handleSubmit = async () => {
    const payload = {
      email,
      password,
      category: selected,
      name: username,
      brandName: name,
    };
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showAlert("Brand SignUp Error", "Please enter a valid email address");
      return;
    }
    if (!email || !password || !selected.length || !username || !name) {
      showAlert("Brand SignUp Error", "Please fill all the fields");
      return;
    }
    if (password.length < 8) {
      showAlert(
        "Brand SignUp Error",
        "Password should be at least 8 characters long"
      );
      return;
    }
    setLoading(true)
    await SendOtp(payload, navigation, showAlert);
    setLoading(false)
  };

  return (
    <ScrollView style={styles.scrollView}>
      {loading && <Loader loading={loading} />}
      <View style={styles.brandregistrationform}>
        <View style={[styles.depth0Frame0, styles.frameLayout2]}>
          <TouchableOpacity onPress={() => navigation.navigate("Homepage")}>
            <View style={[styles.depth1Frame0, styles.depth1FrameSpaceBlock]}>
              <View style={[styles.depth2Frame0, styles.frameFlexBox]}>
                <View style={[styles.depth3Frame0, styles.frameLayout1]}>
                  <Image
                    style={styles.depth4Frame0}
                    contentFit="cover"
                    source={require("../../assets/depth-4-frame-07.png")}
                  />
                </View>
                <View
                  style={[styles.depth4Frame1, styles.depth1FrameSpaceBlock]}
                >
                  <View>
                    <Text style={styles.createAnAccount}>
                      Create a Brand account
                    </Text>
                  </View>
                </View>
                <View style={styles.frameFlexBox}>
                  <View style={[styles.depth4Frame01, styles.frameLayout1]}>
                    <View style={[styles.depth5Frame0, styles.frameLayout1]} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.depth1Frame2}>
            <View style={[styles.depth2Frame02, styles.frameLayout]}>
              <View style={styles.frameLayout}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>Name</Text>
                  <Text style={styles.mandatoryText}>*</Text>
                </View>
                <View>
                  <View style={[styles.depth5Frame01]}>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="Brand Name"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.depth1Frame2}>
            <View style={[styles.depth2Frame02, styles.frameLayout]}>
              <View style={styles.frameLayout}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>Email</Text>
                  <Text style={styles.mandatoryText}>*</Text>
                </View>
                <View>
                  <View style={[styles.depth5Frame01]}>
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.depth1Frame2}>
            <View style={[styles.depth2Frame02, styles.frameLayout]}>
              <View style={styles.frameLayout}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>Password</Text>
                  <Text style={styles.mandatoryText}>*</Text>
                </View>
                <View
                  style={[
                    styles.depth5Frame01,
                    styles.depth5FrameBg,
                    { flex: 1 },
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                  />
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
                </View>
              </View>
            </View>
          </View>
          <View style={styles.depth1Frame6}>
            <View style={[styles.depth2Frame06]}>
              <View style={styles.frameLayout}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>Username</Text>
                  <Text style={styles.mandatoryText}>*</Text>
                </View>
                <View style={styles.depth4Frame06}>
                  <View style={[styles.depth5Frame01, styles.depth5FrameBg]}>
                    <TextInput
                      style={styles.textInput}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Username"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.depth1Frame2,{height:"auto"}]}>
            <View style={[styles.depth2Frame02, styles.frameLayout,{height:"auto"}]}>
              <View style={[styles.frameLayout,{height:"auto"}]}>
                <View style={styles.depth4Frame02}>
                  <Text style={[styles.email, styles.emailTypo]}>
                    Brand Type
                  </Text>
                  <Text style={styles.mandatoryText}>*</Text>
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
                      dropDownItemsStyle={{ width: "100%", top: -470 }}
                      titleStyle={{ paddingStart: 12, color: "#4F7A94" }}
                      selectedValue={selected}
                      setSelectedValues={setSelected}
                      close={brandTypeDropdown}
                      setClose={setBrandTypeDropdown}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.depth1Frame6}>
            <View style={styles.depth2Frame06}>
              <View style={styles.depth3FrameLayout}>
                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={handleSubmit}
                >
                  <View style={[styles.depth4Frame07, styles.frameBg]}>
                    <View style={[styles.depth5Frame06, styles.frameBg]}>
                      <View style={styles.depth7Frame0}>
                        <Text style={[styles.signUp, styles.signUpTypo]}>
                          Generate OTP
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.loginFrame}>
              <Text style={styles.termsText}>By joining, you agree to our </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TosScreen", {
                    navigate: "BrandRegistrationForm",
                  })
                }
              >
                <Text style={styles.linkText}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PPScreen", {
                    navigate: "BrandRegistrationForm",
                  })
                }
              >
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginFrame}>
              <Text>Already have account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginPageBrands")}
              >
                <Text style={{ color: Color.colorDodgerblue }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...signupStyles,
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BrandRegistrationForm;
