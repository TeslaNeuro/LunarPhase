import React from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

import { ListButton, RegularButton } from './ui'

const DevicesList = ({initiateOnboard}) => {

  const navigation = useNavigation();

  const devices = useSelector((state) => {
    return state.devices
  })

  const openDeviceControl = (deviceName) => {
    navigation.navigate('Device_Control', { currentDeviceName: deviceName })
  }

  return (
    <View style={styles.container}>
      {
        Object.keys(devices).map((key)=>{
          return <ListButton key={key} text={key} onPress={()=>openDeviceControl(key)} />          
        })
      }
      {initiateOnboard && <RegularButton
        onPress={initiateOnboard}
        text='Add device'
        style={styles.addDeviceButton}
      />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    gap: 10
  },
  addDeviceButton: {
    marginTop: '1%'
  },
})

export default DevicesList