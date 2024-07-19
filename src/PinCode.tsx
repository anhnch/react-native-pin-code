import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { PinCodeT } from './types';
import ResetLayout from './ResetLayout';
import LockedLayout from './LockedLayout';
import EnterLayout from './EnterLayout';
import { DEFAULT } from './common';
import SetLayout from './SetLayout';

const PinCode = ({
    pin,
    visible = false,
    mode = PinCodeT.Modes.Enter,
    options,
    textOptions,
    styles,
    onEnter,
    onSet,
    onSetCancel,
    onReset,
    onModeChanged,
    onEnterValidation
}: PinCodeT.PinCodeProps) => {
    const [curMode, setCurMode] = useState<PinCodeT.Modes>(mode);
    const [curOptions, setCurOptions] = useState<PinCodeT.Options>(DEFAULT.Options);
    const [curTextOptions, setCurTextOptions] = useState<PinCodeT.TextOptions>(DEFAULT.TextOptions);

    useEffect(() => {
        setCurOptions({ ...DEFAULT.Options, ...options });
    }, [options])

    useEffect(() => {
        if (!textOptions) return;

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

    useEffect(() => {
        setCurMode(mode);
    }, [mode])

    function switchMode(newMode: PinCodeT.Modes) {
        setCurMode(newMode);
        onModeChanged?.(curMode, newMode);
    }

    if (!visible) return null;

    return (
      <View style={[DEFAULT.Styles.main, styles?.main]}>
        {curMode == PinCodeT.Modes.Enter && (
          <EnterLayout
            pin={pin}
            mode={curMode}
            options={curOptions}
            textOptions={curTextOptions}
            onEnter={onEnter}
            onMaxAttempt={() => switchMode(PinCodeT.Modes.Locked)}
            onReset={() => switchMode(PinCodeT.Modes.Reset)}
            styles={styles?.enter}
            onEnterValidation={onEnterValidation}
          />
        )}
        {curMode == PinCodeT.Modes.Set && (
          <SetLayout
            pin={pin}
            mode={curMode}
            options={curOptions}
            textOptions={curTextOptions}
            onSet={onSet}
            onReset={() => switchMode(PinCodeT.Modes.Reset)}
            onSetCancel={onSetCancel}
            styles={styles?.enter}
          />
        )}
        {curMode == PinCodeT.Modes.Locked && (
          <LockedLayout
            options={curOptions}
            textOptions={curTextOptions.locked}
            styles={styles?.locked}
            onClockFinish={() => switchMode(PinCodeT.Modes.Enter)}
          />
        )}
        {curMode == PinCodeT.Modes.Reset && (
          <ResetLayout
            styles={styles?.reset}
            textOptions={curTextOptions.reset}
            options={curOptions}
            onReset={onReset}
            onCancel={() => switchMode(PinCodeT.Modes.Enter)}
          />
        )}
      </View>
    );
}

export default PinCode;