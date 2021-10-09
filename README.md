# React Native Pincode
<img src="https://user-images.githubusercontent.com/131125/104954355-ab907800-59fa-11eb-9873-18916e23d611.png" width="75%"/>

This component is inspired by https://github.com/jarden-digital/react-native-pincode. The layout looks similar but I rewrite in typescript, simpler, more organized and just enough options. I also add the Reset PIN code feature.
I rewrite for personal usage, so the business logic is very limited. If you find this useful, you can suggest improvements. PRs are welcome.

The options look intimidating but don't worry. Almost all of them are optional.

NOTE: The component doesn't block the app for you. It just renders the Enter PIN screen, and you should style the component to cover the whole screen with absolute position, for instance. The best way is to place the PinCode component in your App component and use the state management tool to switch the visibility. Check the example below.


## Basic usage

```JSX
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';
const Screen = () => {
  return <View>
    <PinCode mode={PinCodeT.Modes.Enter} visible={true} 
      styles={{ 
        main: { position: 'absolute', left: 0, right; 0, top: 0, bottom: 0, zIndex: 99 }
      }} 
    />
  </View>
}
```


## Full options usage
```JSX
//...
import { PinCode, PinCodeT, hasSetPIN, clearPIN } from '@anhnch/react-native-pincode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const customTexts = {
    enter: {
        title: 'Custom enter PIN title',
        subTitle: 'custom enter PIN sub title',
        error: 'custom enter PIN error',
        backSpace: 'Del',
        footerText: 'Forgot PIN?'
    },
    set: {
        title: 'Custom set PIN title',
        subTitle: 'Custom set PIN sub title',
        repeat: 'Custom enter PIN again',
        error: 'Custom repeat PIN error',
        cancelText: 'Cancel',
    },
    locked: {
        title: 'Custom locked title',
        subTitle: `You have entered wrong PIN {{maxAttempt}} times. The app is locked in {{lockDuration}}.`,
        lockedText: 'Locked',
    },
    reset: {
        title: 'Custom reset PIN title',
        subTitle: `Custom reset PIN sub title`,
        confirm: 'Custom confirm message'
    }
};

const customStyles = { 
  main: { position: 'absolute', left: 0, right; 0, top: 0, bottom: 0, zIndex: 99 },
  enter: {
    titleContainer: { borderWidth: 1 },
    title: { color: 'yellow' },
    subTitle: { color: 'red' },
    buttonContainer: { borderWidth: 1 },
    buttonText: { color: 'blue' },
    buttons: { backgroundColor: 'green' },
    footer: { borderWidth: 1 },
    footerText: { color: 'purple' },
    pinContainer: { borderWidth: 1 }
  },
  locked: {
    titleContainer: { borderWidth: 1 },
    title: { color: 'yellow' },
    subTitle: { color: 'red' },
    clockContainer: { borderWidth: 1 },
    clockText: { color: 'red' },
    locked: { color: 'yellow' }
  },
  reset: {
    titleContainer: { borderWidth: 1 },
    title: { color: 'yellow' },
    subTitle: { color: 'red' },
    buttons: { backgroundColor: 'green' }
  }
}

const App = () => {
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<PinCodeT.Modes>(PinCodeT.Modes.Enter);

  useEffect(() => {
    hasSetPIN().then(hasPin => setVisible(hasPin));
  }, [])

  return <View>
    <Button onPress={() => setMode(PinCodeT.Modes.Set)} title="Set new PIN" />
    <Button onPress={() => setMode(PinCodeT.Modes.Enter)} title="Enter PIN" />
    <Button onPress={() => clearPIN().then(() => 
        console.log('PIN is cleared')
      )} title="Remove PIN" />
    
    <PinCode mode={mode} visible={visible} 
      onSetCancel={() => setVisible(false)}
      onSetSuccess={(newPin: string) => console.log('A new PIN has been set: ' + newPin)}
      onEnterSuccess={(pin: string) => console.log('User has entered PIN: ' + pin)}
      onResetSuccess={() => console.log('Do clean up app data when PIN is reset')}
      onModeChanged={(lastMode: PinCodeT.Modes, newMode: PinCodeT.Modes) => {
        console.log(`Mode has been changed, from ${lastMode} to ${newMode}`)
      }}
      options={{
        pinLength: 6,
        maxAttempt: 4,
        lockDuration: 10000,
        allowedReset: true,
        disableLock: false,
        backSpace: <Icon name='backspace' size={40} color='white' />,
        lockIcon: <Icon name='lock' size={24} color='white' />
      }}
      textOptions={customTexts}
      styles={customStyles} />
  </View>
}
```


