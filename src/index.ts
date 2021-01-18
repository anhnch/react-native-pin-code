import AsyncStorage from "@react-native-community/async-storage";
import PinCode from "./PinCode";
import { PinCodeT, PIN_KEY } from "./types";

async function hasSetPIN(): Promise<boolean> {
    const pin = await AsyncStorage.getItem(PIN_KEY);
    return (pin ? true : false)
}

async function clearPIN() {
    await AsyncStorage.removeItem(PIN_KEY);
}

export { PinCode, PinCodeT, hasSetPIN, clearPIN };