import { configureStore } from '@reduxjs/toolkit'
import devicesReducer, { setDevices, loadDevicesFromAsyncStorage } from './devicesSlice'
import networksReducer, { setNetworks, loadNetworksFromAsyncStorage } from './networksSlice'
import { setTheme, settingsReducer, setUseDevice, setSettings, loadSettingsFromAsyncStorage,removeSettingsFromAsyncStorage } from './settingsSlice'

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    networks: networksReducer,
    settings: settingsReducer,
  },
})

const initializeStore = async () => {
  console.log('initialising store...')
  const storedDevicesValue = await loadDevicesFromAsyncStorage();
  console.log('stored devices: ',storedDevicesValue)
  store.dispatch(setDevices(storedDevicesValue));

  const storedNetworksValue = await loadNetworksFromAsyncStorage();
  console.log('stored networks: ',storedNetworksValue)
  store.dispatch(setNetworks(storedNetworksValue));

  // await removeSettingsFromAsyncStorage()
  
  const storedSettingsValue = await loadSettingsFromAsyncStorage();
  console.log('stored settings: ',storedSettingsValue)
  store.dispatch(setSettings(storedSettingsValue));
}

initializeStore();

export {setTheme, setUseDevice};

export default store;