## Properties
| Name           | Description                                                                                                                                                                                                              | Required | Default |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------- |
| visible        | Show or not show the component                                                                                                                                                                                           | true     | false   |
| mode           | The component has 4 modes:<ul><li>enter: user has to enter the PIN to access</li><li>set: set up new PIN</li><li>locked: lock the user from accessing and count down.</li><li>reset: allow user to remove PIN.</li></ul> | true     | enter   |
| onEnterSuccess | callback when the mode is 'enter' and the user has entered PIN successfully.<br/>Parameters:<ul><li>pin (string, optional): the entered PIN</li></ul>                                                                    | false    |         |
| onSetSuccess   | callback when the mode is 'set' and the user has set a new PIN successfully.<br/>Parameters:<ul><li>pin (string, optional): the set PIN</li></ul>                                                                        | false    |         |
| onSetCancel    | callback when the mode is 'set' and the user has canceled the setting.                                                                                                                                                   | false    |         |
| onResetSuccess | callback when the mode is 'reset' and the PIN is cleared successfully.                                                                                                                                                   | false    |         |
| onModeChanged  | callback when the mode is changed by the component. ```<PinCode onModeChange={(lastMode: PinCodeT.Modes, newMode: PinCodeT.Modes) => console.log(lastMode, newMode)}/>```                                                | false    |         |
| checkPin       | A custom function to check PIN, in case you want to use a different way to store and check the pin. Check the example below                                                                                              | false    |         |
| options        | Specify how the component works. Check the options below                                                                                                                                                                 | false    |         |
| textOptions    | Allow customizing the texts in the component. Check the options below                                                                                                                                                    | false    |         |
| styles         | Allow customizing the layout of the screens. Check the style options below                                                                                                                                               | false    |         |


## Options
| Name         | Description                                                                                                                                                                                                                                        | Required | Default |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| pinLength    | Number of digits                                                                                                                                                                                                                                   | false    | 4       |
| disableLock  | By default, the locked screen is shown when maxAttempt has reached. Set this to true to disable the locked mode                                                                                                                                    | false    | false   |
| maxAttempt   | The number of attempts when entering PIN. When user enters wrong PIN for a number of times, the Locked screen is shown                                                                                                                             | false    | 10      |
| lockDuration | The time that the Locked screen is shown in miliseconds                                                                                                                                                                                            | false    | 60000   |
| allowReset   | If allowReset is set to true, the "Forgot PIN?" button is displayed at the bottom of the Enter screen                                                                                                                                              | false    | true    |
| backSpace    | On Enter/Set screen the "Delete" button is used to delete the entered digit. But you can pass an ```<Icon name='backspace' size={24} />``` to display an icon instead. This is to remove the react-native-vector-icon dependency from the package. | false    |         |
| lockedIcon   | On Locked screen the "Locked" text is shown above the clock. But you can pass an ```<Icon name='lock' size={24} />``` to display an icon instead. This is to remove the react-native-vector-icon dependency from the package.                      | false    |         |


## Text Options
The text options are grouped by screen for the ease to find. You can pass the textOptions in this syntax
```JSX
<Pincode mode='enter' 
  textOptions={{
    enter: {
      title: 'custom enter title',
      subTitle: 'custom sub title',
      error: 'wrong PIN',
      backSpace: 'del',
      footerText: 'Forgot PIN?'
    },
    set: {
      title: 'custom set title',
      subTitle: 'custom sub title',
      repeat: 'Enter PIN again',
      error: `repeated PIN doesn't match`,
      cancelText: 'Cancel'
    },
    locked: {
      title: 'custom locked title',
      subTitle: 'custom locked sub title',
      lockedText: 'locked'
    },
    reset: {
      title: 'custom reset title',
      subTitle: 'custom reset sub title',
      resetButton: 'Remove PIN',
      confirm: 'custom confirm text',
      confirmButton: 'Remove',
      backButton: 'Go Back'
    }
  }}
