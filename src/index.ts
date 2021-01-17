import AsyncStorage from "@react-native-community/async-storage";
import PinCode from "./PinCode";
import { PinCodeT } from "./types";

async function hasSetPIN(): Promise<boolean> {
    const pin = await AsyncStorage.getItem('@pin');
    if (pin && pin.length == 4) {
        return true;
    }
    return false;
}

async function clearPIN() {
    await AsyncStorage.removeItem('@pin');
}

export { PinCode, PinCodeT, hasSetPIN, clearPIN };