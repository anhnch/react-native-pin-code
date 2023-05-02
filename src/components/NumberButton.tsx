import React from 'react';
import { Text, TextStyle, StyleProp, Pressable, ViewStyle } from 'react-native';
import { DEFAULT } from '../common';

const NumberButton = ({
    value, style, textStyle, disabled = false, backSpace, backSpaceText, onPress, disabledStyle
}: {
    value: string;
    disabled?: boolean;
    backSpace?: JSX.Element;
    backSpaceText?: string;
    onPress: (number: string) => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<TextStyle>;
}) => {
    if (value == 'delete') {
        return <Pressable disabled={disabled} onPress={() => onPress(value)}
            style={({ pressed }) => [
                DEFAULT.Styles.enter?.button,
                style,
                { backgroundColor: 'transparent', opacity: pressed ? 0.5 : 1 },
            ]}>
            {backSpace || <Text style={[DEFAULT.Styles.enter?.buttonText, textStyle]}>
                {backSpaceText || DEFAULT.TextOptions.enter?.backSpace}
            </Text>}
        </Pressable>;
    }

    return <Pressable disabled={disabled}
        onPress={() => onPress(value)}
        style={({ pressed }) => [
            DEFAULT.Styles.enter?.button,
            { backgroundColor: disabled ? 'rgba(255,255,255,0.5)' : '#FFF', opacity: pressed ? 0.5 : 1 },
            style
        ]}>
        <Text style={[DEFAULT.Styles.enter?.buttonText, textStyle, disabled ? DEFAULT.Styles.enter?.buttonTextDisabled : {}, disabled ? disabledStyle : {}]}>{value}</Text>
    </Pressable>
}

export default NumberButton;