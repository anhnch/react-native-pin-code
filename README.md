# React Native Pin Code
<img src="https://user-images.githubusercontent.com/131125/104954355-ab907800-59fa-11eb-9873-18916e23d611.png" width="75%"/>

This component is inspired by https://github.com/jarden-digital/react-native-pincode. The layout looks similar but I rewrite in typescript, simpler, organized and just enough options. I also add the Reset PIN code feature which allows users to remove the pin code if they fotgot.

The options look intimidating but don't worry. Almost all of them are optional.

NOTE: 
* The component doesn't block the app and asks the user to enter code for you. It just renders the Enter PIN screen, and you should style the component to cover the whole screen with absolute position, for instance. The best way is to place the component in your App component and use the state management tool to switch the visibility. Check the example below.
* The component doesn't handle persisting the pin code for you, you have to use AsyncStorage, MMKV, KeyChain on your own.

## Basic usage

```JSX
import { useMMKV, useMMKVString } from 'react-native-mmkv';
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';

const Screen = () => {
  const mmkv = useMMKV();
  const [pin, setPin] = useMMKVString('@pin', mmkv);
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Enter);
  const [pinVisible, setPinVisible] = useState(pin ? true : false);

  return <View>
    <PinCode pin={pin} mode={pinMode} visible={pinVisible} 
      styles={{ 
        main: { ...StyleSheets.absoluteFillObject, zIndex: 99 }
      }}
      onSet={newPin => {
        setPin(newPin);
        setPinVisible(false);
      }}
      onSetCancel={() => setPinVisible(false)}
      onReset={() => setPin(undefined)}
      onEnter={() => setPinVisible(false)}
    />
  </View>
}
```

## Properties
| Name           | Description                                                                                                                                                                                                                       | Required | Default |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| visible        | Show/hide the component                                                                                                                                                                                                           | true     | false   |
| mode           | The component has 4 modes:<ul><li>enter: user has to enter the PIN to access</li><li>set: set up new PIN</li><li>locked: lock the user from accessing and count down.</li><li>reset: allow user to remove PIN.</li></ul>          | true     | enter   |
| options        | Specify how the component works. Check the options below                                                                                                                                                                          | false    |         |
| textOptions    | Customize the text content of the PinCode if you want to change the language or content. Check the options below                                                                                                                  | false    |         |
| styles         | Setting the styles to customize how PinCode should look. Check the style options below                                                                                                                                            | false    |         |
| onEnter        | Triggered when the mode is `enter` and the user has entered the correct PIN. The application should hide the PinCode component and show its own content.<br/>Parameters:<ul><li>pin (string, optional): the entered PIN</li></ul> | true     |         |
| onSet          | Triggered when the user has successfully set the new pin. The application should persist the pin in this event.<br/>Parameters:<ul><li>pin (string, optional): the set PIN</li></ul>                                              | true     |         |
| onSetCancel    | Triggered when the mode is `set` and user cancels the setting pin. The app should hide the pin code                                                                                                                               | true     |         |
| onReset        | Called when the user has confirmed to reset the pin. The application may clear the content, history, anything that belongs to the user if necessary                                                                               | false    |         |
| onModeChanged  | Called when the mode changes.<br/>Parameters:<ul><li>lastMode: the previous mode</li><li>newMode: the changed to mode</li></ul>                                                                                                   | false    |         |


## Options
| Name              | Description                                                                                                                                                                          | Required | Default |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------- |
| pinLength         | Number of digits                                                                                                                                                                     | false    | 4       |
| maxAttempt        | The number of attempts when entering PIN. When user enters wrong PIN for a number of times, the Locked screen is shown.                                                              | false    | 10      |
| lockDuration      | The duration (miliseconds) the screen is locked if the user enters wrong pin many times.                                                                                             | false    | 60000   |
| disableLock       | By default, the `locked` screen is shown when `maxAttempt` has reached. Set this to true to disable the locked mode.                                                                 | false    | false   |
| allowReset        | If true, the "Forgot PIN?" button is displayed at the bottom of the `enter` screen                                                                                                   | false    | true    |
| backSpace         | On `enter`/`set` mode the "Delete" button is used to delete the entered digit. But you can pass an ```<Icon name='backspace' size={24} />``` to display an icon instead.             | false    |         |
| lockedIcon        | On the `locked` screen the "Locked" text is shown above the countdown. But you can pass an ```<Icon name='lock' size={24} />``` to display an icon instead.                          | false    |         |
| retryLockDuration | A short duration (miliseconds) between attempts. This is also the timeout to hide the `error` message.                                                                          | false    | 1000    | 


## Text Options
The text options are grouped by `mode` for the ease to find.

