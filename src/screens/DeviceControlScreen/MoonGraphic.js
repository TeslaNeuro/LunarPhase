import { View, StyleSheet, useColorScheme, ActivityIndicator, Image, Dimensions } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux'
import { RegularButton, Colors, ScrollView, Text } from '../../components/ui'
import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import WaningCrescent from'../../icons/WaningCrescent.png';
import WaxingCrescent from'../../icons/WaxingCrescent.png';
import WaxingGibbous from'../../icons/WaxingGibbous.png';
import WaningGibbous from'../../icons/WaningGibbous.png';
import NewMoon from'../../icons/NewMoon.png';
import FullMoon from'../../icons/FullMoon.png';
import FirstQuarter from'../../icons/FirstQuarter.png';
import LastQuarter from'../../icons/LastQuarter.png';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export default MoonGraphic = ({ illumination, moonPhase }) => {

  const glowOpacity = useSharedValue(0.5);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      // Optional: Add a slight scale effect for more dynamism
      // transform: [{ scale: 1 + glowOpacity.value * 0.1 }], // Adjust scale factor as needed
    };
  });

  const innerAnimatedStyles = useAnimatedStyle(() => {
      return {
          opacity: 1 - glowOpacity.value,
      }
  })

  // Start the animation on mount (or whenever you want it to begin)
  React.useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(0.8, { duration: 5000 }), -1, true); // Fade in and out repeatedly
  }, []);


  const getMoonPng = (currentMoon) => {
    switch (currentMoon) {
      case 'Waxing Crescent':
      return WaxingCrescent
        
    
      case 'Waning Crescent':
      return WaningCrescent
      

      case 'Waxing Gibbous':
      return WaxingGibbous
      

      case 'Waning Gibbous':
      return WaningGibbous

      case 'New Moon':
      return NewMoon

      case 'Dark Moon':
      return NewMoon

      case 'Full Moon':
      return FullMoon

      case '1st Quarter':
      return FirstQuarter

      case '3rd Quarter':
      return LastQuarter
      
      default:
        return FullMoon
    }
  }

  const getMoonShadow = (currentMoon) => {
    switch (currentMoon) {
      case 'Waxing Crescent':
      return { width: 10, height: 0 }
        
    
      case 'Waning Crescent':
      return { width: -10, height: 0 }
      

      case 'Waxing Gibbous':
      return { width: 10, height: 0 }
      

      case 'Waning Gibbous':
      return { width: -10, height: 0 }

      case 'New Moon':
      return { width: 0, height: 0 }

      case 'Dark Moon':
      return { width: 0, height: 0 }

      case 'Full Moon':
      return { width: 0, height: 0 }

      case '1st Quarter':
      return { width: 10, height: 0 }

      case '3rd Quarter':
      return { width: 10, height: 0 }
      
      default:
        return { width: 0, height: 0 }
    }
  }

  const styles = StyleSheet.create({
    elementContainer: {
      flex: 1,
      // backgroundColor: 'red',
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '3%',
      gap: 10,
      marginTop: '6%',
    },
    graphicText: {
      fontWeight: 600,
      fontSize: 15,
      margin: 1,
      marginTop: 5,
      color: Colors.white.neutral
    },
    tempImg: {
      height: 200,
      width: undefined,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      aspectRatio: 800 / 800,
      zIndex: 10
    },
    glow: {
      position: 'absolute', // Important for layering the glow
      top: 5,
      width: 189,
      height: 189,
      borderRadius: 100, // Make it a circle
      backgroundColor: 'white', // White glow
      // Shadow properties for the outer glow (optional, but enhance the effect)
      shadowColor: 'white',
      shadowOffset: getMoonShadow(moonPhase),
      shadowOpacity: 1, // Max shadow opacity
      shadowRadius: 15, // Adjust shadow radius for glow size
      elevation: 10, // For Android shadow effect
      zIndex: 8,
    },
  })
  
  return (
    <Animated.View style={[styles.elementContainer]}>
      <Image style={styles.tempImg} source={getMoonPng(moonPhase)} />
     
      <Animated.View style={[styles.glow, animatedStyles]} />

      {/* <Animated.View style={[styles.inner, innerAnimatedStyles]}/> */}
      <Text style={styles.graphicText}>{`Moon Phase: ${moonPhase}`}</Text>
      <Text style={styles.graphicText}>{`Illumination: ${illumination*100}%`}</Text>
    </Animated.View>
  );

  
}

