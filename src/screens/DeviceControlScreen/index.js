import {DeviceControlProvider} from "../../contexts/DeviceControlContext";
import MainScreen from "./MainScreen";
import { useState, useEffect, useLayoutEffect } from 'react';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {ColorPickerComponent} from "./ColourControl"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const DeviceStack = createNativeStackNavigator()

export default DeviceControlScreen = ({route}) => {
  const navigation = useNavigation();
  
  const { currentDeviceName } = route.params;
  

  return (
    <DeviceControlProvider currentDeviceName={currentDeviceName}>
      <MainScreen currentDeviceName={currentDeviceName} />
    </DeviceControlProvider>
  )

}