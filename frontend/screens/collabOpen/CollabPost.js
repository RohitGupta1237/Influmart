import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "expo-image";
import { getAllCollabPosts } from "../../controller/collabOpenController";
import { useAlert } from "../../util/AlertContext";
import { Padding } from "../../GlobalStyles";
import ImageWithFallback from "../../util/ImageWithFallback";

const CollabPost = ({ navigation }) => {
  const [selectedFooterItem, setSelectedFooterItem] = useState("My Network");
  const [data, setData] = useState([]); // Original data fetched from API
  const [filteredData, setFilteredData] = useState([]); // Data after applying search and category filters
  const [searchText, setSearchText] = useState(""); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const { showAlert } = useAlert();

  useEffect(() => {
    const getData = async () => {
      await getAllCollabPosts(setData, showAlert);
    };

    getData();
  }, []);

  useEffect(() => {
    // Filter data based on search text and selected category
    const applyFilters = () => {
      let filtered = data;

      // Apply category filter if a category is selected
      if (selectedCategory) {
        filtered = filtered.filter(post =>
          post.campaignType?.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }

      // Apply search filter
      if (searchText) {
        filtered = filtered.filter(post =>
          post.brandName?.toLowerCase().includes(searchText.toLowerCase()) ||
          post.campaignType?.toLowerCase().includes(searchText.toLowerCase()) ||
          post.postInfo?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      setFilteredData(filtered);
    };

    applyFilters();
  }, [searchText, selectedCategory, data]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Home</Text>
        </TouchableOpacity>
        <Image
          source={require("../../assets/notification_icon_light.png")}
          style={{ width: 28, height: 28 }}
        />
      </View>

      <ScrollView>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Find"
              value={searchText}
              onChangeText={setSearchText} // Update search text on input change
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Text style={styles.categoryTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Grocery", "Electronics", "Fashion", "Toys", "Beauty", "Home Decoration", "Fitness", "Education", "Others"].map(
              (category, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.categoryTag,
                    selectedCategory === category && { backgroundColor: "#ddd" } // Highlight selected category
                  ]}
                  onPress={() => setSelectedCategory(category)} // Update selected category on press
                >
                  <Text>{category}</Text>
                </Pressable>
              )
            )}
          </ScrollView>
        </View>

        {/* Posts */}
        <View style={styles.posts}>
          {(filteredData.length > 0 ? filteredData : data)?.map((post, index) => (
            <Pressable
              key={index}
              onPress={() => {
                navigation.navigate("CampaignDetail", { data: post });
              }}
            >
              <View style={styles.postCard}>
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>{post.brandName}</Text>
                  <Text style={styles.postName}>{post.campaignType}</Text>
                  <Text
                    style={styles.postDegree}
                  >{`${post.numberOfInfluencers} Influencers needed`}</Text>
                </View>
                {post?.imageSource == null ? (
                  <ImageWithFallback
                    imageStyle={styles.postImage}
                    image={post?.imageSource}
                  />
                ) : (
                  post?.imageSource && (
                    <ImageWithFallback
                      imageStyle={styles.postImage}
                      image={post?.imageSource}
                    />
                  )
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8EDF2",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  categories: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: "#E8EDF2",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  posts: {
    padding: 16,
  },
  postCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    height: "auto",
    paddingHorizontal: Padding.p_base,
  },
  postContent: {
    flex: 1,
    paddingVertical: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    overflow: "hidden",
  },
  postName: {
    fontSize: 14,
    color: "#4F7396",
  },
  postDegree: {
    fontSize: 12,
    color: "#4F7396",
  },
  postImage: {
    width: 130,
    height: 65,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerItem: {
    alignItems: "center",
  },
  footerItemText: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
  },
  footerItemTextSelected: {
    color: "#000",
  },
});

export default CollabPost;