### `Enter` mode text options
| Name       | Description                             | Required | Default                      | Type   |
| ---------- | --------------------------------------- | -------- | ---------------------------- | ------ |
| title      | the Enter screen title                  | false    | Enter PIN                    | string |
| subTitle   | the Enter screen sub title              | false    | Enter 4-digit PIN to access. | string |
| error      | error message when user enter wrong PIN | false    | Wrong PIN! Try again.        | string |
| backSpace  | the text of the backspace button        | false    | Delete                       | string |
| footerText | the text of the footer button           | false    | Forgot PIN?                  | string |

### `Set` mode text options
| Name       | Description                                       | Required | Default                                   | Type   |
| ---------- | ------------------------------------------------- | -------- | ----------------------------------------- | ------ |
| title      | the Set screen title                              | false    | Set up a new PIN                          | string |
| subTitle   | the Set screen sub title                          | false    | Enter 4 digits.                           | string |
| repeat     | Prompt to enter pin one more time to avoid typos  | false    | Enter new PIN again.                      | string |
| error      | the error message when repeated PIN doesn't match | false    | PIN don't match. Start the process again. | string |
| backSpace  | the text of the backspace button                  | false    | Delete                                    | string |
| cancel     | the cancel button                                 | false    | Cancel                                    | string |

### `Locked` mode text options
| Name       | Description                                                                      | Required | Default                                                                    | Type   |
| ---------- | -------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- | ------ |
| title      | the `Locked` mode title                                                          | false    | Locked                                                                     | string |
| subTitle   | the `Locked` mode sub title                                                      | false    | Your have entered wrong PIN many times.<br/>The app is temporarily locked. | string |
| lockedText | the locked text (this can be replaced with icon) by using the lockIcon option    | false    | Locked                                                                     | string |
| footerText | the `Locked` mode footer                                                         | false    |                                                                            | string |

### `Reset` mode text options
| Name          | Description                                                                                                                                                                | Required | Default                                                | Type   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------ | ------ |
| title         | The Reset screen title                                                                                                                                                     | false    | Forgot PIN?                                            | string |
| subTitle      | The Reset screen sub title. You can use the {{maxAttempt}} and {{lockDuration}} placeholders to display the maxAttempt and lockDuration (in minutes) in the sub title.     | false    | Remove the PIN may wipe out the app data and settings. | string |
| resetButton   | Label of the reset button                                                                                                                                                  | false    | Reset                                                  | string |
| confirm       | The message to ask the user to confirm the resetting                                                                                                                       | false    | Are you sure you want remove the PIN?                  | string |
| confirmButton | Label of the confirm button                                                                                                                                                | false    | Confirm                                                | string |
| footerText    | The footer text                                                                                                                                                            | false    | Back                                                   | string |



## Styles options
The styles are grouped by mode. All mode layout has 3 sections: header, content, footer. The default values can be accessed by importing the `DEFAULT` from the package
```JSX
import { DEFAULT } from '@anhnch/react-native-pin-code';
// DEFAULT.Styles.enter
// DEFAULT.Styles.set
```

### `Enter` mode styles
| Name               | Description                                                                     | Required | Type      |
| ------------------ | ------------------------------------------------------------------------------- | -------- | --------- |
| header             | Style of the header container which wraps: `title`, `subTitle`, and `errorText` | false    | ViewStyle |
| title              | Style of the title                                                              | false    | TextStyle |
| subTitle           | Style of the sub title                                                          | false    | TextStyle |
| errorText          | Style of the error                                                              | false    | TextStyle |
| content            | Style of the container which wraps `pinContainer` and `buttonContainer`         | false    | ViewStyle |
| pinContainer       | Style of the container which wraps the pins (dots/circles)                      | false    | ViewStyle |
| pin                | Style of the pins (dots/circles)                                                | false    | ViewStyle |
| enteredPin         | Style of the entered pins (big dots/circles)                                    | false    | ViewStyle |
| buttonContainer    | Style of the View that wraps the number buttons and the backspace button        | false    | ViewStyle |
| buttonRow          | Style of the View that wraps the rows of number buttons                         | false    | ViewStyle |
| button             | Style which wraps digit buttons                                                 | false    | ViewStyle |
| buttonText         | Style of the number button's label                                              | false    | TextStyle |
| buttonTextDisabled | Style of the button text if disabled                                            | false    | TextStyle |
| footer             | Style of the footer container                                                   | false    | ViewStyle |
| footerText         | Style the footer text                                                           | false    | TextStyle |

### `Set` mode styles
Same as the `enter` mode styles, but without the `buttonTextDisabled`

