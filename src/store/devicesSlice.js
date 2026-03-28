import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const devicesSlice = createSlice({
  name: 'devices',
  initialState: {},
  reducers: {
    setDevices: (state, action) => {
      const newState = {...state, ...action.payload}
      saveToAsyncStorage(newState)
      return newState
    },
    addDevice: (state, action) => {
      const newState = {...state, [action.payload.deviceId]: action.payload }
      saveToAsyncStorage(newState)
      return newState
    },
    removeAllDevices: (state, action) => {
      saveToAsyncStorage({})
      return {}
    },
  }

})

const { actions, reducer } = devicesSlice
export const { setDevices, addDevice, removeAllDevices } = actions
export default reducer

// Async Storage functions
const saveToAsyncStorage = async (value) => {
  try {
    await AsyncStorage.setItem('@devices', JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data to Async Storage:', error);
  }
};

const loadDevicesFromAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('@devices');
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to load data from Async Storage:', error);
    return 0;
  }
};

const removeFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem('@devices');
  } catch (error) {
    console.error('Failed to remove data from Async Storage:', error);
  }
};

export {saveToAsyncStorage, loadDevicesFromAsyncStorage, removeFromAsyncStorage}