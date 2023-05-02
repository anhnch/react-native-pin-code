import React, { useState } from 'react';
import { Platform, Text, Vibration, View } from "react-native";
import { PinCodeT } from "./types";
import { DEFAULT } from './common';
import NumberButtons from './components/NumbersPanel';
import Pin from './components/Pin';

const SetLayout = ({ pin, styles, mode, textOptions, options, onSwitchMode, onSet, onSetCancel, onReset }: {
    pin: string | undefined;
    styles?: PinCodeT.SetStyles;
    mode: PinCodeT.Modes;
    textOptions: PinCodeT.TextOptions;
    options?: PinCodeT.Options;
    onSwitchMode?: () => void;
    onSetCancel?: () => void;
    onSet: (newPin: string) => void;
    onReset: () => void;
}) => {
    const [curPin, setCurPin] = useState('');
    const [lastPin, setLastPin] = useState('');
    const [status, setStatus] = useState<PinCodeT.Statuses>(PinCodeT.Statuses.Initial);
    const [showError, setShowError] = useState(false);

    async function onNumberPress(value: string) {
        const newPin = (value == 'delete') ?
            (curPin.substring(0, curPin.length - 1)) :
            (curPin + value);

        setCurPin(newPin);

        if (newPin.length == options?.pinLength) {
            // STEP 1
            if (status == PinCodeT.Statuses.Initial) {
                setLastPin(newPin);
                setStatus(PinCodeT.Statuses.SetOnce);
                setCurPin('');
            }
            // STEP 2
            else if (status == PinCodeT.Statuses.SetOnce) {
                if (lastPin == newPin) { // pin matched
                    onSet(newPin);
                } else { // pin doesn't matched
                    setShowError(true);
                    if (Platform.OS === 'ios') {
                        Vibration.vibrate(); // android requires VIBRATE permission
                    }
                    setTimeout(() => setShowError(false), 3000);
                    setTimeout(() => setCurPin(''), 1500);
                }
                setStatus(PinCodeT.Statuses.Initial);
                setLastPin('');
            }
        }
    }

    function cancel() {
        onSetCancel?.();
    }

    return <>
        <View style={[DEFAULT.Styles.enter?.header, styles?.header]}>
            <Text style={[DEFAULT.Styles.enter?.title, styles?.title]}>{mode == PinCodeT.Modes.Enter ? textOptions.enter?.title : textOptions.set?.title}</Text>
            {status == PinCodeT.Statuses.Initial && <Text style={[DEFAULT.Styles.enter?.subTitle, styles?.subTitle]}>
                {textOptions.set?.subTitle?.replace('{{pinLength}}', (options?.pinLength || DEFAULT.Options.pinLength || 4).toString())}</Text>
            }
            {status == PinCodeT.Statuses.SetOnce && <Text style={[DEFAULT.Styles.enter?.subTitle, styles?.subTitle]}>{textOptions.set?.repeat}</Text>}
            {showError && <Text style={[DEFAULT.Styles.enter?.errorText, styles?.errorText]}>{textOptions.set?.error}</Text>}
        </View>
        <View style={[DEFAULT.Styles.enter?.content, styles?.content]}>
            <Pin pin={curPin} pinLength={options?.pinLength || DEFAULT.Options.pinLength || 4}
                style={styles?.pinContainer}
                pinStyle={[DEFAULT.Styles.set?.pin, styles?.pin]}
                enteredPinStyle={[DEFAULT.Styles.set?.enteredPin, styles?.enteredPin]} />

            <NumberButtons onButtonPress={onNumberPress}
                backSpace={options?.backSpace} backSpaceText={textOptions.enter?.backSpace}
                buttonStyle={styles?.button} rowStyle={styles?.buttonRow} style={styles?.buttonContainer} textStyle={styles?.buttonText}
            />
        </View>
        <View style={[DEFAULT.Styles.enter?.footer, styles?.footer]}>
            <Text onPress={cancel} style={[DEFAULT.Styles.set?.footerText, styles?.footerText]}>{textOptions.set?.cancel}</Text>
        </View>
    </>
}

export default SetLayout;