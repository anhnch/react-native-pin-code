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
     * Style of the container which wraps the pins (dots/circles)
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
  };

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
  };

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
  };

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
     * The component has 4 modes:
     * * `enter`: user has to enter the PIN to access
     * * `set`: set up new PIN
     * * `locked`: lock the user from accessing and count down.
     * * `reset`: allow user to remove PIN.
     */
    mode: Modes;
    /**
     * Specify how the component works.
     */
    options?: Options;
    /**
     * Customize the text content of the PinCode if you want to change the language or content.
     */
    textOptions?: TextOptions;
    /**
     * Setting the styles to customize how PinCode should look
     */
    styles?: PinCodeStyles;
    /**
     * Triggered when the mode is `enter` and the user has entered the correct PIN. The application should hide the PinCode component and show its own content.
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
    onSetCancel: () => void;
    /**
     * Called when the user has confirmed to reset the pin. The application should reseting the content, history, anything that belongs to the user.
     * @returns
     */
    onReset: () => void;
    /**
     * Called when the mode is changed by PinCode itself. When you change the mode, it won't trigger.
     * @param lastMode
     * @param newMode
     * @returns
     */
    onModeChanged?: (lastMode: Modes, newMode?: Modes) => void;

    /**
     * Used to customize the validation check for pin in enter mode
     * @param enteredPin
     * @returns Promise<boolean>
     */
    onEnterValidation?: (enteredPin: string) => Promise<boolean>;
  }

  export enum Modes {
    /**
     * When the user is asked to enter the pin to access the secured content
     */
    Enter = "enter",
    /**
     * When the user is asked to set the pin for the secured content
     */
    Set = "set",
    /**
     * When the screen is locked due to exceeding the maxAttempt
     * @see maxAtempt
     */
    Locked = "locked",
    /**
     * When the user forgot the pin and want to reset it
     */
    Reset = "reset",
  }

  export enum Statuses {
    Initial = "initial",
    SetOnce = "set.once",
    ResetPrompted = "reset.prompted",
    ResetSucceeded = "reset.succeeded",
  }

  export interface Options {
    /**
     * The length of pin
     * @default 4
     */
    pinLength?: number;
    /**
     * The number of attempts when entering PIN. When user enters wrong PIN for a number of times, the Locked screen is shown.
     * @see lockDuration
     */
    maxAttempt?: number;
    /**
     * The duration (miliseconds) the screen is locked if the user enters wrong pin many times.
     * @see maxAttempt
     */
    lockDuration?: number;
    /**
     * By default, the `locked` screen is shown when `maxAttempt` has reached. Set this to true to disable the locked mode.
     */
    disableLock?: boolean;
    /**
     * If allowReset is set to true, the "Forgot PIN?" button is displayed at the bottom of the Enter screen
     */
    allowReset?: boolean;
    /**
     * On Enter/Set screen the "Delete" button is used to delete the entered digit. But you can render an icon instead.
     * @example <Icon name='backspace' size={24} />
     */
    backSpace?: JSX.Element;
    /**
     * On Locked screen the "Locked" text is shown above the countdown. But you can render an icon instead.
     * @example <Icon name='lock' size={24} />
     */
    lockIcon?: JSX.Element;
    /**
     * A short duration (miliseconds) between attempts that the number buttons are disabled. This is also the timeout to hide the `error` message.
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
  };

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
     * Text to prompt the users to enter the pin one more time to avoid typos
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
  };
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
     * the locked text (this can be replaced with icon) by using the lockIcon option
     * @see lockIcon
     */
    lockedText?: string;
    /**
     * Text of the footer in the `LOCK` mode
     */
    footerText?: string;
  };
  export type ResetTextOptions = {
    /**
     * Title in the `reset` mode
     */
    title?: string;
    /**
     * The `reset` mode sub-title. You can use the `{{maxAttempt}}` and `{{lockDuration}}` placeholders to display the `maxAttempt` and `lockDuration` (in minutes) in the sub title.
     */
    subTitle?: string;
    /**
     * Label of the reset button
     */
    resetButton?: string;
    /**
     * The message to ask the user to confirm the resetting
     */
    confirm?: string;
    /**
     * Label of the confirm button
     */
    confirmButton?: string;
    /**
     * The footer text
     */
    footerText?: string;
  };

  export interface TextOptions {
    /** Set custom text for the `ENTER` mode */
    enter?: EnterTextOptions;
    /** Set custom text for the `SET` mode */
    set?: SetTextOptions;
    /** Set custom text for the `LOCKED` mode */
    locked?: LockedTextOptions;
    /** Set custom text for the `RESET` mode */
    reset?: ResetTextOptions;
  }
}
