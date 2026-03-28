import { View, Button, SafeAreaView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux'

import DevicesList from '../../components/DevicesList'
import { MoonIcon, EmptyBoxIcon } from '../../icons'
import { RegularButton, Colors, ScrollView, Text } from '../../components/ui'
import store from '../../store'
import { removeAllDevices } from '../../store/devicesSlice'
import { useThemeColors } from '../../components/ui/colors';

export default HomeScreen = () => {

  const navigation = useNavigation();

  const devices = useSelector((state) => {
    return state.devices
  })

  console.log('devices', devices)

  const initiateOnboard = () => {
    navigation.navigate('Add_Wifi_Network')
  }

  clearAllDevices = () => {
    store.dispatch(removeAllDevices())
  }
  
  const theme = useThemeColors();

  return (
    <ScrollView style={[{ backgroundColor: theme.mainBackground }]}>

      <SafeAreaView style={Object.keys(devices).length > 0 ? styles.homeScreenContainerPulled : styles.homeScreenContainerCentered}>

        {
          Object.keys(devices).length > 0
            ?
            <View style={styles.devicesContainer}>
              <View style={styles.devicesHeader}>
                <Text style={{...styles.devicesHeaderText, color: theme.text}}>{'Saved devices'}</Text>
                {/* <TouchableOpacity onPress={()=>clearAllDevices()}> */}
                {/* <Text style={{...styles.devicesHeaderText, color: theme.text}}>{'...'}</Text> */}
                {/* </TouchableOpacity> */}

              </View>
              <DevicesList initiateOnboard={initiateOnboard} />
            </View>


            : <NoDevicesBanner initiateOnboard={initiateOnboard} />
        }

      </SafeAreaView>
    </ScrollView>

  );
}

const NoDevicesBanner = ({ initiateOnboard = () => { } }) => {

  const theme = useThemeColors();

  return (
    <SafeAreaView style={styles.noDevicesBannerContainer}>
      <EmptyBoxIcon style={styles.bannerIcon} />
      <Text style={{...styles.bannerText, color: theme.text}}>
        {'No devices available'}</Text>
      <RegularButton
        onPress={initiateOnboard}
        text='Add device'
        style={styles.addDeviceButton}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  homeScreenContainerCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '7.5%',
  },
  homeScreenContainerPulled: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
  },
  devicesContainer: {
    marginVertical: '4%',
    width: '100%',
  },
  devicesHeader: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    margin: '5%',
    marginTop: '0%',
  },
  devicesHeaderText: {
    fontWeight: 500,
    fontSize: 15,
  },
  noDevicesBannerContainer: {
    backgroundColor: 'transparent',
    height: '60%',
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIcon: {
    height: '70%',
    width: '70%',
    shadowColor: Colors.black.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 10,
  },
  bannerText: {
    fontWeight: '500',
    fontSize: 17,
    bottom: '5%',
  },
  addDeviceButton: {
    marginTop: '1%'
  },
});