/>
```
#### Enter screen text options
| Name       | Description                             | Required | Default                      | Type   |
| ---------- | --------------------------------------- | -------- | ---------------------------- | ------ |
| title      | the Enter screen title                  | false    | Enter PIN                    | string |
| subTitle   | the Enter screen sub title              | false    | Enter 4-digit PIN to access. | string |
| error      | error message when user enter wrong PIN | false    | Wrong PIN! Try again.        | string |
| backSpace  | the text of the backspace button        | false    | Delete                       | string |
| footerText | the text of the footer button           | false    | Forgot PIN?                  | string |

#### Set screen text options
| Name     | Description                                       | Required | Default                                   | Type   |
| -------- | ------------------------------------------------- | -------- | ----------------------------------------- | ------ |
| title    | the Set screen title                              | false    | Set up a new PIN                          | string |
| subTitle | the Set screen sub title                          | false    | Enter 4 digits.                           | string |
| repeat   | the text to ask to enter new PIN again            | false    | Enter new PIN again.                      | string |
| error    | the error message when repeated PIN doesn't match | false    | PIN don't match. Start the process again. | string |
| cancel   | the cancel button                                 | false    | Cancel                                    | string |

#### Locked screen text options
| Name       | Description                                                                      | Required | Default                                                                    | Type   |
| ---------- | -------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- | ------ |
| title      | the Locked screen title                                                          | false    | Locked                                                                     | string |
| subTitle   | the Locked screen sub title                                                      | false    | Your have entered wrong PIN many times.<br/>The app is temporarily locked. | string |
| lockedText | the locked text (this can be replaced with icon) by using the lockedIcon options | false    | Locked                                                                     | string |

#### Reset screen text options
| Name          | Description                                                                                                                                                                | Required | Default                                                | Type   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------ | ------ |
| title         | The Reset screen title                                                                                                                                                     | false    | Forgot PIN?                                            | string |
| subTitle      | The Reset screen sub title. You can use the {{maxAttempt}} and {{lockDuration}} placeholders to display the maxAttempt and lockDuration (in minutes) in the sub title. | false    | Remove the PIN may wipe out the app data and settings. | string |
| resetButton   | The reset button text                                                                                                                                                      | false    | Reset                                                  | string |
| confirm       | Ask user to confirm removeing PIN                                                                                                                                          | false    | Are you sure you want remove the PIN?                  | string |
| confirmButton | The confirm button text                                                                                                                                                    | false    | Confirm                                                | string |
| backButton    | The back button text                                                                                                                                                       | false    | Back                                                   | string |


## Styles options
The style is organized like textOptions for the ease of finding. Note that 

#### Enter screen styles
| Name            | Description                                | Required | Default |
| --------------- | ------------------------------------------ | -------- | ------- |
| titleContainer  | the Enter screen title container ViewStyle | false    |         |
| title           | TextStyle of the title                     | false    |         |
| subTitle        | TextStyle of the sub title                 | false    |         |
| pinContainer    | ViewStyle which wraps the PIN dots         | false    |         |
| buttonContainer | ViewStyle which wraps digit buttons        | false    |         |
| buttons         | ViewStyle which wraps digit buttons        | false    |         |
| buttonText      | TextStyle of each button                   | false    |         |
| footer          | ViewStyle the footer                       | false    |         |
| footerText      | TextStyle the footer                       | false    |         |

#### Locked screen styles
| Name           | Description                                                                            | Required | Type      |
| -------------- | -------------------------------------------------------------------------------------- | -------- | --------- |
| titleContainer | the Enter screen title container ViewStyle                                             | false    | ViewStyle |
| title          | Style of the title                                                                     | false    | TextStyle |
| subTitle       | Style of the sub title                                                                 | false    | TextStyle |
| clockContainer | Style of the clock component                                                           | false    | ViewStyle |
| clockText      | Style of the count down text                                                           | false    | TextStyle |
| locked         | Style of the locked Text. If you use custom icon for this, you can set the icon style. | false    | TextStyle |

#### Reset screen styles
| Name           | Description                                                              | Required | Type      |
| -------------- | ------------------------------------------------------------------------ | -------- | --------- |
| titleContainer | Style of title container                                                 | false    | ViewStyle |
| title          | Style of the title                                                       | false    | TextStyle |
| subTitle       | Style of the sub title                                                   | false    | TextStyle |
| buttons        | Style of the buttons in Reset screen, including Reset and Confirm butons | false    | TextStyle |


## Utilities
| Name      | Description                 | Return           |
| --------- | --------------------------- | ---------------- |
| hasSetPIN | check if user has set a PIN | Promise<boolean> |
| clearPIN  | clear the PIN               | Promise<void>    |


## Storage

To make it simple and least dependencies, I use the AsyncStorage to save pin. But you can use the callbacks to implement your own way.

```JSX
...
  <PinCode mode={mode} visible={visible} 
    onSetSuccess={(newPin: string) => {
        Keychain.setGenericPassword('pin', newPin);
    })}
    onResetSuccess={() => {
        Keychain.resetGenericPassword();
    }}
    checkPin={async (pin: string) => {
        const credential = await getGenericPassword();
        return (credential && credential.password===pin);
    }}
  />
