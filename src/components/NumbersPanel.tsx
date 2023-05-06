import React from "react";
import { StyleProp, TextStyle, View, ViewProps } from "react-native"
import { DEFAULT } from "../common";
import NumberButton from "./NumberButton";

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
            <NumberButton value={'1'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'2'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'3'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <NumberButton value={'4'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'5'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'6'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <NumberButton value={'7'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'8'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'9'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
        <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            <View style={[DEFAULT.Styles.enter?.button, buttonStyle, { backgroundColor: 'transparent', borderWidth: 0 }]} />
            <NumberButton value={'0'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
            <NumberButton value={'delete'} disabled={disabled}
                backSpace={backSpace} backSpaceText={backSpaceText || DEFAULT.TextOptions.set?.backSpace}
                style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
        </View>
    </View>
}

export default NumbersPanel;