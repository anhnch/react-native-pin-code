import React, { useState } from "react";
import { Platform, Pressable, Text, Vibration, View } from "react-native";
import { DEFAULT } from "./common";
import NumbersPanel from "./components/NumbersPanel";
import Pin from "./components/Pin";
import { PinCodeT } from "./types";

const EnterLayout = ({
  pin,
  styles,
  mode,
  textOptions,
  options,
  onSwitchMode,
  onEnter,
  onReset,
  onMaxAttempt,
  onEnterValidation,
}: {
  pin: string | undefined;
  styles?: PinCodeT.EnterStyles;
  mode: PinCodeT.Modes;
  textOptions: PinCodeT.TextOptions;
  options?: PinCodeT.Options;
  onSwitchMode?: () => void;
  onEnter: (newPin: string) => void;
  onMaxAttempt: () => void;
  onReset: () => void;
  onEnterValidation?: (enteredPin: string) => Promise<boolean>;
}) => {
  const [curPin, setCurPin] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [showError, setShowError] = useState(false);

  async function onNumberPress(value: string) {
    const newPin =
      value == "delete"
        ? curPin.substring(0, curPin.length - 1)
        : curPin + value;

    setCurPin(newPin);

    if (newPin.length == options?.pinLength) {
      await processEnterPin(newPin);
    }
  }

  async function processEnterPin(enteredPin: string) {
    setDisabled(true);

    let isPinValid: boolean = false;

    if (onEnterValidation) {
      isPinValid = await onEnterValidation(enteredPin);
      if (isPinValid) {
        resetPinSetupToDefault(enteredPin);
        return;
      }
    }

    if (pin === enteredPin && !onEnterValidation) {
      resetPinSetupToDefault(enteredPin);
      return;
    }

    if (
      !options?.disableLock &&
      failureCount >=
        (options?.maxAttempt || DEFAULT.Options.maxAttempt || 5) - 1
    ) {
      setDisabled(false);
      onMaxAttempt();
      return;
    }

    setCurPin("");
    setFailureCount(failureCount + 1);

    if (Platform.OS === "ios") {
      Vibration.vibrate(); // android requires VIBRATE permission
    }

    setShowError(true);
    setTimeout(
      () => setShowError(false),
      options?.retryLockDuration ?? DEFAULT.Options.retryLockDuration
    );
    setTimeout(
      () => setDisabled(false),
      options?.retryLockDuration ?? DEFAULT.Options.retryLockDuration
    );
  }

  const resetPinSetupToDefault = (enteredPin: string) => {
    setFailureCount(0);
    setDisabled(false);
    onEnter(enteredPin);
  };

  return (
    <>
      <View style={[DEFAULT.Styles.enter?.header, styles?.header]}>
        <Text style={[DEFAULT.Styles.enter?.title, styles?.title]}>
          {textOptions.enter?.title ?? DEFAULT.TextOptions.enter?.title}
        </Text>

        <Text style={[DEFAULT.Styles.enter?.subTitle, styles?.subTitle]}>
          {textOptions.enter?.subTitle?.replace(
            "{{pinLength}}",
            (options?.pinLength ?? DEFAULT.Options.pinLength ?? 4).toString()
          )}
        </Text>
        {showError && (
          <Text style={[DEFAULT.Styles.enter?.errorText, styles?.errorText]}>
            {textOptions.enter?.error ?? DEFAULT.TextOptions.enter?.error}
          </Text>
        )}
      </View>
      <View style={[DEFAULT.Styles.enter?.content, styles?.content]}>
        <Pin
          pin={curPin}
          pinLength={options?.pinLength ?? DEFAULT.Options.pinLength ?? 4}
          style={styles?.pinContainer}
          pinStyle={[DEFAULT.Styles.enter?.pin, styles?.pin]}
          enteredPinStyle={[
            DEFAULT.Styles.enter?.enteredPin,
            styles?.enteredPin,
          ]}
        />

        <NumbersPanel
          disabled={disabled}
          onButtonPress={onNumberPress}
          backSpace={options?.backSpace}
          backSpaceText={textOptions.enter?.backSpace}
          buttonStyle={styles?.button}
          rowStyle={styles?.buttonRow}
          style={styles?.buttonContainer}
          textStyle={styles?.buttonText}
          disabledStyle={styles?.buttonTextDisabled}
        />
      </View>
      <View style={[DEFAULT.Styles.enter?.footer, styles?.footer]}>
        {options?.allowReset && (
          <Pressable
            onPress={onReset}
            style={(state) => ({ opacity: state.pressed ? 0.6 : 1 })}
          >
            <Text
              style={[DEFAULT.Styles.enter?.footerText, styles?.footerText]}
            >
              {textOptions.enter?.footerText ??
                DEFAULT.TextOptions.enter?.footerText}
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
};

export default EnterLayout;
