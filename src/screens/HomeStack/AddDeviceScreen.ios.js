import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import DevicesList from '../../components/DevicesList'
import WifiManager from "react-native-wifi-reborn";
import { PermissionsAndroid } from 'react-native';
import Zeroconf from 'react-native-zeroconf'
import store from '../../store'
import { addDevice } from '../../store/devicesSlice'
import { RegularButton, IconButton, ScrollView, Text, Colors, Divider, ListButton } from '../../components/ui'
import { RefreshIcon } from '../../icons'
import { useThemeColors } from '../../components/ui/colors';

const ACCESS_POINT_PASSWORD = 'moonphase'
const SWITCH_FROM_AP_TIMEOUT = 7500
const MDNS_SERVICE_TYPE = 'moonlamp-sta'

export default AddDeviceScreen = ({ route }) => {

  const navigation = useNavigation();
  const networks = useSelector((state) => {
    return state.networks
  })
  const { wifiName } = route.params;

  const [services, setServices] = useState({})
  const [isScanning, setIsScanning] = useState(false)

  const zeroconf = new Zeroconf()
  const theme = useThemeColors()


  useEffect(() => {
    // const attemptConnection = async () => {
    //   const availableWifis = await WifiManager.reScanAndLoadWifiList()
    //   console.log(availableWifis)
    //   const moonAccessPoint = availableWifis.find((elem) => elem["SSID"]?.includes('MoonAP'))
    //   console.log(moonAccessPoint)
    //   if (moonAccessPoint) {
    //     //attempt connect
    //     try {
    //       await WifiManager.connectToProtectedSSID(moonAccessPoint["SSID"], ACCESS_POINT_PASSWORD, false, false)

    //       let formData = new FormData();
    //       formData.append('ssid', wifiName);
    //       formData.append('password', networks[wifiName]?.password);
    //       console.log('formData',formData)

    //       const resp = await fetch(`http://${moonAccessPoint["SSID"]}.local/save`,
    //         {
    //           body: formData,
    //           method: "post"
    //         });
    //       console.log('connected to moon lamp', resp)
    //     } catch (e) {
    //       console.warn('couldnt connect to moon lamp', e)
    //     }

    //   }
    // }

    // attemptConnection()

    zeroconf.on('start', () => {
      setIsScanning(true)
      console.log('[Start]')
    })

    zeroconf.on('stop', () => {
      setIsScanning(false)
      console.log('[Stop]')
    })

    zeroconf.on('resolved', service => {
      console.log('[Resolve]', JSON.stringify(service, null, 2))

      setServices({ ...services, [service.name]: service })


    })

    zeroconf.on('error', err => {
      setIsScanning(false)
      console.log('[Error]', err)
    })

    refreshData()

    return () => zeroconf.removeDeviceListeners()
  }, [services])

  const refreshData = async () => {
    console.log('refreshing')
    if (isScanning) {
      return
    }


    zeroconf.scan(MDNS_SERVICE_TYPE, 'tcp', 'local.')

    await new Promise(resolve => setTimeout(resolve, SWITCH_FROM_AP_TIMEOUT));
    zeroconf.stop()


  }

  const checkAPIsClosed = async () => {
    // check AP is closed
    await new Promise(resolve => setTimeout(resolve, SWITCH_FROM_AP_TIMEOUT));



  }


  const attemptAPConnection = async () => {
    await WifiManager.connectToProtectedSSIDPrefixOnce('MoonAP_',ACCESS_POINT_PASSWORD,false,true)
    
    const currentSSID = await WifiManager.getCurrentWifiSSID()
    if (currentSSID.includes('MoonAP_')) {

      let formData = new FormData();
      formData.append('ssid', wifiName);
      formData.append('password', networks[wifiName]?.password);
      console.log('formData', formData)

      try {
        const resp = await fetch(`http://${currentSSID}.local/save`,
          {
            body: formData,
            method: "post"
          });
    
      } catch (e) {
        console.warn(e)
      }
      
      await refreshData()
    }
  }
  
  const addNewDevice = (deviceName) => {
    store.dispatch(addDevice({ deviceId: deviceName, wifiNetwork: wifiName, ...services[deviceName] }))

    navigation.navigate('HomeScreen')
  }

  return (
    <ScrollView style={{backgroundColor: theme.mainBackground}}>
        <View style={styles.container}>
  
  
          <View style={styles.innerTopContainer}>
            <View>
              <RegularButton Icon={!isScanning && RefreshIcon} disabled={isScanning} onPress={refreshData} text={isScanning ? 'Please wait...' : 'Scan again'} />
            </View>
  
            {isScanning
              ?
  
              <View style={styles.scannerContainer}>
                <ActivityIndicator style={styles.spinner} size="large" color={Colors.blue.neutral} />
                <Text style={{ ...styles.spinnerText, color: theme.text }}>{'Scanning for existing devices on the network'}</Text>
              </View>
  
              :
              <View style={styles.servicesContainer}>
                {Object.keys(services)?.length > 0
  
                  ?
  
                  <View style={styles.elementContainer}>
                    <Text style={{...styles.spinnerText, color: theme.text}}>{'Existing devices found on your network:'}</Text>
                    {Object.keys(services).map((key) => {
                      return <ListButton key={key} isIconIncluded={false} text={key} onPress={() => addNewDevice(key)} />
                    })}
                  </View>
  
                  :
                  <View style={styles.scannerContainer}>
                    <Text style={{...styles.spinnerText, color: theme.text}}>{'No existing devices on the network found'}</Text>
                  </View>
                }
  
  
              </View>
            }
  
  
          </View>
  
          <Divider />
  
          {!isScanning && <View style={styles.elementContainer}>
            <Text style={{...styles.spinnerText, color: theme.text}}>Onboard a new device:</Text>
            <View style={styles.elementContainer}>
              <ListButton text={'Moon Phase Lamp'} onPress={attemptAPConnection} />
            </View>
          </View>}
  
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    // backgroundColor: 'green',
  },
  innerTopContainer: {
    flex: 1,
    gap: 10,
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '3%',
    minHeight: 10,
  },
  elementContainer: {
    flex: 1,
    // backgroundColor: 'red',
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '3%',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    width: '80%'
  },
  spinner: {
    margin: 10,
  },
  spinnerText: {
    fontWeight: 500,
    fontSize: 15,
    margin: 5,
  },
  servicesContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    gap: 10,
  }
});