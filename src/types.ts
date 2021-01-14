import { TextStyle, ViewStyle } from "react-native";

export namespace PinCodeT {
    export interface PinCodeT {
        visible: boolean;
        mode: Modes;
        options?: Options;
        textOptions?: {
            enterTitle?: string;
            enterSubTitle?: string;
            enterError?: string;
            setTitle?: string;
            setSubTitle?: string;
            setRepeatText?: string;
            setError?: string;
            lockedTitle?: string;
            lockedSubTitle?: string;
            resetTitle?: string;
            resetSubTitle?: string;
        },
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
    }

    export type TextOptions = Record<string, string>;

    export const DEFAULT = {
        Options: {
            allowReset: true,
            disableLock: false,
            lockedDuration: 600000,
            maxAttempt: 4
        },
        TextOptions: {
            enterTitle: 'Nhập mã PIN',
            enterSubTitle: 'Nhập mã PIN 4 số để truy cập.',
            enterError: 'Sai mã PIN! Hãy nhập lại.',
            setTitle: 'Thiết lập PIN',
            setSubTitle: 'Nhập 4 số.',
            setRepeatText: 'Nhập lại mã PIN lần nữa.',
            setError: 'Mã PIN không khớp. Hãy thực hiện lại.',
            lockedTitle: 'Tạm khóa',
            lockedSubTitle: `Bạn đã nhập sai mã PIN nhiều lần.\nỨng dụng sẽ bị khóa tạm thời.`,
            resetTitle: 'Quên mã PIN',
            resetSubTitle: `Xóa mã PIN sẽ xóa tất cả những dữ liệu đã lưu`,
        }
    }
}