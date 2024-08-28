import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { View, Text, Modal, StyleSheet, Button, Pressable, TouchableOpacity, TextInput } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import CustomSlider from "../../shared/CustomSlider"
import DropDown from "../../shared/DropDown";
import MultipleSelectList from "../../shared/MultiSelect";
import { useNavigation } from "@react-navigation/core";
import { FilterInfluencerProfile } from '../../controller/InfluencerController'
import { Color, FontFamily, FontSize, Padding, Border } from "../../GlobalStyles";

function Filter({ selectedFilter, setLoading }) {
    const snapPoints = useMemo(() => ['40%', '40%', '70%'], []);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleOpenPress = () => bottomSheetRef.current?.expand();
    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation()
    const [platform, setPlatform] = React.useState("")
    const [selectedAges, setSelectedAges] = React.useState({})
    const [selectedFollowersCount, setSelectedFollowersCount] = React.useState({})
    const [selectedPostCount, setSelectedPostCount] = React.useState({})
    const [selectedViewsCount, setSelectedViewsCount] = React.useState({})
    const [selectedLocation, setSelectedLocation] = React.useState("India")
    const [gender, setGender] = React.useState("Male")
    const [engagementRate, setEngagementRate] = React.useState({})
    const [price, setPrice] = React.useState({})
    const [reachability, setReachability] = React.useState({})
    const [categories, setCategories] = React.useState([])
    const [cities, setCities] = React.useState([])
    const [tags, setTags] = React.useState("")
    const [showElements, setShowElements] = React.useState(false)
    useEffect(() => {
        if (selectedFilter != "" && selectedFilter != "Reset")
            handleOpenPress()
    }, [selectedFilter])
    const locationData = [
        {
            key: "india",
            value: "india"
        },
        {
            key: "pakistan",
            value: "Pakistan"
        },
        {
            key: "srilanka",
            value: "Srilanka"
        }
    ]
    const genderData = [
        {
            key: "male",
            value: "Male"
        }, {
            key: "female",
            value: "Female"
        }
    ]
    const categoriedData = [
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
    const handleApplyFilters = async () => {
        setLoading(true)
        const filters = {
            location: selectedLocation,
            category: categories,
            price: price,
            platform,
            followers: selectedFollowersCount,
            likes: selectedPostCount,
            engagementRate: engagementRate,
            audienceAge: selectedAges,
            gender,
            tags,
            reachability: reachability,
            viewCount: selectedViewsCount,
            cities
        };
        await FilterInfluencerProfile(filters, navigation);
        setLoading(false)
    }
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: '#ccc' }}
            backgroundStyle={{ backgroundColor: '#fff' }}
            backdropComponent={renderBackdrop}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.containerHeadline}>{selectedFilter}</Text>
                {
                    selectedFilter == "Platform" ?
                        <View style={styles.platformsContainer}>
                            <Pressable onPress={() => { setPlatform("instagram") }} style={[styles.platformContainer, { backgroundColor: platform == "instagram" ? Color.colorWhitesmoke_300 : Color.colorWhite }]}>
                                <Text style={styles.platformText}>Instagram</Text>
                            </Pressable>
                            <Pressable onPress={() => { setPlatform("facebook") }} style={[styles.platformContainer, { backgroundColor: platform == "facebook" ? Color.colorWhitesmoke_300 : Color.colorWhite }]}>
                                <Text style={styles.platformText}>Facebook</Text>
                            </Pressable>
                            <Pressable onPress={() => { setPlatform("twitter") }} style={[styles.platformContainer, { backgroundColor: platform == "twitter" ? Color.colorWhitesmoke_300 : Color.colorWhite }]}>
                                <Text style={styles.platformText}>Twitter</Text>
                            </Pressable>
                            <Pressable onPress={() => { setPlatform("youtube") }} style={[styles.platformContainer, { backgroundColor: platform == "youtube" ? Color.colorWhitesmoke_300 : Color.colorWhite }]}>
                                <Text style={styles.platformText}>YouTube</Text>
                            </Pressable>
                            <Pressable onPress={() => { setPlatform("tiktok") }} style={[styles.platformContainer, { backgroundColor: platform == "tiktok" ? Color.colorWhitesmoke_300 : Color.colorWhite }]}>
                                <Text style={styles.platformText}>TikTok</Text>
                            </Pressable>
                        </View>
                        :
                        selectedFilter == "Price" ?
                            <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                <CustomSlider minValue={1000} maxValue={50000} selectedValues={setPrice} />
                            </View>
                            :
                            selectedFilter == "Engagement Rate" ?
                                <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                    <CustomSlider minValue={0} maxValue={100} selectedValues={setEngagementRate} />
                                </View>
                                :
                                selectedFilter == "Age" ?
                                    <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                        <CustomSlider minValue={0} maxValue={100} selectedValues={setSelectedAges} />
                                    </View>
                                    :
                                    selectedFilter == "Followers Count" ?
                                        <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                            <CustomSlider minValue={1000} maxValue={50000} selectedValues={setSelectedFollowersCount} />
                                        </View>
                                        :
                                        selectedFilter == "Post Count" ?
                                            <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                                <CustomSlider minValue={100} maxValue={2000} selectedValues={setSelectedPostCount} />
                                            </View>
                                            :
                                            selectedFilter == "Views Count" ?
                                                <View style={[styles.depth5Frame01, styles.frameLayout]}>
                                                    <CustomSlider minValue={100} maxValue={2000} selectedValues={setSelectedViewsCount} />
                                                </View>
                                                :
                                                selectedFilter == "Location" ?
                                                    <View style={{ paddingVertical: 8 }}>
                                                        <View>
                                                            <DropDown
                                                                name={selectedLocation}
                                                                items={locationData}
                                                                dropDownOptionStyle={{
                                                                    width: "100%",
                                                                    paddingVertical: 16,
                                                                    backgroundColor: "#fff",
                                                                    borderWidth: 2,
                                                                    borderColor: "#DBE0E5"
                                                                }}
                                                                showElements={showElements}
                                                                setShowElement={setShowElements}
                                                                dropDownContainerStyle={{ width: "100%" }}
                                                                dropDownItemsStyle={{ width: "100%", position: "absolute", top: 50, zIndex: 1000, height: 160, overflow: "scroll" }}
                                                                titleStyle={{ paddingStart: 12, color: "#4F7A94" }}
                                                                selectedValue={setSelectedLocation}
                                                            />
                                                        </View>
                                                    </View>
                                                    :
                                                    selectedFilter == "Gender" ?
                                                        <View style={{ paddingVertical: 8 }}>
                                                            <View>
                                                                <DropDown
                                                                    name={gender}
                                                                    items={genderData}
                                                                    dropDownOptionStyle={{
                                                                        width: "100%",
                                                                        paddingVertical: 16,
                                                                        backgroundColor: "#fff",
                                                                        borderWidth: 2,
                                                                        borderColor: "#DBE0E5"
                                                                    }}
                                                                    dropDownContainerStyle={{ width: "100%" }}
                                                                    dropDownItemsStyle={{ width: "100%", position: "absolute", top: 55, zIndex: 1000, height: 120, overflow: "scroll" }}
                                                                    titleStyle={{ paddingStart: 12, color: "#4F7A94" }}
                                                                    selectedValue={setGender}
                                                                    showElements={showElements}
                                                                    setShowElement={setShowElements}
                                                                />
                                                            </View>
                                                        </View>
                                                        :
                                                        selectedFilter == "Tags" ?
                                                            <View style={[styles.textBoxContainer]}>
                                                                <TextInput
                                                                    style={styles.textInput}
                                                                    value={tags}
                                                                    onChangeText={setTags}
                                                                    placeholder="Search tags"
                                                                />
                                                            </View>
                                                            :
                                                            selectedFilter == "Category" ?
                                                                <View style={{ width: "100%", zIndex: 10 }}>
                                                                    <MultipleSelectList
                                                                        setSelected={(val) => setCategories(val)}
                                                                        data={categoriedData}
                                                                        save="value"
                                                                        selectedval={categories}
                                                                        setSelectedVal={setCategories}
                                                                    />
                                                                </View>
                                                                :
                                                                <View style={{ width: "100%", zIndex: 10 }}>
                                                                    <MultipleSelectList
                                                                        setSelected={(val) => setCities(val)}
                                                                        data={locationData}
                                                                        save="value"
                                                                        selectedval={cities}
                                                                        setSelectedVal={setCities}
                                                                    />
                                                                </View>
                }
                <TouchableOpacity style={[styles.depth3Frame05]} onPress={()=>{
                    handleApplyFilters()
                    handleClosePress()
                }}>
                    <Text
                        style={[styles.applyFilters, styles.ageLayout]}
                        numberOfLines={1}
                    >
                        Apply Filters
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    )
}
const styles = StyleSheet.create({
    depth3Frame05: {
        width: "100%",
        backgroundColor: Color.colorRoyalblue,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 6,
        height: 50,
        maxHeight: 50,
        borderRadius: Border.br_base,
        position: "absolute",
        bottom: 20
    },
    applyFilters: {
        color: Color.colorWhite,
        textAlign: "center",
        fontFamily: FontFamily.beVietnamProBold,
        fontWeight: "700",
        alignSelf: "stretch",
        overflow: "hidden",
    },
    contentContainer: {
        width: "100%",
        flex: 1,
        alignItems: 'center',
        height: "auto",
        paddingHorizontal: 28,
        position: "relative"
    },
    containerHeadline: {
        paddingVertical: Padding.p_base,
        color: Color.colorBlack,
        fontFamily: FontFamily.beVietnamProBold,
        fontSize: FontSize.size_lg
    },
    platformsContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16
    },
    platformContainer: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: Border.br_base,
        backgroundColor: Color.colorWhitesmoke_300,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    depth5Frame01: {
        width:"100%",
        backgroundColor: Color.colorGainsboro,
        paddingLeft: Padding.p_196xl,
        paddingRight: Padding.p_35xl,
        flexDirection: "row",
    },
    textBoxContainer: {
        borderRadius: Border.br_xs,
        backgroundColor: Color.colorAliceblue,
        height: 56,
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        zIndex: 1,
    },
    textInput: {
        width: "100%",
        borderColor: Color.colorGray_400,
        borderWidth: 0,
        borderRadius: Border.br_xs,
        paddingHorizontal: Padding.p_base,
        fontSize: FontSize.size_base,
        flex: 1,
        color: Color.colorSteelblue_200,
    },
});

export default Filter;