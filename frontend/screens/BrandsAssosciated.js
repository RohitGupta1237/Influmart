import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { getAllBrandProfiles } from '../controller/brandController'
import { useAlert } from '../util/AlertContext'
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageWithFallback from "../util/ImageWithFallback";
import { formatNumber } from "../helpers/GraphData";
import Loader from '../shared/Loader'


const BrandAssosciated = ({ active }) => {
  const navigation = useNavigation();
  const { showAlert } = useAlert()
  const [isSearchBarOpen, setIsSearchBarOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [brands, setBrands] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    async function fetchData() {
      const res = await getAllBrandProfiles(showAlert)
      setBrands(res)
      setLoading(false)
    }
    setLoading(true)
    fetchData()
  }, [])

  const handleBack = async () => {
    const brand = await AsyncStorage.getItem("brandId")
    const influencer = await AsyncStorage.getItem("influencerId")
    if (brand) {
      navigation.navigate('BrandProfile')
    } else if (influencer) {
      navigation.navigate('UserProfile')
    } else {
      navigation.navigate('Homepage')
    }
  }
  const handleSearch = () => {
    setIsSearchBarOpen(!isSearchBarOpen)
  }

  const filteredBrands = brands.filter((brand) => {
    const searchTerm = searchValue?.toLowerCase();
    return (
      (brand?.brandName?.toLowerCase()?.includes(searchTerm) || '') ||
      (brand?.name?.toLowerCase()?.includes(searchTerm) || '') ||
      (brand?.category?.toLowerCase()?.includes(searchTerm) || '')
    );
  });

  return (
    <View style={styles.galileoDesign}>
      {loading && <Loader loading={loading} />}
      <View style={[styles.depth0Frame0, styles.frameBg]}>
        <View style={[styles.depth1Frame0, styles.depth1FrameSpaceBlock]}>
          <View style={{ width: "100%", height: "auto" }}>
            <View style={styles.depth2Frame0}>

              <TouchableOpacity style={styles.depth3Frame0} onPress={() => handleBack()}>
                <Image
                  style={styles.depth4Frame0}
                  contentFit="cover"
                  source={require("../assets/depth-4-frame-010.png")}
                />
              </TouchableOpacity>
              {
                isSearchBarOpen ?
                  <TextInput
                    onChangeText={(text) => setSearchValue(text)}
                    style={styles.SearchBar}
                    placeholder="Search anything"
                  />
                  :
                  <View style={styles.depth3Frame1}>
                    <View style={styles.depth4Frame01}>
                      <View style={styles.depth5Frame0}>
                        <Text style={styles.allPartners}>Brands</Text>
                      </View>
                    </View>
                  </View>
              }
              <View style={styles.depth3Frame2}>
                <TouchableOpacity onPress={handleSearch}>
                  <Image style={{ width: 24, height: 24 }} source={require('../assets/depth-5-frame-0.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.depth1Frame1}>
            {filteredBrands.length > 0 ?
              filteredBrands.map((brand, index) => {
                return (
                  <View>
                    <TouchableOpacity key={index} onPress={() => { console.log(brand?.profileUrl) }}>
                      <View style={styles.depth2FrameLayout}>
                        <View style={styles.profileTop}>
                          <Text style={styles.userNameText}>@ {brand?.name}</Text>
                          <Text style={styles.insightText}>{brand?.category}</Text>
                        </View>
                        <Text style={styles.google}>{brand?.brandName}</Text>
                        <ImageWithFallback imageStyle={styles.depth4Frame03} image={brand?.profileUrl} isSelectedImage={brand?.isSelectedImage} />
                        <View style={styles.profileBottomContainer}>
                          <View style={styles.profileBottomChip}>
                            <Text style={styles.collabrationText}>Collaborations</Text>
                            <Text style={styles.collaborationCount}>{brand?.collaborationCount ? formatNumber(brand?.collaborationCount) : "N/A"}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.divider}></View>
                  </View>
                )
              })
              :
              <View>
                <Text style={{ color: "#ccc", fontSize: FontSize.size_base }}>No Brands found</Text>
              </View>
            }

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameBg: {
    backgroundColor: Color.colorWhite,
    width: "100%",
    height: "100%"
  },
  depth1FrameSpaceBlock: {
    paddingHorizontal: Padding.p_base,
    width: "100%",
    backgroundColor: Color.colorWhite,
    height: "auto"
  },
  depth2FrameLayout: {
    height: "auto",
    width: 280,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
    paddingTop: 16
  },
  frameLayout: {
    height: 173,
    width: 173,
  },
  depth2FramePosition2: {
    top: 249,
    height: 221,
    width: 173,
    position: "absolute",
  },
  depth2FramePosition1: {
    top: 482,
    height: 221,
    width: 173,
    position: "absolute",
  },
  depth2FramePosition: {
    top: 715,
    height: 221,
    width: 173,
    position: "absolute",
  },
  depth4FrameFlexBox: {
    height: 32,
    alignItems: "center",
    flexDirection: "row",
  },
  depth4FrameSpaceBlock: {
    marginTop: 4,
    height: 18,
    alignItems: "center",
  },
  homeTypo: {
    textAlign: "center",
    lineHeight: 18,
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    letterSpacing: 0,
  },
  depth3FrameLayout: {
    width: "auto",
    height: 54,
    alignItems: "center",
  },
  depth4Frame0: {
    height: 24,
    width: 24,
  },
  depth3Frame0: {
    width: 32,
    alignItems: "center",
    flexDirection: "row",
    height: 48,
  },
  allPartners: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    textAlign: "left",
    letterSpacing: 0,
    color: Color.colorBlack,
  },
  depth5Frame0: {
    alignSelf: "stretch",
  },
  depth4Frame01: {
    width: 'auto',
    height: 23,
    overflow: "hidden",
  },
  depth3Frame1: {
    width: "auto",
    justifyContent: "center",
    height: 23,
    alignItems: "center",
    flexDirection: "row",
  },
  depth4Frame02: {
    justifyContent: "flex-end",
    width: 48,
    alignItems: "center",
    height: 48,
  },
  depth3Frame2: {
    width: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  depth2Frame0: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: "auto",
    width: "100%",
  },
  depth1Frame0: {
    paddingVertical: 16,
    position: "relative",
    top: 0,
    zIndex: 10
  },
  depth4Frame03: {
    borderRadius: Border.br_xs,
    overflow: "hidden",
    width: 280,
    height: 350
  },
  google: {
    fontSize: FontSize.size_base,
    lineHeight: 24,
    fontFamily: FontFamily.interBold,
    fontWeight: "500",
    textAlign: "left",
    color: Color.colorBlack,
    alignSelf: "stretch",
    marginVertical: Padding.p_xs
  },
  depth4Frame04: {
    width: 173,
    height: "auto",
  },
  depth3Frame11: {
    height: "auto",
    marginTop: 12,
    paddingBottom: Padding.p_xs,
    width: "100%",
  },
  depth2Frame01: {
    left: 16,
  },
  depth2Frame1: {
    left: 201,
  },
  depth2Frame2: {
    left: 16,
  },
  depth2Frame3: {
    left: 201,
  },
  depth2Frame4: {
    left: 16,
  },
  depth2Frame5: {
    left: 201,
  },
  depth2Frame6: {
    left: 16,
  },
  depth2Frame7: {
    left: 201,
  },
  depth1Frame1: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 48,
    justifyContent: "center",
    marginBottom: 60
  },
  depth4Frame019: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_9xs,
    width: "auto",
  },
  home: {
    color: Color.colorSteelblue_200,
  },
  depth5Frame02: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  depth4Frame1: {
    width: 'auto',
  },
  depth4Frame020: {
    borderRadius: 16,
    justifyContent: "center",
    width: 48,
  },
  partners: {
    color: Color.colorGray_400,
    textAlign: "center",
    lineHeight: 18,
    fontSize: FontSize.size_xs,
  },
  depth4Frame11: {
    width: 'auto',
  },
  depth3Frame19: {
    marginLeft: 8,
  },
  depth4Frame12: {
    width: 'auto',
  },
  depth4Frame13: {
    width: 'auto',
  },
  depth2Frame02: {
    height: 54,
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 40
  },
  depth1Frame3: {
    borderStyle: "solid",
    borderColor: "#e8edf5",
    borderTopWidth: 1,
    height: "10%",
    width: "100%",
    paddingTop: Padding.p_5xs,
    paddingBottom: Padding.p_xs,
    position: "relative",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  depth1Frame4: {
    height: 20,
    width: 390,
  },
  depth0Frame0: {
    height: "100%",
    overflow: "hidden",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  galileoDesign: {
    backgroundColor: Color.colorBlack,
    flex: 1,
    width: "100%",
    height: "100%"
  },
  SearchBar: {
    width: "80%",
    paddingVertical: Padding.p_smi,
    paddingHorizontal: Padding.p_base,
    fontSize: FontSize.size_base,
    color: Color.colorBlack,
    backgroundColor: Color.colorWhitesmoke_300,
    outlineStyle: "none",
    borderRadius: Border.br_xs,
  },
  overlayContainer: {
    width: 280,
    height: 350,
    position: "absolute",
    top: 0,
    overflow: "hidden"
  },
  overlay: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: Padding.p_base,
    gap: 3
  },
  insightText: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.plusJakartaSansBold,
    color: Color.colorSlategray_300,
  },
  userNameText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.plusJakartaSansBold,
    color: Color.colorBlack,
  },
  profileTop: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileBottomContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginTop: Padding.p_xs
  },
  profileBottomChip: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: 5,
    borderRadius: Border.br_base
  },
  collabrationText: {
    fontFamily: FontFamily.plusJakartaSansBold,
    fontSize: FontSize.size_xs
  },
  collaborationCount: {
    fontFamily: FontFamily.plusJakartaSansBold,
  },
  divider:{
    width:"100%",
    borderWidth:0.5,
    borderColor:"#ccc",
    marginTop:30
  }
});

export default BrandAssosciated;
