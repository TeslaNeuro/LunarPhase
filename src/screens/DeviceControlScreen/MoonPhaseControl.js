import { View, StyleSheet, useColorScheme, ActivityIndicator, Animated } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux'
import { RegularButton, Colors, ScrollView, Text } from '../../components/ui'
import Slider from '@react-native-community/slider';
import ColorPicker, { Panel2, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import DatePicker from 'react-native-date-picker'
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DeviceControl from "../../contexts/DeviceControlContext";
import { ChevronDown } from '../../icons';

const timezones = [
  { key: 1, label: "Hawaii-Aleutian Time GMT-10", value: -36000 },
  { key: 2, label: "Alaska Time GMT-9", value: -32400 },
  { key: 3, label: "Pacific Time GMT-8", value: -28800 },
  { key: 4, label: "Mountain Time GMT-7", value: -25200 },
  { key: 5, label: "Central Time GMT-6", value: -21600 },
  { key: 6, label: "Eastern Time GMT-5", value: -18000 },
  { key: 7, label: "Atlantic Time GMT-4", value: -14400 },
  { key: 8, label: "Newfoundland Time GMT-3.5", value: -12600 },
  { key: 9, label: "Amazon Time GMT-3", value: -10800 },
  { key: 10, label: "Greenwich Mean Time GMT+0", value: 0 },
  { key: 11, label: "Central European Time GMT+1", value: 3600 },
  { key: 12, label: "Eastern European Time GMT+2", value: 7200 },
  { key: 13, label: "Moscow Time GMT+3", value: 10800 },
  { key: 14, label: "Arabian Standard Time GMT+4", value: 14400 },
  { key: 15, label: "India Time GMT+5.5", value: 19800 },
  { key: 16, label: "Indochina Time GMT+7", value: 25200 },
  { key: 17, label: "Singapore Time GMT+8", value: 28800 },
  { key: 18, label: "Japan Time GMT+9", value: 32400 },
  { key: 19, label: "Australian Eastern Time GMT+10", value: 36000 },
  { key: 20, label: "Solomon Islands Time GMT+11", value: 39600 }
];

const REFRESH_DELAY = 3000

export default MoonPhaseControl = ({ route, fetchDeviceState }) => {

  const { currentDate,
    setCurrentDate,
    currentColor,
    currentBrightness,
    setCurrentBrightness,
    currentUtcOffset,
    setCurrentUtcOffset,
    manualMode,
    setManualMode,
    postCommand
  } = useContext(DeviceControl);

  const [openDatePicker, setOpenDatePicker] = useState(false)

  const onSelectTimezone = (value) => {
    console.log(value)
    if (typeof value === 'number') {
      setCurrentUtcOffset(value)
      postCommand('utcOffset', [value])
      waitAndRefetchData()
    }

  }

  const waitAndRefetchData = () => {
    console.log('refetching device data')
    setTimeout(() => {
      fetchDeviceState()
    }, REFRESH_DELAY);
  }

  // TOADD: send timestamp only in timezone
  const encodePickerDate = (date) => (Math.floor(date.getTime() / 1000))
  const encodeDate = (date) => (Math.floor(date / 1000))

  return (
    <View style={styles.container}>
      
      <View style={styles.elementContainer}>
        <Text style={styles.titleText}> Date </Text>
        <Text style={{color: Colors.grey.light}}>{`Date on the device: ${currentDate?.toDateString()}`}</Text>
        <DatePicker
          modal
          mode={'date'}
          open={openDatePicker}
          date={currentDate}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const utcSeconds = now.getUTCSeconds();

            const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), utcHours, utcMinutes, utcSeconds);
            console.log('utcDate', utcDate)
            setCurrentDate(utcDate)

            console.log('timestamp', [encodePickerDate(utcDate)])
            postCommand('timestamp', [encodePickerDate(utcDate)])
            waitAndRefetchData()
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
        <RegularButton style={{padding: 4}} isTextCapital={false} backgroundColor={Colors.grey.neutral} textColor={Colors.white.dark} text="Select a custom date" onPress={() => setOpenDatePicker(true)} />
        <RegularButton style={{padding: 4}} isTextCapital={false} backgroundColor={Colors.grey.neutral} textColor={Colors.white.dark} text="Change to today" onPress={() => {
          const localTime = new Date().getTime();
          const utcTime = localTime - new Date().getTimezoneOffset() * 60000;
          postCommand('timestamp', [encodeDate(utcTime)])
          setCurrentDate(new Date())
          waitAndRefetchData()
        }} />
      </View>

      
      <View style={styles.elementContainer}>
        <Text style={styles.titleText}> Timezone </Text>
        <View style={Platform.OS === 'android' ? styles.timezonePickerContainer : styles.timezonePickerContainerIOS}>
          {(Platform.OS === 'android') ? <Picker
            selectedValue={currentUtcOffset}
            onValueChange={onSelectTimezone}
            style={styles.timezonePicker}
            dropdownIconColor={Colors.grey.light}

          >
            {timezones.map((item) => <Picker.Item color={Colors.grey.light} style={styles.timezonePickerItem} key={item.key} label={item.label} value={item.value} />)}
          </Picker>
            :
            <RNPickerSelect
              onValueChange={onSelectTimezone}
              style={{
                inputIOS: { // Styles for iOS
                 
                  color: Colors.grey.light, 

                },
                iconContainer: {
                  top: '10%',
                  width: '5%',
                  height: '80%',
                  alignItems: 'flex-end'
                },
              }}
              Icon={()=><ChevronDown height={'100%'} width={'100%'} color={Colors.grey.light} />}
              value={currentUtcOffset}
              items={timezones}
              
            />
          }
        </View>
      </View>

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
    // backgroundColor: 'green',
    width: '100%'
  },
  timezonePickerContainer: {
    width: '100%',

  },
  timezonePickerContainerIOS: {
    width: '80%',
    height: 60,
    // marginLeft: 10,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingBottom: 20,
    backgroundColor: 'transparent'
  },
  timezonePickerItem: {
    colour: 'red'
  },
  spinner: {

  },
  spinnerContainer: {
    flexShrink: 1,
    top: '35%',
    left: '35%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // backgroundColor: 'green',
  },
  spinnerText: {
    fontWeight: '500',
    marginLeft: 5
  },
  titleText: {
    fontWeight: 600,
    fontSize: 15,
    margin: 5,
    color: Colors.white.neutral,
  },
  elementContainer: {
    flex: 1,
    // backgroundColor: 'red',
    width: '80%',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '3%',
    gap: 12,
    backgroundColor: 'rgba(108, 115, 152, 0.5)',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20,
  },
  slider: {
    height: 40,
    width: '70%'
  },
  colorPicker: {
    width: '70%'
  },
})