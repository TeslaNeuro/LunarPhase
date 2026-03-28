import { View, Button, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useThemeColors } from '../../components/ui/colors';

import DevicesList from '../../components/DevicesList'
import { PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";
import store from '../../store'
import { addNetwork } from '../../store/networksSlice'
import { RegularButton, TextBox, ScrollView, Text, Colors } from '../../components/ui'
import { AddWifiNetworkBanner } from '../../icons'


export default AddWifiNetworkScreen = () => {

  const navigation = useNavigation();
  const networks = useSelector((state) => {
    return state.networks
  })

  const [wifiName, setWifiName] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [lockWifiName, setLockWifiName] = useState(false)

  useEffect(() => {
    scanCurrentWifi()
  }, [])

  const scanCurrentWifi = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for to connect to a device',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi enabled devices.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    console.log(granted)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // You can now use react-native-wifi-reborn
      //check if user is connected to the network and if that network ssid exists
      //TODO: check if we get error
      const connected_network = await WifiManager.getCurrentWifiSSID()


      if (Object.keys(networks).includes(connected_network)) {
        setLockWifiName(true)
        setWifiName(connected_network)
        setWifiPassword(networks[connected_network]?.password)
      } else {
        setLockWifiName(true)
        setWifiName(connected_network)
      }
    } else {
      // Permission denied

    }

  }

  const addWifiNetwork = () => {

    store.dispatch(addNetwork({ ssid: wifiName, password: wifiPassword }))
    navigation.navigate('Add_device', { wifiName })
  }

  const theme = useThemeColors();

  return (
    <ScrollView style={{backgroundColor: theme.mainBackground}}>
      <View style={styles.container}>
        
        <View style={styles.elementContainer}>
          <Text style={{...styles.topText, color: useThemeColors().text}}>Select your Wifi Network and enter password:</Text>
        </View>

        <View style={styles.elementContainer}>
          <AddWifiNetworkBanner {...styles.banner} />
        </View>
        
        <View style={styles.elementContainer}>
          <TextBox
            disabled={lockWifiName}
            onChangeText={setWifiName}
            value={wifiName}
            label="WiFi name:"
            labelColor= {theme.text}
          />

          <TextBox
            onChangeText={setWifiPassword}
            value={wifiPassword}
            secureTextEntry
            label="Password:"
            labelColor= {theme.text}
          />

          <RegularButton style={styles.button} text="Add network" onPress={addWifiNetwork} />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
  },
  elementContainer: {
    flex: 1,
    backgroundColor: 'transparent', 
    //height: '20%', 
    width: '100%', 
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    margin: '3%',
  },
  button: {
    margin: '4%'
  },
  topText: {
    fontWeight: 400,
  },
  banner: {
    height: 160,
    //margin: '7%',
    shadowColor: Colors.black.dark,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
});
