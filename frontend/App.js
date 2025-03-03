import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { AlertProvider } from "./util/AlertContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import all your screens here
import Homepage from "./screens/Homepage";
import BrandorInfluencer from "./screens/BrandorInfluencer";
import OtpVerification from "./screens/OtpVerification";
import LoginPage from "./screens/login/LoginPage";
import FriendRequestPage from "./screens/FriendRequestPage";
import AccountCreatedSuccessfullyNoti from "./screens/AccountCreatedSuccessfullyNoti";
import FailedPaymentStatus from "./screens/FailedPaymentStatus";
import Analytics from "./screens/Analytics/Analytics";
import InfluencersList from "./screens/InfluencerList/InfluencersList";
import InboxInterface from "./screens/inbox/InboxInterface";
import ChatInterface from "./screens/chat/ChatInterface";
import InfluencerRegistrationForm from "./screens/Influencer/InfluencerRegistrationForm";
import PlanChooseInterface from "./screens/Influencer/PlanChooseInterface";
import LoginPageBrand from "./screens/login/LoginPageBrands";
import BrandAssosciated from "./screens/BrandsAssosciated";
import AdminPanel from "./screens/AdminPanel";
import FilterUI from "./screens/FiltersUI";
import BrandAccountSignupDataPreview from "./screens/BrandAccountSignupDataPreview";
import BrandRegistrationForm from "./screens/signup/BrandRegistrationForm";
import AddHandles from "./screens/Influencer/components/AddHandles";
import PricePerPost from "./screens/Influencer/components/PricePerPost";
import UserProfilePhoto from "./screens/Influencer/components/UserProfilePhoto";
import MaxFollowersNo from "./screens/Influencer/components/MaxFollowersNo";
import InfluencerConfirmAccount from "./screens/Influencer/InfluencerConfirmAccount";
import InfluencerAccountSuccess from "./screens/Influencer/InfluencerAccountSuccess";
import InfluencerLogOutPage from "./screens/Influencer/Settings/InfluencerLogout";
import InfluencerDeleteAccountPage from "./screens/Influencer/Settings/Support/InfluencerDeleteAccount";
import InfluencerContactUs from "./screens/Influencer/Settings/Support/InfluencerContactUs";
import InfluencerHelpCenter from "./screens/Influencer/Settings/Support/InfluencerHelpCenter";
import InfluencerManageAccount from "./screens/Influencer/Settings/InfluencerAccountManage";
import TosScreen from "./screens/TermsAndPrivacy/TermsOfService";
import PPScreen from "./screens/TermsAndPrivacy/PrivacyPolicy";
import UserProfile from "./screens/UserProfile/UserProfile";
import BrandAdminPanel from "./screens/Brand/BrandAdminPanel";
import BrandLogOutPage from "./screens/Brand/Settings/BrandLogout";
import BrandDeleteAccountPage from "./screens/Brand/Settings/Support/BrandDeleteAccount";
import BrandManageAccount from "./screens/Brand/Settings/BrandAccountManage";
import ForgotPasswordPage from "./screens/login/ForgotPasswordPage";
import ResetPasswordPage from "./screens/login/ResetPasswordPage";
import AboutUs from "./screens/AboutUs";
import BrandService from "./screens/BrandService";
import InfluencerService from "./screens/InfluencerService";
//import { CLIENT_URL } from "@env";
const CLIENT_URL = "http://192.168.73.76:8081";
import { SocketContextProvider } from "./util/SocketContext";
import CollabPost from "./screens/collabOpen/CollabPost";
import CampaignDetail from "./screens/collabOpen/CampaignDetail";
import CollabForm from "./screens/collabOpen/CollabForm";
import BrandProfile from "./screens/BrandProfile/BrandProfile";
import BrandCollabRequestPage from "./screens/BrandProfile/components/BrandCollabRequestPage";
import CollabOpenPayment from "./screens/collabOpen/CollabOpenPayment";
import RaiseTicket from "./screens/Brand/Settings/Support/RaiseTicket";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [Linking.createURL("/"), "influmart://"],
  config: {
    screens: {
      ResetPassword: "reset-password/:token",
      // other routes
    },
  },
};

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState("Login");
  const [fontsLoaded, error] = useFonts({
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Medium": require("./assets/fonts/Lexend-Medium.ttf"),
    "Lexend-Bold": require("./assets/fonts/Lexend-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "WorkSans-Regular": require("./assets/fonts/WorkSans-Regular.ttf"),
    "WorkSans-Medium": require("./assets/fonts/WorkSans-Medium.ttf"),
    "WorkSans-Bold": require("./assets/fonts/WorkSans-Bold.ttf"),
    "WorkSans-Black": require("./assets/fonts/WorkSans-Black.ttf"),
    "Manrope-Regular": require("./assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Bold": require("./assets/fonts/Manrope-Bold.ttf"),
    "BeVietnamPro-Regular": require("./assets/fonts/BeVietnamPro-Regular.ttf"),
    "BeVietnamPro-Medium": require("./assets/fonts/BeVietnamPro-Medium.ttf"),
    "BeVietnamPro-Bold": require("./assets/fonts/BeVietnamPro-Bold.ttf"),
    "PlusJakartaSans-Regular": require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Bold": require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("./assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  React.useEffect(() => {
    checkTokenValidity();
  }, []);

  const checkTokenValidity = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          if (decodedToken?.brandId) {
            setInitialRoute("BrandProfile");
          } else {
            setInitialRoute("UserProfile");
          }
        } else {
          setInitialRoute("Homepage");
        }
      } else {
        setInitialRoute("Homepage");
      }
    } catch (error) {
      console.error("Error checking token:", error);
    }
  };

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AlertProvider>
          <SocketContextProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name="Homepage"
                  component={Homepage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandorInfluencer"
                  component={BrandorInfluencer}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandAccountReviewNotification"
                  component={BrandAccountSignupDataPreview}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="TosScreen"
                  component={TosScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="PPScreen"
                  component={PPScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerConfirmAccount"
                  component={InfluencerConfirmAccount}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandRegistrationForm"
                  component={BrandRegistrationForm}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ResetPassword"
                  component={ResetPasswordPage}
                />
                <Stack.Screen
                  name="InfluencerSocialHandles"
                  component={AddHandles}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="UserProfilePhoto"
                  component={UserProfilePhoto}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="MaxFollowersNo"
                  component={MaxFollowersNo}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="PricePerPost"
                  component={PricePerPost}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OtpVerification"
                  component={OtpVerification}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ForgotPasswordPage"
                  component={ForgotPasswordPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AdminPanel"
                  component={AdminPanel}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerLogoutPage"
                  component={InfluencerLogOutPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerAccountDeletePage"
                  component={InfluencerDeleteAccountPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerContactUsPage"
                  component={InfluencerContactUs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerHelpCenterPage"
                  component={InfluencerHelpCenter}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerManageAccountPage"
                  component={InfluencerManageAccount}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerAccountSuccess"
                  component={InfluencerAccountSuccess}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="LoginPage"
                  component={LoginPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandProfile"
                  component={BrandProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="RaiseTicket"
                  component={RaiseTicket}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandCollabRequestPage"
                  component={BrandCollabRequestPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CollabPost"
                  component={CollabPost}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CampaignDetail"
                  component={CampaignDetail}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CollabForm"
                  component={CollabForm}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="CollabOpenPayment"
                  component={CollabOpenPayment}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="LoginPageBrands"
                  component={LoginPageBrand}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="BrandAdminPanel"
                  component={BrandAdminPanel}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="BrandLogoutPage"
                  component={BrandLogOutPage}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="BrandAccountDeletePage"
                  component={BrandDeleteAccountPage}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="BrandManageAccountPage"
                  component={BrandManageAccount}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="FriendRequestPage"
                  component={FriendRequestPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandsAssosciated"
                  component={BrandAssosciated}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AccountCreatedSuccessfullyNoti"
                  component={AccountCreatedSuccessfullyNoti}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="FailedPaymentStatus"
                  component={FailedPaymentStatus}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Analytics"
                  component={Analytics}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencersList"
                  component={InfluencersList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InboxInterface"
                  component={InboxInterface}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ChatInterface"
                  component={ChatInterface}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="UserProfile"
                  component={UserProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerRegistrationForm"
                  component={InfluencerRegistrationForm}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="PlanChooseInterface"
                  component={PlanChooseInterface}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="FilterUI"
                  component={FilterUI}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AboutUs"
                  component={AboutUs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BrandService"
                  component={BrandService}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="InfluencerService"
                  component={InfluencerService}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SocketContextProvider>
        </AlertProvider>
      </GestureHandlerRootView>
    </>
  );
};
export default App;
