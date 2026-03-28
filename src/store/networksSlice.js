import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const networksSlice = createSlice({
  name: 'networks',
  initialState: {},
  reducers: {
    setNetworks: (state, action) => {
      const newState = {...state, ...action.payload}
      saveNetworksToAsyncStorage(newState)
      return newState
    },
    addNetwork: (state, action) => {
      const newState = {...state, [action.payload.ssid]: action.payload }
      saveNetworksToAsyncStorage(newState)
      return newState
    }
  }

})

const { actions, reducer } = networksSlice
export const { setNetworks, addNetwork } = actions
export default reducer

// Async Storage functions
const saveNetworksToAsyncStorage = async (value) => {
  try {
    await AsyncStorage.setItem('@networks', JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data to Async Storage:', error);
  }
};

const loadNetworksFromAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('@networks');
    return JSON.parse(value)
  } catch (error) {
    console.error('Failed to load data from Async Storage:', error);
    return 0;
  }
};

const removeFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem('@networks');
  } catch (error) {
    console.error('Failed to remove data from Async Storage:', error);
  }
};

export {saveNetworksToAsyncStorage, loadNetworksFromAsyncStorage, removeFromAsyncStorage}