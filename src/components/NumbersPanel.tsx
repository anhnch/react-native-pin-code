import React from "react";
import { StyleProp, TextStyle, View, ViewProps } from "react-native"
import { DEFAULT } from "../common";
import PinButton from "./NumberButton";

const NumbersPanel = ({ style, buttonStyle, onButtonPress, textStyle, rowStyle, disabled, backSpaceText, backSpace }: {
    buttonStyle?: StyleProp<ViewProps>;
    onButtonPress: (value: string) => void;
    style?: StyleProp<ViewProps>;
    textStyle?: StyleProp<TextStyle>;
    rowStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<TextStyle>;
    backSpace?: JSX.Element;
    backSpaceText?: string;
    disabled?: boolean;
}) => {
    return <View style={[DEFAULT.Styles.enter?.buttonContainer, style]}>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <PinButton value={'1'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'2'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'3'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <PinButton value={'4'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'5'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'6'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <PinButton value={'7'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'8'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'9'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <View style={[DEFAULT.Styles.enter?.button, buttonStyle, { backgroundColor: 'transparent', borderWidth: 0 }]} />
            <PinButton value={'0'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <PinButton value={'delete'} disabled={disabled}
                backSpace={backSpace} backSpaceText={backSpaceText || DEFAULT.TextOptions.set?.backSpace}
                style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
    </View>
}

export default NumbersPanel;