import React from 'react';
import { Text, View } from "react-native";
import { PinCodeT } from "./types";
import { DEFAULT, millisToMinutesAndSeconds } from './common';
import Countdown from './components/Countdown';

const LockedLayout = ({ styles, options, textOptions, onClockFinish }: {
    styles?: PinCodeT.LockedStyles;
    textOptions?: PinCodeT.LockedTextOptions;
    options?: PinCodeT.Options;
    onClockFinish: () => void;
}) => {
    return <>
        <View style={[DEFAULT.Styles.locked?.header, styles?.header]}>
            <Text style={[DEFAULT.Styles.locked?.title, styles?.title]}>{textOptions?.title}</Text>
            <Text style={[DEFAULT.Styles.locked?.subTitle, styles?.subTitle]}>
                {textOptions?.subTitle?.replace('{{maxAttempt}}', (options?.maxAttempt || DEFAULT.Options.maxAttempt || 5).toString())
                    .replace('{{lockDuration}}', millisToMinutesAndSeconds(options?.lockDuration || DEFAULT.Options.lockDuration || 60000))}
            </Text>
        </View>
        <View style={[DEFAULT.Styles.locked?.content, styles?.content]}>
            {options?.lockIcon || <Text style={[DEFAULT.Styles.locked?.lock, styles?.lock]}>{textOptions?.lockedText}</Text>}
            <Countdown style={styles?.countdown} textStyle={styles?.countdownText}
                duration={options?.lockDuration}
                onFinish={onClockFinish}
            />
        </View>
        <View style={[DEFAULT.Styles.locked?.footer, styles?.footer]}>
            <Text style={[DEFAULT.Styles.locked?.footerText]}>{textOptions?.footerText}</Text>
        </View>
    </>
}

export default LockedLayout;