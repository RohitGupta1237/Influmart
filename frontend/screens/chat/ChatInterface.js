import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Depth1Frame7 from "../../components/Depth1Frame7";
import MessageInput from "./components/MessageInput";
import {
  getMessages,
  sendMessage,
} from "../../controller/connectionsController";
import { chatStyles } from "./ChatStyles.scss";
import { useSocketContext } from "../../util/SocketContext";
import { Image } from "expo-image";
import { useAlert } from "../../util/AlertContext";
import Loader from "../../shared/Loader";
import ImageWithFallback from "../../util/ImageWithFallback";

const SenderMessage = ({ name, profileUrl, content, timeAgo, isSelectedImage }) => {
  return (
    <View style={styles.senderContainer}>
      <View style={styles.senderMessageContainer}>
        <Text style={styles.senderName}>{name}</Text>
        <Text style={styles.senderMessage}>{content}</Text>
        <Text style={styles.senderTimeAgo}>{timeAgo}</Text>
      </View>
      {profileUrl == null ? (
        <ImageWithFallback
          imageStyle={styles.profileImage}
          image={profileUrl}
          isSelectedImage={isSelectedImage}
        />
      ) : (
        profileUrl && (
          <ImageWithFallback
            imageStyle={styles.profileImage}
            image={isNaN(profileUrl)==false?`${profileUrl}`:profileUrl}
            isSelectedImage={isSelectedImage}
          />
        )
      )}
    </View>
  );
};

const ReceiverMessage = ({ name, profileUrl, content, timeAgo, isSelectedImage }) => {
  return (
    <View style={styles.receiverContainer}>
      {profileUrl == null || profileUrl == undefined ? (
        <ImageWithFallback
          imageStyle={styles.profileImage}
          image={profileUrl}
          isSelectedImage={isSelectedImage}
        />
      ) : (
        profileUrl && (
          <ImageWithFallback
            imageStyle={styles.profileImage}
            image={isNaN(profileUrl)==false?`${profileUrl}`:profileUrl}
            isSelectedImage={isSelectedImage}
          />
        )
      )}
      <View style={styles.receiverMessageContainer}>
        <Text style={styles.receiverName}>{name}</Text>
        <Text style={styles.receiverMessage}>{content}</Text>
        <Text style={styles.receiverTimeAgo}>{timeAgo}</Text>
      </View>
    </View>
  );
};

const ChatInterface = ({ route, navigation }) => {
  const { name, image, conversationId, userId, userType, receiverId, isSelectedImage } =
    route.params;
  const [messages, setMessages] = useState([]);
  const { socket } = useSocketContext();
  const scrollView = useRef();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getdata = async () => {
      await getMessages(conversationId, userId, userType, setMessages);
      setLoading(false);
    };
    setLoading(true);
    getdata();
  }, [conversationId]);

  const handleSend = async (message) => {
    if (message.trim() != "") {
      await sendMessage(userId, receiverId, message);
      await getMessages(conversationId, userId, userType, setMessages);
    } else showAlert("Error", "Please provide proper message");
  };
  return (
    <View style={styles.container}>
      {loading && <Loader loading={loading} />}
      <TouchableOpacity
        style={styles.topbar}
        onPress={() => navigation.navigate("InboxInterface")}
      >
        <Depth1Frame7
          depth4Frame0={require("../../assets/depth-4-frame-017.png")}
          requestDetails={`Chat with ${name}`}
          depth3Frame0BackgroundColor="#fff"
          requestDetailsWidth={"auto"}
          depth4Frame0FontFamily="BeVietnamPro-Bold"
          depth4Frame0Color="#000"
        />
      </TouchableOpacity>
      <ScrollView
        ref={scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        onContentSizeChange={() => scrollView.current?.scrollToEnd()}
      >
        <View style={styles.chatContent}>
          <View style={styles.messagesContainer}>
            {messages.map((message, index) =>
              message.sender.name == "You" ? (
                <SenderMessage
                  key={index}
                  name={message?.sender?.name}
                  content={message?.content}
                  timeAgo={message?.timeAgo}
                  profileUrl={message?.sender?.profileUrl}
                  isSelectedImage={message?.sender?.isSelectedImage}
                />
              ) : (
                <ReceiverMessage
                  key={index}
                  name={message?.sender?.name}
                  content={message?.content}
                  timeAgo={message?.timeAgo}
                  profileUrl={message?.sender?.profileUrl}
                  isSelectedImage={message?.sender?.isSelectedImage}
                />
              )
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <MessageInput setNewMessage={handleSend} profileUrl={isNaN(image)==false?`${image}`:image} isSelectedImage={isSelectedImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create(chatStyles);

export default ChatInterface;
