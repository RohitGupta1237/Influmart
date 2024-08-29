import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddHandlesStyles } from "./AddHandle.scss";
import { useAlert } from "../../../util/AlertContext";
import {
  fetchRecentHighlightVideos,
  fetchYouTubeAnalytics,
  fetchYouTubeAnalyticsOverAll,
} from "../../../util/AuthFunction";
import { InfluencerSignUp } from "../../../controller/signupController";

WebBrowser.maybeCompleteAuthSession();

const FormField = ({
  label,
  placeholder,
  value,
  setValue,
  isVerified,
  handleVerify,
}) => {
  const [disableButton,setDisableButton] = useState(true)
  useEffect(()=>{
    if(value){
      setDisableButton(false)
    }else{
      setDisableButton(true)
    }
  },[value])
  return (
    <View style={styles.formField}>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          editable={!isVerified}
        />
      </View>
      <View style={styles.verifyContainer}>
        <TouchableOpacity
          style={[styles.verifyButton, disableButton || isVerified && styles.verifiedButton]}
          onPress={handleVerify}
          disabled={ disableButton || isVerified}
        >
          <Image
            style={styles.verifyIcon}
            contentFit="cover"
            source={
              isVerified
                ? require("../../../assets/verified_symbol.png")
                : require("../../../assets/verify_symbol.png")
            }
          />
          <Text style={styles.verifyText}>
            {isVerified ? "Verified" : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddHandles = ({ route, navigation }) => {
  const [verifiedAccounts, setVerifiedAccounts] = useState([]);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const { price, follower, photo, isCompleted, redirect, email } =
    route.params || {};
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [youtubeAnalytics, setYoutubeAnalytics] = useState(null);
  const { showAlert } = useAlert();
  const [monthlyData, setMonthlyData] = useState([]);
  let userYtData;
  const [instagramInfo, setInstagramInfo] = useState({
    username: "",
    email: "",
  });

  const [request, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId:
      "329932494226-70dt8rglfndtp9lulruvn1c3u8n9igmm.apps.googleusercontent.com",
    iosClientId:
      "329932494226-1ovccufudqbu1ppo8f1sdnuu7ffl32fr.apps.googleusercontent.com",
    webClientId:
      "329932494226-rkpausht5lbbm9umvspatt9973pco2q6.apps.googleusercontent.com",
    scopes: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ],
  });

  const [fbRequest, fbResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: "1563140204620923",
    scopes: [
      "public_profile",
      "email",
      "user_posts",
      "user_link",
      "user_likes",
      "user_friends"
    ],
  });

  const checkFacebookTokenAndFetchInstagram = async () => {
    const fbAccessToken = await AsyncStorage.getItem("fbAccessToken");
    // if (fbAccessToken) {
    //   handleInstagramEffect(fbAccessToken);
    // } else {
    //   promptFacebookAsync();
    // }
  };

  useEffect(() => {
    if (
      googleResponse &&
      googleResponse.type === "success" &&
      googleResponse.authentication
    ) {
      handleGoogleEffect(googleResponse.authentication.accessToken).catch(
        (error) => {
          console.error("Google Effect Error:", error);
        }
      );
    }
  }, [googleResponse]);

  useEffect(() => {
    if (
      fbResponse &&
      fbResponse.type === "success" &&
      fbResponse.authentication
    ) {
      handleFacebookEffect(fbResponse.authentication.accessToken).catch(
        (error) => {
          console.error("Facebook Effect Error:", error);
        }
      );
    }
  }, [fbResponse]);

  useEffect(() => {
    if (route.params?.social) {
      const { ig, tw, fb, yt, tt, verifyAccount } = route.params.social;
      if (ig) setInstagram(ig);
      if (tw) setTwitter(tw);
      if (fb) setFacebook(fb);
      if (yt) setYoutube(yt);
      if (tt) setTiktok(tt);
      if (verifyAccount) setVerifiedAccounts(verifyAccount);
    }
  }, [route.params?.social]);

  const handleGoogleEffect = async (accessToken) => {
    try {
      setToken(accessToken);
      await AsyncStorage.setItem("ytAccessToken", accessToken);
      await getUserInfo(accessToken);
      await fetchYouTubeData(accessToken);
      //await fetchYouTubeAnalytics(accessToken)
    } catch (error) {
      console.error("Error during Google effect:", error);
    }
  };

  const handleFacebookEffect = async (accessToken) => {
    try {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`
      );
      const userInfo = await userInfoResponse.json();
      setUserInfo(userInfo);
      await AsyncStorage.setItem("fbAccessToken", accessToken);
      console.log(userInfo);
      await fetchFacebookUserData(accessToken);
      if (userInfo.email === email) {
        if (facebook) {
          setVerifiedAccounts((prev) => [...prev, "facebook"]);
        } else {
          showAlert("Error", "Data mismatch. Please provide facebook username");
        }
      } else {
        showAlert("Error", "Email does not match the email provided");
      }
    } catch (error) {
      console.log("Error in handleFacebookEffect:", error);
    }
  };

  async function fetchFacebookUserData(token) {
    try {
      // Fetch user profile information
      const profileResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,link&access_token=${token}`
      );
      const profileData = await profileResponse.json();
  
      // Fetch user's likes
      const likesResponse = await fetch(
        `https://graph.facebook.com/me/likes?access_token=${token}`
      );
      const likesData = await likesResponse.json();
  
      // Fetch user's posts
      const postsResponse = await fetch(
        `https://graph.facebook.com/me/posts?access_token=${token}`
      );
      const postsData = await postsResponse.json();
  
      // Fetch recent highlights and engagement rates
      const insightsData = await fetchFacebookInsights(token);
  
      // Compile all the data together
      const userData = {
        profile: profileData,
        likes: likesData.data.length,
        posts: postsData.data.length,
        insights: insightsData,
      };
  
      console.log("User Data:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching Facebook user data:", error);
    }
  }
  
  async function fetchFacebookInsights(accessToken) {
    const apiVersion = "v16.0"; // Use the latest Facebook API version
    const fields =
      "insights.metric(post_impressions,post_engaged_users,post_reactions,post_shares,post_comments).period(month)";
    const endpoint = `https://graph.facebook.com/${apiVersion}/me/accounts?fields=${fields}&access_token=${accessToken}`;
  
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error.message);
      }
  
      let totalImpressions = 0;
      let totalEngagedUsers = 0;
      let totalReactions = 0;
      let totalShares = 0;
      let totalComments = 0;
  
      const insights = data.data.map((page) => {
        const impressions = page.insights.data.find(metric => metric.name === 'post_impressions')?.values.slice(0, 2).reduce((acc, val) => acc + val.value, 0) || 0;
        const engagedUsers = page.insights.data.find(metric => metric.name === 'post_engaged_users')?.values.slice(0, 2).reduce((acc, val) => acc + val.value, 0) || 0;
        const reactions = page.insights.data.find(metric => metric.name === 'post_reactions')?.values.slice(0, 2).reduce((acc, val) => acc + val.value, 0) || 0;
        const shares = page.insights.data.find(metric => metric.name === 'post_shares')?.values.slice(0, 2).reduce((acc, val) => acc + val.value, 0) || 0;
        const comments = page.insights.data.find(metric => metric.name === 'post_comments')?.values.slice(0, 2).reduce((acc, val) => acc + val.value, 0) || 0;
  
        totalImpressions += impressions;
        totalEngagedUsers += engagedUsers;
        totalReactions += reactions;
        totalShares += shares;
        totalComments += comments;
  
        return {
          pageId: page.id,
          pageName: page.name,
          impressions,
          engagedUsers,
          reactions,
          shares,
          comments,
          engagementRate: (engagedUsers / impressions) * 100,
        };
      });
  
      const highlights = {
        totalImpressions,
        totalEngagedUsers,
        totalReactions,
        totalShares,
        totalComments,
        engagementRate: (totalEngagedUsers / totalImpressions) * 100,
      };
  
      console.log("Insights and Highlights:", { insights, highlights });
      return { insights, highlights };
    } catch (error) {
      console.error("Error fetching Facebook insights:", error);
      return null;
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
      userYtData = { email: user.email, verified: user.verified_email };
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  const fetchYouTubeData = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      userYtData = {
        ...userYtData,
        channel: data.items[0]?.snippet?.customUrl,
      };
      await AsyncStorage.setItem("ytChannelId", data.items[0]?.id);
      const analytics = await fetchYouTubeAnalytics();
      const highlights = await fetchRecentHighlightVideos();
      const overAll = await fetchYouTubeAnalyticsOverAll();
      await AsyncStorage.setItem(
        "ytDelete",
        JSON.stringify({
          analytics: analytics,
          highlights: highlights,
          ytChannelId: data.items[0]?.id,
          overAll: overAll,
        })
      );
      if (userYtData.email === email) {
        if (userYtData.verified) {
          if (youtube.toLowerCase() == userYtData.channel) {
            setVerifiedAccounts((prev) => [...prev, "youtube"]);
          } else {
            showAlert(
              "Error",
              "Data mismatch. Please provide your youtube channel"
            );
          }
        } else {
          showAlert("Error", "Your mail is not verified by google");
        }
      } else {
        showAlert("Error", "Email does not match the email provided");
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 24, height: 24 }}></View>
          <Text style={styles.headerText}>Add Accounts</Text>
          <View style={styles.headerIcon}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(redirect, {
                  price,
                  follower,
                  photo,
                  isCompleted,
                })
              }
            >
              <Image
                style={styles.headerImage}
                contentFit="cover"
                source={require("../../../assets/cross_symbol.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FormField
          label="Instagram"
          placeholder="username"
          value={instagram}
          setValue={setInstagram}
          isVerified={verifiedAccounts.includes("instagram")}
          handleVerify={() => {}}
        />
        <FormField
          label="Twitter"
          placeholder="@username"
          value={twitter}
          setValue={setTwitter}
          isVerified={verifiedAccounts.includes("twitter")}
          handleVerify={() => {
            showAlert("Info", "Twitter verification not yet implemented");
          }}
        />
        <FormField
          label="Facebook"
          placeholder="username"
          value={facebook}
          setValue={setFacebook}
          isVerified={verifiedAccounts.includes("facebook")}
          handleVerify={() => promptFacebookAsync()}
        />
        <FormField
          label="YouTube"
          placeholder="@channelName"
          value={youtube}
          setValue={setYoutube}
          isVerified={verifiedAccounts.includes("youtube")}
          handleVerify={() => promptGoogleAsync()}
        />
        <FormField
          label="TikTok"
          placeholder="@username"
          value={tiktok}
          setValue={setTiktok}
          isVerified={verifiedAccounts.includes("tiktok")}
          handleVerify={() => {
            showAlert("Info", "TikTok verification not yet implemented");
          }}
        />

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            navigation.navigate(redirect, {
              social: {
                ig: instagram,
                tw: twitter,
                fb: facebook,
                yt: youtube,
                tt: tiktok,
                verifyAccount: verifiedAccounts,
              },
              price,
              follower,
              photo,
              isCompleted: {
                ...isCompleted,
                addSocialProfile: verifiedAccounts.length != 0 && true,
              },
            });
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = AddHandlesStyles;

export default AddHandles;
