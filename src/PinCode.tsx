import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Vibration, Text, TouchableOpacity, Platform, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { PinCodeT, DEFAULT, PIN_KEY } from './types';
import PinButton from './PinButton';
import Clock, { millisToMinutesAndSeconds } from './Clock';


const PinCode = ({
    visible = false,
    mode = PinCodeT.Modes.Enter,
    options,
    textOptions,
    styles,
    onEnterSuccess,
    onSetSuccess,
    onSetCancel,
    onResetSuccess,
    onModeChanged,
    checkPin,
}: PinCodeT.PinCodeT) => {
    const [pin, setPin] = useState('');
    const [lastPin, setLastPin] = useState('');
    const [curMode, setCurMode] = useState<PinCodeT.Modes>(mode);
    const [status, setStatus] = useState<PinCodeT.Statuses>(PinCodeT.Statuses.Initial);
    const [failureCount, setFailureCount] = useState(0);
    const [showError, setShowError] = useState(false);
    const [curOptions, setCurOptions] = useState<PinCodeT.Options>(DEFAULT.Options);
    const [curTextOptions, setCurTextOptions] = useState<PinCodeT.TextOptions>(DEFAULT.TextOptions);
    const [buttonsDisabled, disableButtons] = useState(false);

    useEffect(() => {
        setCurMode(mode);
        initialize();
    }, [mode])

    useEffect(() => {
        setCurOptions({ ...DEFAULT.Options, ...options });
    }, [options])

    useEffect(() => {
        if (!textOptions) return;
        // there are only 2 levels, don't use deepmerge library for least dependencies
        const merged: PinCodeT.TextOptions = {
            enter: {
                ...DEFAULT.TextOptions.enter,
                ...textOptions.enter
            },
            set: {
                ...DEFAULT.TextOptions.set,
                ...textOptions.set
            },
            locked: {
                ...DEFAULT.TextOptions.locked,
                ...textOptions.locked
            },
            reset: {
                ...DEFAULT.TextOptions.reset,
                ...textOptions.reset
            }
        }
        setCurTextOptions(merged);
    }, [textOptions])

    function initialize() {
        setPin('');
        setLastPin('');
        setShowError(false);
        disableButtons(false);
        setStatus(PinCodeT.Statuses.Initial);
    }

    function switchMode(newMode: PinCodeT.Modes) {
        setCurMode(newMode);
        initialize();
        if (onModeChanged) onModeChanged(curMode, newMode);
    }

    async function onPinButtonPressed(value: string) {
        let newPin = '';
        if (value == 'delete') {
            newPin = pin.substr(0, pin.length - 1);
        } else {
            newPin = pin + value;
        }

        setPin(newPin);

        if (newPin.length == curOptions.pinLength) {
            if (curMode == PinCodeT.Modes.Enter) {
                await processEnterPin(newPin)
            } else if (curMode == PinCodeT.Modes.Set) {
                await processSetPin(newPin);
            }
        }
    }

    async function processEnterPin(newPin: string) {
        disableButtons(true);
        const ret = await checkThePin(newPin);
        setPin('');
        if (ret) {
            setFailureCount(0);
            onEnterSuccess(newPin);
            setStatus(PinCodeT.Statuses.Initial);
            disableButtons(false);
        } else {
            if (!curOptions.disableLock && failureCount >= (curOptions.maxAttempt || DEFAULT.Options.maxAttempt) - 1) {
                switchMode(PinCodeT.Modes.Locked);
                disableButtons(false);
            } else {
                setFailureCount(failureCount + 1);
                setStatus(PinCodeT.Statuses.Initial);

                if (Platform.OS === 'ios') {
                    Vibration.vibrate(); // android requires VIBRATE permission
                }

                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
                disableButtons(true);
                setTimeout(() => disableButtons(false), 1000);
            }
        }
    }

    async function processSetPin(newPin: string) {
        // STEP 1
        if (status == PinCodeT.Statuses.Initial) {
            setLastPin(newPin);
            setStatus(PinCodeT.Statuses.SetOnce);
            setPin('');
        }
        // STEP 2
        else if (status == PinCodeT.Statuses.SetOnce) {
            if (lastPin == newPin) { // pin matched
                savePin(newPin);
                onSetSuccess(newPin);
            } else { // pin doesn't matched
                setShowError(true);
                if (Platform.OS === 'ios') {
                    Vibration.vibrate(); // android requires VIBRATE permission
                }
                setTimeout(() => setShowError(false), 3000);
                setTimeout(() => setPin(''), 1500);
            }
            setStatus(PinCodeT.Statuses.Initial);
            setLastPin('');
        }
    }

    async function onDeletePIN() {
        await AsyncStorage.removeItem(PIN_KEY);
        onResetSuccess();
        switchMode(PinCodeT.Modes.Enter);
    }

    async function checkThePin(newPin: string) {
        if (checkPin) {
            return await checkPin(newPin);
        } else {
            const savedPin = await AsyncStorage.getItem(PIN_KEY);
            return (newPin == savedPin);
        }
    }

    async function savePin(newPin: string) {
        await AsyncStorage.setItem(PIN_KEY, newPin);
        return;
    }

    if (!visible) {
        return <></>;
    }

    if (curMode == PinCodeT.Modes.Enter || curMode == PinCodeT.Modes.Set) {
        const buttonStyle = StyleSheet.flatten([defaultStyles.button, styles?.enter?.buttons]);
        return <View style={[defaultStyles.mainContainer, styles?.main]}>
            <View style={[defaultStyles.titleContainer, styles?.enter?.titleContainer]}>
                <Text style={[defaultStyles.title, styles?.enter?.title]}>{curMode == PinCodeT.Modes.Enter ? curTextOptions.enter?.title : curTextOptions.set?.title}</Text>
                {curMode == PinCodeT.Modes.Enter ?
                    <>
                        <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>
                            {curTextOptions.enter?.subTitle?.replace('{{pinLength}}', (curOptions.pinLength || DEFAULT.Options.pinLength).toString())}
                        </Text>
                        {showError && <Text style={defaultStyles.error}>{curTextOptions.enter?.error}</Text>}
                    </> : <>
                        {status == PinCodeT.Statuses.Initial && <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>
                            {curTextOptions.set?.subTitle?.replace('{{pinLength}}', (curOptions.pinLength || DEFAULT.Options.pinLength).toString())}</Text>
                        }
                        {status == PinCodeT.Statuses.SetOnce && <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>{curTextOptions.set?.repeat}</Text>}
                        {showError && <Text style={defaultStyles.error}>{curTextOptions.set?.error}</Text>}
                    </>
                }
            </View>
            <Pin pin={pin} pinLength={curOptions.pinLength || DEFAULT.Options.pinLength} style={styles?.enter?.pinContainer} />
            <View style={[defaultStyles.buttonContainer, styles?.enter?.buttonContainer]}>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'1'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'2'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'3'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'4'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'5'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'6'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'7'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'8'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'9'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <View style={[defaultStyles.button, { width: 60, height: 60 }]}></View>
                    <PinButton value={'0'} disabled={buttonsDisabled} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'delete'} disabled={buttonsDisabled}
                        backSpace={options?.backSpace} backSpaceText={curTextOptions?.enter?.backSpace}
                        style={defaultStyles.button} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
            </View>
            <View style={[defaultStyles.footer, styles?.enter?.footer]}>
                {curMode == PinCodeT.Modes.Enter && curOptions.allowReset &&
                    <TouchableOpacity onPress={() => {
                        switchMode(PinCodeT.Modes.Reset);
                    }}>
                        <Text style={[{ padding: 40, color: 'white' }, styles?.enter?.footerText]}>{curTextOptions.enter?.footerText}</Text>
                    </TouchableOpacity>
                }
                {curMode == PinCodeT.Modes.Set &&
                    <TouchableOpacity onPress={() => {
                        initialize();
                        if (onSetCancel) onSetCancel();
                    }}>
                        <Text style={{ color: 'white' }}>{curTextOptions.set?.cancel}</Text>
                    </TouchableOpacity>
                }
            </View>
        </View >
    } else if (curMode == PinCodeT.Modes.Locked) {
        return <View style={[defaultStyles.mainContainer, styles?.main]}>
            <View style={[defaultStyles.titleContainer, styles?.locked?.titleContainer]}>
                <Text style={[defaultStyles.title, styles?.locked?.title]}>{curTextOptions.locked?.title}</Text>
                <Text style={[defaultStyles.subTitle, styles?.locked?.subTitle]}>
                    {curTextOptions.locked?.subTitle?.replace('{{maxAttempt}}', (curOptions.maxAttempt || DEFAULT.Options.maxAttempt).toString())
                        .replace('{{lockDuration}}', millisToMinutesAndSeconds(curOptions.lockDuration || DEFAULT.Options.lockDuration))}
                </Text>
            </View>
            <View style={defaultStyles.pinContainer}>
                {options?.lockIcon ? options.lockIcon : <Text style={styles?.locked?.locked}>{curTextOptions.locked?.lockedText}</Text>}
            </View>
            <View style={defaultStyles.buttonContainer}>
                <Clock style={styles?.locked?.clockContainer} textStyle={styles?.locked?.clockText}
                    duration={curOptions.lockDuration}
                    onFinish={() => {
                        switchMode(PinCodeT.Modes.Enter);
                        setFailureCount(0);
                    }}
                />
            </View>
        </View>
    } else if (curMode == PinCodeT.Modes.Reset) {
        return <View style={[defaultStyles.mainContainer, styles?.main]}>
            <View style={[defaultStyles.titleContainer, styles?.reset?.titleContainer]}>
                <Text style={[defaultStyles.title, styles?.reset?.title]}>{curTextOptions.reset?.title}</Text>
                <Text style={[defaultStyles.subTitle, styles?.reset?.subTitle]}>{curTextOptions.reset?.subTitle}</Text>
            </View>
            <View style={defaultStyles.buttonContainer}>
                {status == PinCodeT.Statuses.Initial && <>
                    <TouchableOpacity onPress={() => setStatus(PinCodeT.Statuses.ResetPrompted)}>
                        <Text style={[defaultStyles.confirm, styles?.reset?.buttons]}>{curTextOptions.reset?.resetButton}</Text>
                    </TouchableOpacity>
                </>}
                {status == PinCodeT.Statuses.ResetPrompted && <>
                    <Text style={{ color: 'white', marginBottom: 20 }}>{curTextOptions.reset?.confirm}</Text>
                    <TouchableOpacity onPress={onDeletePIN}>
                        <Text style={[defaultStyles.confirm, styles?.reset?.buttons]}>{curTextOptions.reset?.confirmButton}</Text>
                    </TouchableOpacity>
                </>}
                <TouchableOpacity onPress={() => switchMode(PinCodeT.Modes.Enter)}>
                    <Text style={[{ fontSize: 14, paddingHorizontal: 40, paddingVertical: 20, color: 'white' }, styles?.reset?.buttons]}>{curTextOptions.reset?.backButton}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    return <></>;
}

