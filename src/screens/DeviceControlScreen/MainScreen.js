import { View, StyleSheet, useColorScheme, ActivityIndicator, Animated, Image, Dimensions } from 'react-native';
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
import { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DeviceControl from "../../contexts/DeviceControlContext";
import {ColorOverviewComponent} from "./ColourControl"
import MoonPhaseControl from "./MoonPhaseControl"
import { WaxingGibbousIcon, WaxingGibbousIconXml } from '../../icons'
import {SvgXml} from 'react-native-svg';
import WaningCrescent from'../../icons/WaningCrescent.png';
import WaxingCrescent from'../../icons/WaxingCrescent.png';
import WaxingGibbous from'../../icons/WaxingGibbous.png';
import WaningGibbous from'../../icons/WaningGibbous.png';
import NewMoon from'../../icons/NewMoon.png';
import FullMoon from'../../icons/FullMoon.png';
import FirstQuarter from'../../icons/FirstQuarter.png';
import LastQuarter from'../../icons/LastQuarter.png';
import AnimatedGradientTransition from './AnimatedGradientTransition';
import NightSkyStars from'../../icons/NightSkyStars';
import MoonGraphic from './MoonGraphic';

const Tab = createMaterialTopTabNavigator();

export default MainScreen = ({ route, currentDeviceName }) => {
  const navigation = useNavigation();
  console.log('currentDeviceName',currentDeviceName)
  // const { currentDeviceName } = route.params;
  const networks = useSelector((state) => {
    return state.networks
  })
  const devices = useSelector((state) => {
    return state.devices
  })


  const [isLoading, setIsLoading] = useState(true)
  const [fadeAnim] = useState(new Animated.Value(0));
  const { currentDate,
    setCurrentDate,
    currentColor,
    setCurrentColor,
    currentBrightness,
    setCurrentBrightness,
    currentUtcOffset,
    setCurrentUtcOffset,
    manualMode,
    moonPhase,
    setMoonPhase,
    setManualMode,
    illumination,
    setIllumination,
    postCommand,
    endPointConfig } = useContext(DeviceControl);

  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';


  // fetch current state
  useEffect(() => {
    fetchDeviceState()

  }, [])

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
    }

  }, [isLoading]);

  const fetchDeviceState = async () => {
    const command = 'systemState'
    const domainHost = __DEV__ ? `${devices[currentDeviceName].host}:${devices[currentDeviceName].port}` : `${devices[currentDeviceName].name}.local`
    const deviceUrl = `http://${domainHost}/${endPointConfig[command].endPoint}`
    try {
      const resp = await fetch(deviceUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      console.log('set ', command, ' response', resp)
      const systemState = await resp.json()

      if (systemState) {
        console.log("systemState", systemState)
        setCurrentDate(decodeTimestamp(systemState.timestamp))
        const color = { r: Number(systemState.color.split(",")[0]), g: Number(systemState.color.split(",")[1]), b: Number(systemState.color.split(",")[2]) }
        setCurrentColor(color)
        setCurrentBrightness(systemState.brightness)
        setCurrentUtcOffset(systemState.utcOffset)
        setManualMode(systemState.manualMode)
        setMoonPhase(systemState.moonPhase)
        setIllumination(systemState.illumination)
      }
      setIsLoading(false)


    } catch (e) {
      console.warn(e)
    }
  }

  const decodeTimestamp = (timestamp) => (new Date(timestamp * 1000))

  const getMoonPng = (currentMoon) => {
    switch (currentMoon) {
      case 'Waxing Crescent':
      return WaxingCrescent
        
    
      case 'Waning Crescent':
      return WaningCrescent
      

      case 'Waxing Gibbous':
      return WaxingGibbous
      

      case 'Waning Crescent':
      return WaningGibbous

      case 'New Moon':
      return NewMoon

      case 'Full Moon':
      return FullMoon

      case '1st Quarter':
      return FirstQuarter

      case 'Last Quarter':
      return LastQuarter
      
      default:
        return FullMoon
    }
  }
  // ['#0E3770', '#44759E'] day
  // ['#1D203F', '#6C7398'] night
  // ['#1D203F', '#373A5B', '#6C7398']

  // star opacity change and transpose

  const [contentHeight, setContentHeight] = useState(0);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    console.log(contentHeight)
  };

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const contentHeightArray = (contentHeight > 0 && scrollViewHeight > 0) ? Array?.from({length: (Math?.floor(contentHeight/scrollViewHeight)+1)}, (_, i) => i) : []
  return (
    <ScrollView style={{backgroundColor: '#1D203F'}} bounces={false} showsVerticalScrollIndicator={false} onLayout={handleLayout} onContentSizeChange={handleContentSizeChange}>
      {isLoading &&
        <View style={styles.spinnerContainer}>
          <ActivityIndicator style={styles.spinner} size={'large'} />
          <Text style={styles.spinnerText}>{'Connecting...'}</Text>
        </View>
      }
      
      
      
      
      <Animated.View useNativeDriver={true} style={{ ...styles.container, opacity: (isLoading ? 0 : fadeAnim) }}>
      
         <AnimatedGradientTransition
          colors={['#1D203F', '#373A5B', '#6C7398']}
          style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingBottom: 30 }}
        >
          {/* {contentHeightArray.map((el,i)=><NightSkyStars key={`svg-${i}`} contentHeight={contentHeight} transform={(i % 2 !== 0) ? [{ scaleX: -1 }] : undefined} top={scrollViewHeight*i} width={'100%'} height={scrollViewHeight} style={{position: 'absolute', opacity: 0.85}} />)} */}
          {contentHeightArray.map((el,i)=>
          <NightSkyStars
            key={`svg-${i}`} 
            contentHeight={contentHeight} 
            transform={(i % 2 !== 0) ? [{ scale: -0.90 }] : [{ scale: 0.90 }]} 
            top={(scrollViewHeight*i)} 
            width={'100%'} 
            height={scrollViewHeight} 
            style={{position: 'absolute', opacity: 0.9}} 
          />
          )}

          <MoonGraphic illumination={illumination} moonPhase={moonPhase} />
          

          <View style={styles.elementContainer}>
            
            <ColorOverviewComponent />
            <MoonPhaseControl fetchDeviceState={fetchDeviceState} />
            
          </View>
          
        </AnimatedGradientTransition>
        


      </Animated.View>
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
    height: '100%',
    width: '100%',
  },
  spinner: {

  },
  spinnerContainer: {
    flex: 1,
    height: '50%',
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // backgroundColor: 'green',
  },
  graphicText: {
    fontWeight: 500,
    fontSize: 15,
    margin: 1,
    color: Colors.white.neutral
  },
  tempImg: {
    height: 200,
    width: undefined,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    aspectRatio: 800 / 800,
    
  },
  spinnerText: {
    fontWeight: '500',
    marginLeft: 5,
    color: Colors.white.neutral
  },
  titleText: {
    fontWeight: 500,
    fontSize: 15,
    margin: 5,
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
    gap: 10,
  },
  slider: {
    height: 40,
    width: '70%'
  },
  colorPicker: {
    width: '70%'
  },
})