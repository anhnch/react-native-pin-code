# React Native Pincode

This component is inspired by https://github.com/jarden-digital/react-native-pincode. The layout looks similar but I rewrite in typescript, simpler, more organized and just enough options. I also add the Reset PIN code feature.
I rewrite for personal usage, so the business logic is very limited. If you find this useful, you can suggest improvements. 

The options look intimidating but don't worry. Almost all of them are optional.

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
        subTitle: `You have entered wrong PIN {{maxAttempt}} times. The app is locked in {{lockedDuration}}.`,
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
    <Button onPress={() => clearPIN().then(() => console.log('PIN is cleared'))} title="Remove PIN" />
    
    <PinCode mode={mode} visible={visible} 
      onSetCancel={() => setVisible(false)}
      onSetSuccess={(newPin: string) => console.log('A new PIN has been set: ' + newPin)}
      onEnterSuccess={(pin: string) => console.log('User has entered PIN: ' + pin)}
      onResetSuccess={() => console.log('Do clean up app data when PIN is reset')}
      onModeChanged={(lastMode: PinCodeT.Modes, newMode: PinCodeT.Modes) => console.log(`Mode has been changed, from ${lastMode} to ${newMode}`)}
      options={{
        pinLength: 6,
        maxAttempt: 4,
        lockedDuration: 10000,
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
      error: 'repeated PIN doesn't match',
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
| subTitle      | The Reset screen sub title. You can use the {{maxAttempt}} and {{lockedDuration}} placeholders to display the maxAttempt and lockedDuration (in minutes) in the sub title. | false    | Remove the PIN may wipe out the app data and settings. | string |
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
import * as Keychain from 'react-native-keychain';

const App = () => {
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<PinCodeT.Modes>(PinCodeT.Modes.Enter);

  useEffect(() => {
    getGenericPassword().then(({password}) => {
        setVisible(password ? true : false);
    })
  }, [])

  return <View>
    <Button onPress={() => setMode(PinCodeT.Modes.Set)} title="Set new PIN" />
    <Button onPress={() => setMode(PinCodeT.Modes.Enter)} title="Enter PIN" />
    <Button onPress={() => clearPIN().then(() => console.log('PIN is cleared'))} title="Remove PIN" />
    
    <PinCode mode={mode} visible={visible} 
      onSetCancel={() => setVisible(false)}
      onEnterSuccess={(pin: string) => setVisible(false)}
      onSetSuccess={(newPin: string) => {
          ...
          // store the pin in db or keychain
          Keychain.setGenericPassword();
          ...
      })}
      onResetSuccess={() => {
          ...
          // remove the pin from your db or keychain
          Keychain.resetGenericPassword();
          ...
      }}
      checkPin={async (pin: string) => {
          ...
          // check pin 
          const { password } = await getGenericPassword();
          return (password===pin);
      }}
    />
  </View>
}
```
