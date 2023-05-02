import { StyleSheet } from "react-native";
import { PinCodeT } from "./types";

const EnterSet: PinCodeT.EnterSetStyles = {
    header: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100 },
    title: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
    subTitle: { textAlign: 'center', marginTop: 20, color: 'white' },
    pinContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80 },
    pin: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10 },
    enteredPin: { width: 12, height: 12, borderRadius: 6 },
    content: { justifyContent: 'flex-start', alignItems: 'center' },
    buttonRow: { flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' },
    button: { marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
    buttonText: { fontSize: 20 },
    errorText: { marginTop: 10, color: 'orange' },
    footer: { justifyContent: 'center', alignItems: 'center' },
    footerText: { marginTop: 50, padding: 5, color: 'white' }
}

export const DEFAULT = {
    Options: {
        pinLength: 4,
        allowReset: true,
        disableLock: false,
        lockDuration: 60000,
        maxAttempt: 10,
        retryLockDuration: 1000
    } as PinCodeT.Options,
    TextOptions: {
        enter: {
            title: 'Enter PIN',
            subTitle: 'Enter {{pinLength}}-digit PIN to access.',
            error: 'Wrong PIN! Try again.',
            backSpace: 'Delete',
            footerText: 'Forgot PIN?'
        },
        set: {
            title: 'Set up a new PIN',
            subTitle: 'Enter {{pinLength}} digits.',
            repeat: 'Enter new PIN again.',
            error: `PIN don't match. Start the process again.`,
            cancel: 'Cancel'
        },
        locked: {
            title: 'Locked',
            subTitle: `Your have entered wrong PIN {{maxAttempt}} times.\nThe app is temporarily locked in {{lockDuration}}.`,
            lockedText: 'Locked',
        },
        reset: {
            title: 'Forgot PIN?',
            subTitle: `Remove the PIN may wipe out the app data and settings.`,
            resetButton: 'Remove',
            confirm: 'Are you sure you want remove the PIN?',
            confirmButton: 'Confirm',
            footerText: 'Back'
        }
    } as PinCodeT.TextOptions,
    Styles: {
        main: { ...StyleSheet.absoluteFillObject, flex: 1, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
        enter: {
            ...EnterSet,
            buttonTextDisabled: { color: 'gray' },
        },
        set: EnterSet,
        locked: {
            header: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100, textAlign: 'center', color: 'white' },
            title: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
            subTitle: { textAlign: 'center', marginTop: 20, color: 'white' },
            content: { justifyContent: 'center', alignItems: 'center', padding: 10 },
            lock: {},
            countdown: { justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 30, paddingVertical: 10, borderColor: 'white', marginTop: 20 },
            countdownText: { fontSize: 20, color: 'white' },
            footer: { alignItems: 'center' },
        },
        reset: {
            header: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100, textAlign: 'center', color: 'white' },
            title: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
            subTitle: { textAlign: 'center', marginTop: 20, color: 'white' },
            content: { justifyContent: 'flex-start', alignItems: 'center' },
            confirmText: { color: 'white', marginBottom: 20, borderColor: 'white', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5 },
            resetButton: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10, overflow: 'hidden', fontSize: 14 },
            footerText: { fontSize: 14, paddingHorizontal: 40, paddingVertical: 20, color: 'white' }
        }
    } as PinCodeT.PinCodeStyles
}

export function millisToMinutesAndSeconds(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}