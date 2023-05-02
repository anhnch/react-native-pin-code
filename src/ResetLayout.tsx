import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PinCodeT } from "./types";
import { DEFAULT } from "./common";

const ResetLayout = ({ styles, textOptions, options, onReset, onCancel }: {
    styles?: PinCodeT.ResetStyles;
    options: PinCodeT.Options;
    textOptions?: PinCodeT.ResetTextOptions;
    onReset?: () => void;
    onCancel: () => void;
}) => {
    const [status, setStatus] = useState<PinCodeT.Statuses>(PinCodeT.Statuses.Initial);

    return <>
        <View style={[DEFAULT.Styles.reset?.header, styles?.header]}>
            <Text style={[DEFAULT.Styles.reset?.title, styles?.title]}>{textOptions?.title}</Text>
            <Text style={[DEFAULT.Styles.reset?.subTitle, styles?.subTitle]}>{textOptions?.subTitle}</Text>
        </View>
        <View style={DEFAULT.Styles.reset?.content}>
            {status == PinCodeT.Statuses.Initial && <>
                <Pressable onPress={() => {
                    setStatus(PinCodeT.Statuses.ResetPrompted);
                }} style={state => ({ opacity: state.pressed ? 0.6 : 1 })}>
                    <Text style={[DEFAULT.Styles.reset?.resetButton, styles?.resetButton]}>{textOptions?.resetButton}</Text>
                </Pressable>
            </>}
            {status == PinCodeT.Statuses.ResetPrompted && <>
                <Text style={[DEFAULT.Styles.reset?.confirmText]}>{textOptions?.confirm}</Text>
                <Pressable onPress={onReset} style={state => ({ opacity: state.pressed ? 0.6 : 1 })}>
                    <Text style={[DEFAULT.Styles.reset?.resetButton, styles?.resetButton]}>{textOptions?.confirmButton}</Text>
                </Pressable>
            </>}
        </View>
        <View style={styles?.footer}>
            <Text onPress={onCancel} style={[DEFAULT.Styles.reset?.footerText, styles?.footerText]}>{textOptions?.footerText}</Text>
        </View>
    </>
}

export default ResetLayout;