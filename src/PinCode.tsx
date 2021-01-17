import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Vibration, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { PinCodeT } from './types';
import PinButton from './PinButton';
import Clock from './Clock';

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
    onStatusChanged,
}: PinCodeT.PinCodeT) => {
    const [pin, setPin] = useState('');
    const [lastPin, setLastPin] = useState('');
    const [checking, setChecking] = useState(false);
    const [curMode, setCurMode] = useState<PinCodeT.Modes>(mode);
    const [status, setStatus] = useState<PinCodeT.Statuses>(PinCodeT.Statuses.Initial);
    const [failureCount, setFailureCount] = useState(0);
    const [showError, setShowError] = useState(false);
    const [curOptions, setCurOptions] = useState<PinCodeT.Options>(PinCodeT.DEFAULT.Options);
    const [curTextOptions, setCurTextOptions] = useState<PinCodeT.TextOptions>(PinCodeT.DEFAULT.TextOptions);

    useEffect(() => {
        setCurMode(mode);
        setStatus(PinCodeT.Statuses.Initial);
        setPin('');
        setLastPin('');
        setShowError(false);
    }, [mode])

    useEffect(() => {
        setCurOptions({ ...PinCodeT.DEFAULT.Options, ...options });
    }, [options])

    useEffect(() => {
        if (!textOptions) return;
        // there are only 2 levels, don't use library for least dependencies
        const merged:PinCodeT.TextOptions = {
            enter: {
                ...PinCodeT.DEFAULT.TextOptions.enter,
                ...textOptions.enter
            },
            set: {
                ...PinCodeT.DEFAULT.TextOptions.set,
                ...textOptions.set
            },
            locked: {
                ...PinCodeT.DEFAULT.TextOptions.locked,
                ...textOptions.locked
            },
            reset: {
                ...PinCodeT.DEFAULT.TextOptions.reset,
                ...textOptions.reset
            }
        }
        setCurTextOptions(merged);
    }, [textOptions])

    function changeMode(newMode: PinCodeT.Modes) {
        setCurMode(newMode);
        if (onModeChanged) onModeChanged(newMode);
    }

    function changeStatus(newStatus: PinCodeT.Statuses) {
        setStatus(newStatus);
        if (onStatusChanged) onStatusChanged(curMode, newStatus);
    }

    async function onPinButtonPressed(value: string) {
        let newPin = '';
        if (value == 'delete') {
            newPin = pin.substr(0, pin.length - 1);
        } else {
            newPin = pin + value;
        }

        setPin(newPin);

        if (newPin.length == 4) {
            if (curMode == PinCodeT.Modes.Enter) {
                await processEnterPin(newPin)
            } else if (curMode == PinCodeT.Modes.Set) {
                await processSetPin(newPin);
            }
        }
    }

    async function processEnterPin(newPin: string) {
        setChecking(true);
        const ret = await checkPin(newPin);
        setChecking(false);
        setPin('');
        if (ret) {
            setFailureCount(0);
            onEnterSuccess(newPin);
            changeStatus(PinCodeT.Statuses.EnterSucceeded);
        } else {
            if (!curOptions.disableLock && failureCount == curOptions.maxAttemp) {
                changeMode(PinCodeT.Modes.Locked);
            } else {
                setFailureCount(failureCount + 1);
                changeStatus(PinCodeT.Statuses.EnterFailed);
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
                Vibration.vibrate();
                setTimeout(() => {
                    changeStatus(PinCodeT.Statuses.Initial);
                }, 1000);
            }
        }
    }

    async function processSetPin(newPin: string) {
        // STEP 1
        if (status == PinCodeT.Statuses.Initial || status == PinCodeT.Statuses.SetFailed) {
            setLastPin(newPin);
            changeStatus(PinCodeT.Statuses.SetOnce);
            setPin('');
        }
        // STEP 2
        else if (status == PinCodeT.Statuses.SetOnce) {
            if (lastPin == newPin) { // pin matched
                savePin(newPin);
                changeStatus(PinCodeT.Statuses.SetSucceeded);
                onSetSuccess(newPin);
            } else { // pin doesn't matched
                changeStatus(PinCodeT.Statuses.SetFailed);
                setShowError(true);
                Vibration.vibrate();
                setTimeout(() => setShowError(false), 3000);
                setTimeout(() => setPin(''), 1500);
            }
            setLastPin('');
        }
    }

    async function onDeletePIN() {
        await AsyncStorage.removeItem('@pin');
        changeStatus(PinCodeT.Statuses.ResetSucceeded);
        onResetSuccess();
    }

    async function checkPin(newPin: string) {
        const savedPin = await AsyncStorage.getItem('@pin');
        return (newPin == savedPin);
    }

    async function savePin(newPin: string) {
        await AsyncStorage.setItem('@pin', newPin);
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
                        <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>{curTextOptions.enter?.title}</Text>
                        {showError && <Text style={defaultStyles.error}>{curTextOptions.enter?.error}</Text>}
                    </> :
                    <>
                        {(status == PinCodeT.Statuses.Initial || status == PinCodeT.Statuses.SetFailed) && <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>{curTextOptions.set?.subTitle}</Text>}
                        {status == PinCodeT.Statuses.SetOnce && <Text style={[defaultStyles.subTitle, styles?.enter?.subTitle]}>{curTextOptions.set?.repeat}</Text>}
                        {showError && <Text style={defaultStyles.error}>{curTextOptions.set?.error}</Text>}
                    </>
                }
            </View>
            <View style={[defaultStyles.pinContainer, styles?.enter?.pinContainer]}>
                <Text style={{ width: pin.length >= 1 ? 12 : 6, height: pin.length >= 1 ? 12 : 6, borderRadius: pin.length >= 1 ? 6 : 3, backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10 }}></Text>
                <Text style={{ width: pin.length >= 2 ? 12 : 6, height: pin.length >= 2 ? 12 : 6, borderRadius: pin.length >= 2 ? 6 : 3, backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10 }}></Text>
                <View style={{ width: pin.length >= 3 ? 12 : 6, height: pin.length >= 3 ? 12 : 6, borderRadius: pin.length >= 3 ? 6 : 3, backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10 }}></View>
                <View style={{ width: pin.length >= 4 ? 12 : 6, height: pin.length >= 4 ? 12 : 6, borderRadius: pin.length >= 4 ? 6 : 3, backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10 }}></View>
            </View>
            <View style={[defaultStyles.buttonContainer, styles?.enter?.buttonContainer]}>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'1'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'2'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'3'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'4'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'5'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'6'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <PinButton value={'7'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'8'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                    <PinButton value={'9'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
                <View style={defaultStyles.pinNumberRow}>
                    <View style={[defaultStyles.button, { width: 60, height: 60 }]}></View>
                    <PinButton value={'0'} disabled={checking || status == PinCodeT.Statuses.EnterFailed} style={buttonStyle} onPress={onPinButtonPressed} />
                    <PinButton value={'delete'} backSpace={options?.backSpace} backSpaceText={curTextOptions?.enter?.backSpace}
                        disabled={checking || status == PinCodeT.Statuses.EnterFailed}
                        style={defaultStyles.button} textStyle={styles?.enter?.buttonText} onPress={onPinButtonPressed} />
                </View>
            </View>
            <View style={[defaultStyles.footer, styles?.enter?.footer]}>
                {curMode == PinCodeT.Modes.Enter && curOptions.allowReset &&
                    <Pressable onPress={() => changeMode(PinCodeT.Modes.Reset)}>
                        <Text style={[{ color: 'white' }, styles?.enter?.footerText]}>Quên mã PIN?</Text>
                    </Pressable>
                }
                {curMode == PinCodeT.Modes.Set &&
                    <Pressable onPress={() => {
                        setPin('');
                        setLastPin('');
                        if (onSetCancel) onSetCancel();
                    }}><Text style={{ color: 'white' }}>Hủy</Text></Pressable>
                }
            </View>
        </View >
    } else if (curMode == PinCodeT.Modes.Locked) {
        return <View style={[defaultStyles.mainContainer, styles?.main]}>
            <View style={[defaultStyles.titleContainer, styles?.locked?.titleContainer]}>
                <Text style={[defaultStyles.title, styles?.locked?.title]}>{curTextOptions.locked?.title}</Text>
                <Text style={[defaultStyles.subTitle, styles?.locked?.subTitle]}>{curTextOptions.locked?.subTitle}</Text>
            </View>
            <View style={defaultStyles.pinContainer}>
                {options?.lockIcon ? options.lockIcon : <Text style={styles?.locked?.locked}>{curTextOptions.locked?.lockedText}</Text>}
            </View>
            <View style={defaultStyles.buttonContainer}>
                <Clock style={styles?.locked?.clockContainer} textStyle={styles?.locked?.clockText}
                    duration={curOptions.lockDuration}
                    onFinish={() => {
                        changeMode(PinCodeT.Modes.Enter);
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
                    <TouchableOpacity onPress={() => changeStatus(PinCodeT.Statuses.ResetPrompted)}>
                        <Text style={[defaultStyles.confirm, styles?.reset?.buttons]}>Xóa mã PIN</Text>
                    </TouchableOpacity>
                </>}
                {status == PinCodeT.Statuses.ResetPrompted && <>
                    <Text style={{ color: 'white', marginBottom: 20 }}>{ }</Text>
                    <TouchableOpacity onPress={onDeletePIN}>
                        <Text style={[defaultStyles.confirm, styles?.reset?.buttons]}>Xác Nhận</Text>
                    </TouchableOpacity>
                </>}
                <TouchableOpacity onPress={() => changeMode(PinCodeT.Modes.Enter)} style={{ marginTop: 20 }}>
                    <Text style={[{ fontSize: 14, color: 'white' }, styles?.reset?.buttons]}>Trở lại</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    return <></>;

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