const Pin = ({ pin, pinLength, style }: {
    pin: string;
    pinLength: number;
    style?: ViewStyle | ViewStyle[]
}) => {

    const items: JSX.Element[] = [];
    for (let i = 1; i <= pinLength; i++) {
        items.push(<Text key={'pin_' + i} style={{
            width: pin.length >= i ? 12 : 6,
            height: pin.length >= i ? 12 : 6,
            borderRadius: pin.length >= i ? 6 : 3,
            backgroundColor: 'white',
            overflow: 'hidden',
            marginHorizontal: 10
        }} />);
    }

    return <View style={[defaultStyles.pinContainer, style]}>
        {items}
    </View>
}



const defaultStyles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
    titleContainer: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100, textAlign: 'center', color: 'white' },
    title: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
    subTitle: { textAlign: 'center', marginTop: 20, color: 'white' },
    pinContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80 },
    buttonContainer: { justifyContent: 'flex-start', alignItems: 'center' },
    pinNumberRow: { flexDirection: 'row', marginVertical: 10 },
    error: { marginTop: 10, color: 'orange' },
    button: { marginHorizontal: 10 },
    footer: { justifyContent: 'center', alignItems: 'center', height: 100 },
    confirm: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10, overflow: 'hidden', fontSize: 14 },
})

export default PinCode;