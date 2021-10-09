import { TextStyle, ViewStyle } from "react-native";

export namespace PinCodeT {
    export interface PinCodeT {
        visible: boolean;
        mode: Modes;
        options?: Options;
        textOptions?: TextOptions,
        styles?: {
            main?: ViewStyle | ViewStyle[],
            enter?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                pinContainer?: ViewStyle | ViewStyle[];
                buttonContainer?: ViewStyle | ViewStyle[];
                buttons?: ViewStyle | ViewStyle[];
                buttonText?: TextStyle | TextStyle[];
                footer?: ViewStyle | ViewStyle[];
                footerText?: TextStyle | TextStyle[];
            },
            locked?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                clockContainer?: ViewStyle | ViewStyle[];
                clockText?: TextStyle | TextStyle[];
                locked?: TextStyle | TextStyle[];
            },
            reset?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                buttons?: TextStyle | TextStyle[];
            }
        }
        onEnterSuccess: (pin?: string) => void;
        onSetSuccess: (pin?: string) => void;
        onSetCancel?: () => void;
        onResetSuccess: () => void;
        onModeChanged?: (lastMode: Modes, newMode?: Modes) => void;
        checkPin?: (pin: string) => Promise<boolean>;
    }

    export enum Modes {
        Enter = 'enter',
        Set = 'set',
        Locked = 'locked',
        Reset = 'reset'
    }

    export enum Statuses {
        Initial = 'initial',
        SetOnce = 'set.once',
        ResetPrompted = 'reset.prompted',
        ResetSucceeded = 'reset.succeeded'
    }

    export interface Options {
        pinLength?: number;
        disableLock?: boolean;
        lockDuration?: number;
        maxAttempt?: number;
        allowReset?: boolean;
        backSpace?: JSX.Element;
        lockIcon?: JSX.Element;
    }

    export interface TextOptions {
        enter?: {
            title?: string;
            subTitle?: string;
            error?: string;
            backSpace?: string;
            footerText?: string;
        },
        set?: {
            title?: string;
            subTitle?: string;
            repeat?: string;
            error?: string;
            cancel?: string;
        },
        locked?: {
            title?: string;
            subTitle?: string;
            lockedText?: string;
        },
        reset?: {
            title?: string;
            subTitle?: string;
            reset?: string;
            resetButton?: string,
            confirm?: string;
            confirmButton?: string;
            backButton?: string;
        }
    }
}

export const DEFAULT = {
    Options: {
        pinLength: 4,
        allowReset: true,
        disableLock: false,
        lockDuration: 600000,
        maxAttempt: 10
    },
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
            backButton: 'Back'
        }
    }
}


export const PIN_KEY = '@pincode';