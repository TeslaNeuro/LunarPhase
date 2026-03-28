import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    themeMode: 'dark',
    useDevice: true,
};


const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        setTheme: (state,action) => {
            const newState = {...state, themeMode: action.payload}
            saveSettingsToAsyncStorage(newState)
            return newState
        },
        setUseDevice: (state,action) => {
            const newState = {...state, useDevice: action.payload}
            saveSettingsToAsyncStorage(newState)
            return newState
        },
        setSettings: (state, action) => {
            const newState = {...state, ...action.payload}
            saveSettingsToAsyncStorage(newState)
            return newState
        },
    },
});

export const {setTheme, setUseDevice, setSettings} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

// Async Storage functions
const saveSettingsToAsyncStorage = async (value) => {
try {
    console.log("settings save payload",value)
    await AsyncStorage.setItem('@settings', JSON.stringify(value));
} catch (error) {
    console.error('Failed to save data to Async Storage:', error);
}
};

const loadSettingsFromAsyncStorage = async () => {
try {
    const value = await AsyncStorage.getItem('@settings');
    return JSON.parse(value)
} catch (error) {
    console.error('Failed to load data from Async Storage:', error);
    return 0;
}
};

const removeSettingsFromAsyncStorage = async () => {
try {
    await AsyncStorage.removeItem('@settings');
} catch (error) {
    console.error('Failed to remove data from Async Storage:', error);
}
};

export {saveSettingsToAsyncStorage, loadSettingsFromAsyncStorage, removeSettingsFromAsyncStorage}