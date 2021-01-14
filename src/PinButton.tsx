import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';

const PinButton = ({
    value, style, textStyle, disabled = false, onPress
}: {
    value: string;
    disabled?: boolean;
    onPress: (number: string) => void;
    style?: ViewStyle | Array<ViewStyle | undefined>;
    textStyle?: TextStyle | TextStyle[];
}) => {
    if (value == 'delete') {
        return <TouchableOpacity disabled={disabled} style={[styles.container, { backgroundColor: 'transparent' }, style]} onPress={() => onPress(value)}>
            <Icon name='backspace' size={28} style={[{ color: disabled ? '#EEE' : '#FFF' }, textStyle]} />
        </TouchableOpacity>;
    }
    return <TouchableOpacity disabled={disabled} style={[styles.container, { backgroundColor: disabled ? '#EEE' : '#FFF' }, style]} onPress={() => onPress(value)}>
        <Text style={[styles.number, textStyle]}>{value}</Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
    number: { fontSize: 20 }
})

export default PinButton;