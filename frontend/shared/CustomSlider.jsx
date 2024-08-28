import React, { useEffect, useRef, useCallback, useState } from "react";
import { Text, View, StyleSheet, Animated, PanResponder } from 'react-native'
import { Border, Padding } from "../GlobalStyles";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export default function CustomSlider({minValue,maxValue,selectedValues}) {
    const [value, setValue] = useState({ values: [0, 0], })
    const [width, setWidth] = useState(0)
    const multiSliderValuesChange = (values) => {
        setValue({
            values,
        });
        selectedValues({min:value.values[0],max:value.values[1]})
    }
    useEffect(()=>{
        setValue({values:[minValue,maxValue]})
    },[minValue,maxValue])
    return (
        <View style={styles.sliderContainer} onLayout={(evt) => {
            setWidth(evt.nativeEvent.layout.width)
        }}>
            <MultiSlider
                values={[value.values[0], value.values[1]]}
                sliderLength={width}
                selectedStyle={{ backgroundColor: '#000',height:3 }}
                containerStyle={styles.containerStyle}
                onValuesChange={multiSliderValuesChange}
                unselectedStyle={{ backgroundColor: "#DBE0E5" }}
                markerStyle={{ backgroundColor: "#000",height:20,width:20,position:"absolute",top:-8,left:-1, shadowOpacity: 0, borderWidth: 0,padding:0 }}
                min={minValue}
                max={maxValue}
                step={1}
                trackStyle={{ height: 4, borderRadius: 50 }}
            />
            <View style={styles.valuesContainer}>
                <Text style={styles.valueText}>{value.values[0]}</Text>
                <Text style={styles.valueText}>{value.values[1]}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        width: "100%",
        height: 200,
        paddingVertical: 32
    },
    containerStyle: {
        alignSelf: "center",
        marginTop: 10,
        height: "auto"
    },
    valuesContainer: {
        paddingVertical: 5, display: "flex", flexDirection: "row", justifyContent: "space-between",
        marginTop:4
    },
    valueText:{
        color:"#000",
        fontWeight:"bold"
    }
})