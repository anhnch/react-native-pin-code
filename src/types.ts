import { StyleProp, TextStyle, ViewStyle } from "react-native";

export namespace PinCodeT {
    export type EnterSetStyles = {
        /**
         * Style of the header container which wraps: `title`, `subTitle`, and `errorText`
         */
        header?: StyleProp<ViewStyle>;
        /**
         * Text style of the title
         */
        title?: StyleProp<TextStyle>;
        /**
         * Text style of the sub-title
         */
        subTitle?: StyleProp<TextStyle>;
        /**
         * Style of the content container which wraps `pinContainer` and `buttonContainer`
         */
        content?: StyleProp<ViewStyle>;
        /**
         * Style of the pin (circles) container which wraps the pins (circles)
         */
        pinContainer?: StyleProp<ViewStyle>;
        /**
         * Styles of the pins (small circles)
         */
        pin?: StyleProp<ViewStyle>;
        /**
         * Styles of the entered pins (big circles)
         */
        enteredPin?: StyleProp<ViewStyle>;
        /**
         * Style of the View that wraps the number buttons and the backspace button
         */
        buttonContainer?: StyleProp<ViewStyle>;
        /** 
         * Style of the each row of number buttons
         */
        buttonRow?: StyleProp<ViewStyle>;
        /**
         * Style of number buttons
         */
        button?: StyleProp<ViewStyle>;
        /**
         * Styles of the number buttons' textes
         */
        buttonText?: StyleProp<TextStyle>;
        /**
         * Style of the footer
         */
        footer?: StyleProp<ViewStyle>;
        /**
         * Style of the text inside the footer
         */
        footerText?: StyleProp<TextStyle>;
        /**
         * Style of the error text displayed when enter wrong pin
         */
        errorText?: StyleProp<TextStyle>;
    }

    export type EnterStyles = EnterSetStyles & {
        /**
         * Style of the button text if disabled
         */
        buttonTextDisabled?: StyleProp<TextStyle>;
    };
    export type SetStyles = EnterSetStyles & {};

    export type LockedStyles = {
        /**
         * Style of the header container which includes: title, sub-title, and error message
         */
        header?: StyleProp<ViewStyle>;
        /**
         * Text style of the title
         */
        title?: StyleProp<TextStyle>;
        /**
         * Text style of the sub-title
         */
        subTitle?: StyleProp<TextStyle>;
        /**
         * Style of the container which wraps the `lock` text/icon and the `CountDown`
         */
        content?: StyleProp<ViewStyle>;
        /**
         * Style of the container that wraps the `CountDown`
         */
        countdown?: StyleProp<ViewStyle>;
        /**
         * Style of the remaining time
         */
        countdownText?: StyleProp<TextStyle>;
        /**
         * Style of the lock text. You can render a lock icon instead by setting `lockIcon` to the `options`
         */
        lock?: StyleProp<TextStyle>;
        /**
         * Style of the footer
         */
        footer?: StyleProp<ViewStyle>;
        /**
         * Style of the footer text
         */
        footerText?: StyleProp<TextStyle>;
    }

    export type ResetStyles = {
        /**
         * Style of the header container which includes: title, sub-title, and error message
         */
        header?: StyleProp<ViewStyle>;
        /**
         * Text style of the title
         */
        title?: StyleProp<TextStyle>;
        /**
         * Text style of the sub-title
         */
        subTitle?: StyleProp<TextStyle>;
        /**
         * Style of the container which wraps the `resetButton` and `confirmText`
         */
        content?: StyleProp<ViewStyle>;
        /**
         * Styles of the reset button
         */
        resetButton?: StyleProp<TextStyle>;
        /**
         * Style of the confirm text
         */
        confirmText?: StyleProp<TextStyle>;
        /**
         * Style of the footer
         */
        footer?: StyleProp<ViewStyle>;
        /**
         * Style of the text inside the footer
         */
        footerText?: StyleProp<TextStyle>;
    }

    export interface PinCodeStyles {
        main?: StyleProp<ViewStyle>;
        enter?: EnterStyles;
        set?: SetStyles;
        locked?: LockedStyles;
        reset?: ResetStyles;
    }

