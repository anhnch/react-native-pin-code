import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { DEFAULT } from "../common";

const Pin = ({ pin, pinLength, style, pinStyle, enteredPinStyle }: {
    pin: string;
    pinLength: number;
    style?: StyleProp<ViewStyle>;
    pinStyle?: StyleProp<ViewStyle>;
    enteredPinStyle?: StyleProp<ViewStyle>;
}) => {
    const items: JSX.Element[] = [];
    for (let i = 1; i <= pinLength; i++) {
        items.push(<View key={'pin_' + i} style={[
            pinStyle,
            pin.length >= i ? enteredPinStyle : {}
        ]} />);
    }

    return <View style={[DEFAULT.Styles.enter?.pinContainer, style]}>
        {items}
    </View>
}

export default Pin;