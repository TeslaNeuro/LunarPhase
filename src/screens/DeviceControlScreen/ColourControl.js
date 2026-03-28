import { View, StyleSheet, useColorScheme, ActivityIndicator, Animated, Modal, TouchableOpacity, TouchableHighlight } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux'
import { RegularButton, Colors, ScrollView, Text, ListButton } from '../../components/ui'
import Slider from '@react-native-community/slider';
import ColorPicker, { Panel2, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import DatePicker from 'react-native-date-picker'
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DeviceControl from "../../contexts/DeviceControlContext";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExitIcon } from '../../icons';

const ColourStack = createNativeStackNavigator()



function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const ColorOverviewComponent = () => {
  const { currentDate,
    setCurrentDate,
    currentColor,
    setCurrentColor,
    currentBrightness,
    setCurrentBrightness,
    currentUtcOffset,
    setCurrentUtcOffset,
    manualMode,
    setManualMode,
    postCommand
  } = useContext(DeviceControl);

  const navigation = useNavigation();

  const handleBackdropPress = () => {
    setModalVisible(false);
  };
  
  const [modalVisible, setModalVisible] = useState(false);

  return (
      <View style={styles.container}>


        <View style={styles.elementContainer}>

          <View style={styles.brightnessContainer}>
            <Text style={styles.titleText}> Brightness </Text>
            <View style={styles.elementContainer}>
              <Slider
                style={styles.slider}
                value={currentBrightness}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor={Colors.blue.neutral}
                maximumTrackTintColor={Colors.grey.light}
                thumbTintColor={Colors.blue.neutral}
                tapToSeek={true}
                onSlidingComplete={(v) => {
                  setCurrentBrightness(v)
                  postCommand('brightness', [v])
                }}
              />
            </View>
          </View>
          
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          
        }}
      >
        <View style={{ flex: 1 }}>
     
            <View style={{...styles.modalBackdrop, backgroundColor: 'transparent'}}>
                 <TouchableOpacity style={{ height:'50%' }} onPress={handleBackdropPress}>
                    
                </TouchableOpacity>
              
              <View
                style={[styles.modalContent, { height: '50%'  }]}
              >
                <TouchableOpacity onPress={handleBackdropPress} style={{height: 40, width: 40}}>
                  <ExitIcon />
                </TouchableOpacity>
                
                <ColorPickerComponent />
              </View>
            </View>
          
        </View>
      </Modal>

          <View style={styles.colourShowcaseContainer}>
            <Text style={styles.titleText}> Colour </Text>
            <ListButton 
              // onPress={()=>navigation.navigate('Color Picker')} 
              onPress={()=>setModalVisible(true)} 
              activeOpacity={0.65} 
              text="" 
              isIconIncluded={false} 
              style={{...styles.colourShowcase, 
              backgroundColor: manualMode ? `rgb(${currentColor?.r},${currentColor?.g},${currentColor?.b})` : Colors.white.neutral}} 
            />
            <View style={styles.checkboxContainer}>
              
              <BouncyCheckbox
                isChecked={manualMode}
                size={25}
                fillColor={Colors.grey.neutral}
                unFillColor={Colors.grey.neutral}
                disableText
                iconStyle={{ borderColor: Colors.grey.neutral }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={(isChecked) => {
                  setManualMode(isChecked)
                  postCommand('manualMode', [isChecked ? "true" : "false"])
                }}
              />
              <Text  style={styles.sideText}>{'Use custom color'}</Text>
            </View>
            
          </View>
         
        </View>
      </View>
  )
}


export const ColorPickerComponent = () => {
  const { currentDate,
    setCurrentDate,
    currentColor,
    setCurrentColor,
    currentBrightness,
    setCurrentBrightness,
    currentUtcOffset,
    setCurrentUtcOffset,
    manualMode,
    setManualMode,
    postCommand
  } = useContext(DeviceControl);

  const onSelectColor = ({ hex }) => {
    console.log(hex);

    console.log(hexToRgb(hex));
    setCurrentColor(hexToRgb(hex))
    setManualMode(true)
    postCommand('colour', [`${hexToRgb(hex).r},${hexToRgb(hex).g},${hexToRgb(hex).b}`])
  };
  console.log(currentColor)
  return (

    <View style={{...styles.pickerContainer}}>
      <ColorPicker style={styles.colorPicker} value={manualMode ? currentColor : hexToRgb(Colors.white.neutral)} onComplete={onSelectColor}>
        <Panel2 thumbShape={'circle'} />
      </ColorPicker>
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
    width: '80%'
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-start',
    
  },
  modalContent: {
    backgroundColor: '#373A5B',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  brightnessContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'rgba(108, 115, 152, 0.5)',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20
  },
  pickerContainer:{
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    width: '100%',
  },
  checkboxContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  colourShowcaseContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    width: '100%',
    gap: 20,
    backgroundColor: 'rgba(108, 115, 152, 0.5)',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20
  },
  colourShowcase: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '60%',
    height: 60,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.grey.light,
    // backgroundColor: 'white',
    marginLeft: 10,
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
    fontWeight: 500,
    fontSize: 15,
    margin: 5,
    color: Colors.white.neutral
  },
  sideText: {
    color: Colors.grey.light
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
    gap: 20,
  },
  slider: {
    height: 40,
    width: '88%'
  },
  colorPicker: {
    width: '70%',
    marginTop: 20,
    borderColor: Colors.grey.light,
    borderWidth: 3,
    borderRadius: 8
  },
})