### `Locked` mode styles
| Name               | Description                                                                     | Required | Type      |
| ------------------ | ------------------------------------------------------------------------------- | -------- | --------- |
| header             | Style of the header container which wraps: `title`, `subTitle`                  | false    | ViewStyle |
| title              | Style of the title                                                              | false    | TextStyle |
| subTitle           | Style of the sub title                                                          | false    | TextStyle |
| content            | Style of the container which wraps the `lock` text/icon and the `CountDown`     | false    | ViewStyle |
| countdown          | Style of the container that wraps the `CountDown`                               | false    | ViewStyle |
| countdownText      | Style of the remaining time                                                     | false    | TextStyle |
| lock               | Style of the lock text. You can render a lock icon instead by setting `lockIcon`| false    | TextStyle |
| footer             | Style of the footer container                                                   | false    | ViewStyle |
| footerText         | Style the footer text                                                           | false    | TextStyle |

### `Reset` mode styles
| Name               | Description                                                                     | Required | Type      |
| ------------------ | ------------------------------------------------------------------------------- | -------- | --------- |
| header             | Style of the header container which wraps: `title`, `subTitle`                  | false    | ViewStyle |
| title              | Style of the title                                                              | false    | TextStyle |
| subTitle           | Style of the sub title                                                          | false    | TextStyle |
| content            | Style of the container which wraps the `lock` text/icon and the `CountDown`     | false    | ViewStyle |
| resetButton        | Styles of the reset button                                                      | false    | ViewStyle |
| confirmText        | Style of the confirm message                                                    | false    | TextStyle |
| footer             | Style of the footer container                                                   | false    | ViewStyle |
| footerText         | Style the footer text                                                           | false    | TextStyle |

## Example
Here is an example how to use Recoil to switch visibility and mode; and use MMKV to persist the pin code.

```JSX
import React, { useEffect } from 'react';
import { View, StyleSheet, AppState, AppStateStatus, Text, Button } from 'react-native';
import { RecoilRoot, useRecoilState, atom } from 'recoil';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useMMKV, useMMKVString } from 'react-native-mmkv';
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';

const MainStack = createStackNavigator();

const PinCodeVisibleAtom = atom({
    key: 'common.PinCodeVisibleAtom',
    default: true
})

const PinCodeModeAtom = atom({
    key: 'common.PinCodeModeAtom',
    default: PinCodeT.Modes.Enter
})

const customTextes: PinCodeT.TextOptions = {
  enter: {
    subTitle: 'Enter PIN to access.',
  },
  set: {
    subTitle: 'Enter {{pinLength}} digits.'
  },
  locked: {
    title: 'Locked',
    subTitle: `Wrong PIN {{maxAttempt}} times.\nTemporarily locked in {{lockDuration}}.`
  }
};

const EnterAndSet: PinCodeT.EnterSetStyles = {
    header: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 100 },
    title: { fontSize: 24 }
}

const customStyles:PinCodeT.Styles = { 
  main: { ...StyleSheet.absoluteFillObject, zIndex: 99, backgroundColor: 'blue' },
  enter: {
    ...EnterAndSet,
    buttonTextDisabled: { color: 'gray' },
  },
  set: EnterAndSet,
  locked: {
    countdown: { borderColor: 'black' },
    countdownText: { color: 'black' },
  },
  reset: {
    confirmText: { color: 'red' },
  }
}

const HomeScreen = () => {
    const [pinVisible, setPinVisible] = useRecoilState(PinCodeVisibleAtom);
    const [pinMode, setPinMode] = useRecoilState(PinCodeModeAtom);

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, marginBottom: 30, fontWeight: 'bold' }}>React Native Pin Code</Text>
        <Button title='Show PinCode Enter' onPress={() => {
          setPinMode(PinCodeT.Modes.Enter);
          setPinVisible(true);
        }} />
        <Button title='Set a new PIN' onPress={() => {
          setPinMode(PinCodeT.Modes.Set);
          setPinVisible(true);
        }} />
    </View>
}

const App = () => {
    return <>
      <NavigationContainer fallback={<Text>Loading</Text>}>
          <MainStack.Navigator initialRouteName="Home">
              <MainStack.Screen name="Home" component={HomeScreen} />
          </MainStack.Navigator>
      </NavigationContainer>
      <PinCodeComp />
    </>;
}

const PinCodeComp = () => {
  const mmkv = useMMKV();
  const [pin, setPin] = useMMKVString('@pin', mmkv);
  const [pinVisible, setPinVisible] = useRecoilValue(PinCodeVisibleAtom);
  const [pinMode, setPinMode] = useRecoilValue(PinCodeModeAtom);

  return <PinCode pin={pin} visible={visible} mode={pinMode}
      options={{
        backSpace: <Icon name='backspace' size={24} color='white' />,
        lockIcon: <Icon name='lock' size={24} color='white' />,
        retryLockDuration: 1000,
        maxAttempt: 5
      }}
      textOptions={customTextes}
      styles={customStyles} 
      onEnter={() => setPinVisible(false)}
      onSet={newPin => {
          setPin(newPin);
          setPinVisible(false);
      }}
      onSetCancel={() => setPinVisible(false)}
      onReset={() => setPin(undefined)}
    />
}

export default () => <RecoilRoot><App /></RecoilRoot>;
```
