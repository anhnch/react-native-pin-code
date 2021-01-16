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
        onEnterSuccess: () => void;
        onSetSuccess: () => void;
        onSetCancel?: () => void;
        onResetSuccess: () => void;
        onModeChanged?: (mode: Modes) => void;
        onStatusChanged?: (mode: Modes, status: Statuses) => void;
    }

    export enum Modes {
        Enter = 'enter',
        Set = 'set',
        Locked = 'locked',
        Reset = 'reset'
    }

    export enum Statuses {
        Initial = 'initial',
        EnterFailed = 'enter.failed',
        EnterSucceeded = 'enter.succeeded',

        SetOnce = 'set.once',
        SetFailed = 'set.failed',
        SetSucceeded = 'set.succeeded',

        ResetPrompted = 'reset.prompted',
        ResetSucceeded = 'reset.succeeded'
    }



    export interface Options {
        disableLock?: boolean;
        lockDuration?: number;
        maxAttemp?: number;
        allowReset?: boolean;
        backSpace?: JSX.Element;
        lockIcon?: JSX.Element;
    }

    export interface TextOptions {
        enter: {
            title?: string;
            subTitle?: string;
            error?: string;
            backSpace?: string;
        },
        set: {
            title?: string;
            subTitle?: string;
            repeatText?: string;
            error?: string;
        },
        locked: {
            title?: string;
            subTitle?: string;
            lockedText?: string;
        },
        reset?: {
            title?: string;
            subTitle?: string;
            confirm?: string;
        }
    }

    export const DEFAULT = {
        Options: {
            allowReset: true,
            disableLock: false,
            lockedDuration: 600000,
            maxAttempt: 4
        },
        TextOptions: {
            enter: {
                title: 'Nhập mã PIN',
                subTitle: 'Nhập mã PIN 4 số để truy cập.',
                error: 'Sai mã PIN! Hãy nhập lại.',
                backSpace: 'Xóa'
            },
            set: {
                title: 'Thiết lập PIN',
                subTitle: 'Nhập 4 số.',
                repeat: 'Nhập lại mã PIN lần nữa.',
                error: 'Mã PIN không khớp. Hãy thực hiện lại.',
            },
            locked: {
                title: 'Tạm khóa',
                subTitle: `Bạn đã nhập sai mã PIN nhiều lần.\nỨng dụng sẽ bị khóa tạm thời.`,
                lockedText: 'Khóa',
            },
            reset: {
                title: 'Quên mã PIN',
                subTitle: `Xóa mã PIN sẽ xóa tất cả những dữ liệu đã lưu`,
                confirm: 'Bạn có thực sư muốn xóa không?'
            }
        }
    }
}