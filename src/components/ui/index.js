import { StyleSheet, View, TouchableOpacity, Text as RNText, TextInput, Keyboard, ScrollView as RNScrollView, Switch, TouchableHighlight } from "react-native"
import { useState, useEffect } from 'react'
import * as Colors from "./colors"
import { MoonIcon } from "../../icons"
import { useThemeColors } from './colors';

export { Colors } 

export const ScrollView = ( { children, ...props } ) => {

  const styles = StyleSheet.create({
    scrollViewContrainer: {
      flexGrow: 1, 
      justifyContent: 'flex-start',
    },
  });

  return (
    <RNScrollView contentContainerStyle={styles.scrollViewContrainer} automaticallyAdjustKeyboardInsets={true} {...props}>
      {children}
    </RNScrollView>
  )
}

export const Text = ( { children, style, ...props } ) => {

  const styles = StyleSheet.create({
    defaultTextStyle: {
      color: Colors.black.light,
      fontSize: 15,
    },
  });

  return (
    <RNText style={{...styles.defaultTextStyle, ...style}} {...props}>
      {children}
    </RNText>
  )
}

export const RegularButton = ({
  text,
  textColor = Colors.white.neutral,
  textSize = 15,
  backgroundColor = Colors.blue.neutral,
  onPress = ()=>{},
  style = {},
  disabled = false,
  isTextCapital = true,
  Icon,
  iconColor = Colors.white.neutral,
  ...props
}) => {

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: disabled ? Colors.grey.neutral : backgroundColor,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center', 
      justifyContent: 'center',
    },
    text: {
      color: textColor,
      fontWeight: '600',
      margin: '4%',
      marginLeft: Icon && '3%',
      fontSize: textSize,
    },
    icon: {
      margin: '3%',   
      width: 30,
      height: 30, 
    },
  });

  return (
    <TouchableOpacity style={{...styles.container, ...style}} onPress={onPress} disabled={disabled} {...props}>
      {Icon && <Icon color={iconColor} style={styles.icon}/>}
      {text && <Text style={styles.text}>{isTextCapital ? text.toLocaleUpperCase() : text}</Text>}
    </TouchableOpacity>
  )
}

export const TextBox = ({
  label = 'Textbox',
  labelColor = Colors.black.light,
  labelSize = 15,
  labelStyle = {},
  outlineColor = Colors.grey.neutral,
  focusedOutlineColor = Colors.blue.neutral,
  style = {},
  inputStyle = {},
  onChangeText=()=>{},
  onFocus = ()=>{},
  onBlur = ()=>{},
  value = '',
  ...props
}) => {

  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    });
    return () => {
      hideSubscription.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start', 
      justifyContent: 'center',
      width: 260,
      height: 90,
    },
    label: {
      color: labelColor,
      fontWeight: '600',
      marginTop: '2%',
      marginHorizontal: '2%',
      fontSize: labelSize,
    },
    input: {
      marginVertical: '2%',
      marginHorizontal: '2%',
      backgroundColor: Colors.white.dark,
      borderWidth: 1,
      borderRadius: 7,
      borderColor: isFocused ? focusedOutlineColor : outlineColor,
      width: '90%',
      height: '50%',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 1,  
      elevation: 0.5,
      color: Colors.black.light
    }
  });

  return (
    <View style={{...styles.container, ...style}} keyboardShouldPersistTaps='handled'>
      <Text style={{...styles.label, ...labelStyle}}>{label}</Text>
      <TextInput
          style={{...styles.input, ...inputStyle}}
          onChangeText={onChangeText}
          value={value}
          placeholder="Type here..."
          placeholderTextColor={Colors.grey.light}
          onFocus={(e)=>{
            setIsFocused(true)
            onFocus(e)
          }}
          onBlur={(e)=>{
            setIsFocused(false)
            onBlur(e)
          }}
          onSubmitEditing={Keyboard.dismiss}
          {...props}
        />
    </View>
  )
}

export const ListButton = ({
  text = 'Button',
  onPress = ()=>{},
  switchProps = {},
  isSwitchIncluded = false,
  isIconIncluded = true,
  style = {},
  ...props
}) => {
  const theme = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '90%',
      height: 60,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.blue.light,
      shadowColor: Colors.black.dark,
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 3,
      backgroundColor: theme.listButton,
    },
    button: {
      width: isSwitchIncluded ? '80%' : '100%',
    },
    innerContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center', 
      justifyContent: isIconIncluded ? 'flex-start' : 'center',
      width: '100%',
      height: '100%',
      // backgroundColor: 'red',
      marginLeft: isIconIncluded ? 10 : 0,
    },
    iconContainer: {
      width: (!isSwitchIncluded && isIconIncluded) ? '15%' : '20%',
      alignItems: 'center',
      // backgroundColor: 'blue',
    },
    icon: {
      width: 40,
      height: 40,
    },
    text: {
      marginLeft: (!isSwitchIncluded && isIconIncluded) ? 10 : 15,
      color: theme.text,
    },
    switchContainer: {
      width: '95%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center', 
      
    },
    switch: {
      
    },
    divider: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.grey.light,
      borderRadius: 10,
      //margin: 10,
      height: '80%',
    },
    unclickableContainer: {
      width: '20%',
      height: '100%',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center', 
      justifyContent: 'center',
    }
  });


  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} underlayColor={Colors.blue.light} style={{...styles.container, ...style}} {...props}>
 
      <View style={styles.button}>
        <View style={styles.innerContainer}>

          {isIconIncluded && <View style={styles.iconContainer}>
            <MoonIcon style={styles.icon} />
          </View>}
          
          <Text style={styles.text}>{text}</Text>

        </View>
      </View>
      
      {isSwitchIncluded && <View onPress={(e)=>e.stopPropagation()} style={styles.unclickableContainer}>
        <View style={styles.divider} />
        <View style={styles.switchContainer}>
          <Switch style={styles.switch} {...switchProps} />
        </View>
      </View>}
      
    </TouchableOpacity>
  )
}

export const Divider = (props) => {
  const theme = useThemeColors();
  
  return (
  <View
    style={{
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
      margin: 10,
      width: '90%'
    }}
    {...props}
  />
)
}