import { Text, View, Button, SafeAreaView, Switch } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useThemeColors } from '../components/ui/colors';
import React, { useEffect, useMemo, useState } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setUseDevice } from '../store';

function SettingsScreen() {
  const navigation = useNavigation();

  const theme = useThemeColors();

  const settings = useSelector((state) => {
    return state.settings
  })

  const radioButtons = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Dark',
      value: 'dark',
      labelStyle: { color: theme.text },
    },
    {
      id: '2',
      label: 'Light',
      value: 'light',
      labelStyle: { color: theme.text },
    },
  ]), [theme]);

  const dispatch = useDispatch();

  const setSelectedId = (chosenId) => {
    
    if (!settings.useDevice) {
      const value = radioButtons.find((item)=> (item.id == chosenId))?.value
      dispatch(setTheme(value));
    }
    
  }

  const toggleSwitch = () => {
    dispatch(setUseDevice(!settings.useDevice));
  };

  const currentSelectedRadioId = radioButtons.find((item)=> (item.id == radioButtons.find((item2)=> (item2.value == settings.themeMode))?.id))?.id

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: useThemeColors().mainBackground }}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
        <Text style={{ color: useThemeColors().text }}>Use Device theme: </Text>
        <Switch
          value={settings.useDevice}
          onValueChange={toggleSwitch}
          thumbColor={settings.themeMode ? '#00BFFF' : '#ffffff'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',paddingTop: 20, opacity: settings.useDevice ? 0 : 1}}>
        <Text style={{ color: useThemeColors().text }}>Theme: </Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={currentSelectedRadioId}
          layout="row"

        />
      </View>
      
      {/* <Text style={{color: useThemeColors().text}}>{mode}</Text>
      <Text style={{color: useThemeColors().text}}>{String(modee)}</Text> */}


    </SafeAreaView>
  );
}

export default SettingsScreen