    export interface PinCodeProps {
        /**
         * The current pin. When the app starts, it should get the pin from database/storage and pass to the PinCode. 
         * This will be used to check if the user enter the correct pin in the ENTER mode.
         */
        pin: string | undefined;
        /**
         * A boolean to show/hide the PinCode component
         */
        visible: boolean;
        /**
         * Setting the mode to switch between Enter/Set/Lock/Reset screen
         */
        mode: Modes;
        /**
         * Generic options to configure how PinCode behaves
         */
        options?: Options;
        /**
         * Customize the text content of the PinCode if you want to change the language or content.
         */
        textOptions?: TextOptions;
        /**
         * Setting the styles to customize how PinCode should look
         */
        styles?: PinCodeStyles,
        /**
         * Triggered when the user enters the correct pin. The application should hide the PinCode component and show its own content.
         * @param pin the entered pin
         * @see pin
         * @returns 
         */
        onEnter: (pin: string) => void;
        /**
         * Triggered when the user has successfully set the new pin. The application should persist the pin in this event.
         * @param pin the new pin
         * @returns 
         */
        onSet: (pin: string) => void;
        /**
         * Triggered when the user cancels the setting pin
         * @returns 
         */
        onSetCancel?: () => void;
        /**
         * Called when the user has confirmed to reset the pin. The application should reseting the content, history, anything that belongs to the user.
         * @returns 
         */
        onReset?: () => void;
        /**
         * Called when the mode changes.
         * @param lastMode 
         * @param newMode 
         * @returns 
         */
        onModeChanged?: (lastMode: Modes, newMode?: Modes) => void;
    }

    export enum Modes {
        /**
         * When the user is asked to enter the pin to access the secured content
         */
        Enter = 'enter',
        /**
         * When the user is asked to set the pin for the secured content
         */
        Set = 'set',
        /**
         * When the screen is locked due to exceeding the maxAttempt
         * @see maxAtempt
         */
        Locked = 'locked',
        /**
         * When the user forgot the pin and want to reset it
         */
        Reset = 'reset'
    }

    export enum Statuses {
        Initial = 'initial',
        SetOnce = 'set.once',
        ResetPrompted = 'reset.prompted',
        ResetSucceeded = 'reset.succeeded'
    }

    export interface Options {
        /** 
         * The length of pin
         * @default 4
         */
        pinLength?: number;
        /**
         * Set this to true to always allow retry without locking the screen
         */
        disableLock?: boolean;
        /**
         * The duration (miliseconds) the screen is locked if the user enters wrong pin many times.
         * @see maxAttempt
         */
        lockDuration?: number;
        /**
         * The number of times the users can enter wrong pin before the screen is locked
         * @see lockDuration
         */
        maxAttempt?: number;
        /**
         * Allow users to reset the pin if they forgot.
         */
        allowReset?: boolean;
        /**
         * A JSX element to render as the back button instead of text
         */
        backSpace?: JSX.Element;
        /**
         * Use this to render the lock icon in the `locked` mode
         */
        lockIcon?: JSX.Element;
        /**
         * A short duration (miliseconds) between attempts. This is also the timeout to hide the `error` message
         * @default 1000
         */
        retryLockDuration?: number;
    }

    export type EnterTextOptions = {
        /**
         * Title in the `ENTER` mode
         */
        title?: string;
        /**
         * Subtitle in the `ENTER` mode
         */
        subTitle?: string;
        /**
         * The error message if the user enters the wrong pin.
         */
        error?: string;
        /**
         * Text for the backspace button. Check the backSpace option if you want to render a button instead of text
         * @see backSpace
         */
        backSpace?: string;
        /**
         * Text for the footer in the `ENTER` mode
         */
        footerText?: string;
    }

    export type SetTextOptions = {
        /**
         * Title in the SET mode
         */
        title?: string;
        /**
         * Sub-title in the SET mode
         */
        subTitle?: string;
        /**
         * Text to prompt the user to enter the pin the second time to make sure that h
         */
        repeat?: string;
        /**
         * Text for the backspace button. Check the backSpace option if you want to render a button instead of text.
         * @see backSpace
         */
        backSpace?: string;
        /**
         * Error message if the users enter non-matching pin
         */
        error?: string;
        /**
         * Text to cancel the `SET` mode
         */
        cancel?: string;
    }
    export type LockedTextOptions = {
        /**
         * Title in the `LOCK` mode
         */
        title?: string;
        /**
         * Sub-Title in the `LOCK` mode
         */
        subTitle?: string;
        /**
         * The message to inform the user that the app is locked
         */
        lockedText?: string;
        /**
         * Text of the footer in the `LOCK` mode
         */
        footerText?: string;
    }
    export type ResetTextOptions = {
        title?: string;
        subTitle?: string;
        reset?: string;
        resetButton?: string,
        confirm?: string;
        confirmButton?: string;
        footerText?: string;
    }

    export interface TextOptions {
        /** Set custom text for the `ENTER` mode */
        enter?: EnterTextOptions,
        /** Set custom text for the `SET` mode */
        set?: SetTextOptions,
        /** Set custom text for the `LOCKED` mode */
        locked?: LockedTextOptions,
        /** Set custom text for the `RESET` mode */
        reset?: ResetTextOptions
    }
}

