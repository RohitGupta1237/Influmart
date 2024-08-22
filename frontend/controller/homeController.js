import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
//import { API_ENDPOINT } from "@env";
const API_ENDPOINT = "http://localhost:3000";
const getTopAccounts = async (showAlert) => {
    const token = await AsyncStorage.getItem("token")
    try {
        res = []
        let response = await axios.get(`${API_ENDPOINT}/brands/getAllBrands`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        let data = await response.data.brands;
        res = data?.slice(0, 5)?.map((brand) => {
            return {
                profileUrl: brand.isSelectedImage? brand.profileUrl :brand.profileUrl.includes("uploads")
                ? `${API_ENDPOINT}/${brand.profileUrl.replace(/\\/g, '/').replace('uploads/', '')}`
                : null,
                name: brand.name,
                accountType: "BRAND",
                isSelectedImage: brand?.isSelectedImage
            }
        })
        response = await axios.get(`${API_ENDPOINT}/influencers/profiles`);
        data = await response.data?.influencers;
        res = [...res, ...data?.slice(0, 5)?.map((influencer) => {
            return {
                profileUrl: influencer?.isSelectedImage ? influencer?.profileUrl : influencer?.profileUrl.includes("uploads")
                    ? `${API_ENDPOINT}/${influencer?.profileUrl.replace(/\\/g, '/').replace('uploads/', '')}`
                    : null,
                name: influencer?.influencerName,
                accountType: "INFLUENCER"
            }
        })]
        return res
    } catch (error) {
        console.log(error)
        showAlert("Accounts Error", "Something went wrong")
    }
}

export { getTopAccounts }