...
```


## Example

Here is an example how to use Recoil to manage pinState to toggle PinCode visibility and mode. I also use react-native-keychain to store pin.

```JSX
import React, { useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import { View, StyleSheet, AppState, AppStateStatus, Text, Button } from 'react-native';
import { RecoilRoot, useRecoilState, atom } from 'recoil';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PinCode, PinCodeT, clearPIN, hasSetPIN } from '@anhnch/react-native-pincode';

const MainStack = createStackNavigator();

const PinState = atom({
    key: 'common.pinState',
    default: {
        mode: PinCodeT.Modes.Enter,
        show: false,
        hasPin: false
    }
})

const HomeScreen = () => {
    const [pinState, setPinState] = useRecoilState(PinState);

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, marginBottom: 30, fontWeight: 'bold' }}>React Native Pin Code</Text>
        {pinState.hasPin && <Button title='Show PinCode Enter'
            onPress={() => setPinState({ ...pinState, mode: PinCodeT.Modes.Enter, show: true })} />}
        <Button title='Set a new PIN'
            onPress={() => setPinState({ ...pinState, mode: PinCodeT.Modes.Set, show: true })} />
        {pinState.hasPin && <Button title='Remove PIN' onPress={() => {
            clearPIN();
            setPinState({ ...pinState, hasPin: false });
        }} />}
    </View>
}

const App = () => {
    const [pinState, setPinState] = useRecoilState(PinState);

    /** Show the Pin Enter screen on app load if user has set a PIN */
    useEffect(() => {
        Keychain.getGenericPassword().then(credential => {
            setPinState({ ...pinState, hasPin: credential ? true : false, show: credential ? true : false });
        });
    }, [])

    useEffect(() => {
        AppState.addEventListener("change", appStateChanged);
        return () => AppState.removeEventListener("change", appStateChanged);
    })

    /** You may want to protect the content when the app goes to inactivity or background */
    function appStateChanged(nextAppState: AppStateStatus) {
        if ((nextAppState == 'inactive' || nextAppState == 'background')
            && pinState.hasPin
            && pinState.mode != PinCodeT.Modes.Locked) {
            setPinState({ ...pinState, show: true, mode: PinCodeT.Modes.Enter });
        }
    }

    return <>
        <NavigationContainer fallback={<Text>Loading</Text>}>
            <MainStack.Navigator initialRouteName="Home">
                <MainStack.Screen name="Home" component={HomeScreen} />
            </MainStack.Navigator>
        </NavigationContainer>

        <PinCode mode={pinState.mode} visible={pinState.show}
            onSetCancel={() => setPinState({ ...pinState, show: false })}
            onSetSuccess={async (pin: string) => {
                await Keychain.setGenericPassword('pin', pin);
                setPinState({ show: false, mode: PinCodeT.Modes.Enter, hasPin: true });
            }}
            onEnterSuccess={() => setPinState({ ...pinState, mode: PinCodeT.Modes.Enter, show: false })}
            onResetSuccess={async () => {
                /** @todo implement your business logic before removing pin */
                // ...
                await Keychain.resetGenericPassword();
                setPinState({ mode: PinCodeT.Modes.Enter, show: false, hasPin: false });
            }}
            checkPin={async (pin: string) => {
                const credential = await Keychain.getGenericPassword();
                return (credential && credential.password == pin);
            }}
            styles={{ main: styles.pincode }} />
    </>;
}

const styles = StyleSheet.create({
    pincode: { position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, zIndex: 99, backgroundColor: '#006FB3' }
})

export default () => <RecoilRoot><App /></RecoilRoot>;
```
