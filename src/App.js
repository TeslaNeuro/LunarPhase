import React, { useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator, TransitionSpecs } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from './screens/HomeStack'
import SettingsScreen from './screens/SettingsScreen'
import DeviceControlScreen from './screens/DeviceControlScreen'
import store from './store';
import { Provider } from 'react-redux'
import { HomeIcon, SettingsIcon } from './icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeColors } from './components/ui/colors';
import { Colors } from './components/ui'

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator()

// const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return (

    <Provider store={store}>
      <GestureHandlerRootView>
      <NavigationContainer>
        <RootStack.Navigator mode="modal" initialRouteName="TabNavigator" >
          <RootStack.Screen name="TabNavigator" options={{headerShown: false}} component={TabNavigator} />
          <RootStack.Screen name="Device_Control" options={({ route }) => ({
              title: route.params?.currentDeviceName || 'Device Control',
              headerShown: true, 
              headerTitleStyle: {
                color: Colors.blue.neutral,
              },
              headerStyle: {
                backgroundColor: '#1D203F',
              },
              headerTintColor: Colors.blue.neutral,
              headerShadowVisible: false
          })}
          component={DeviceControlScreen} />
        </RootStack.Navigator>
        
      </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>

  );
}




const TabNavigator = () => {

  const theme = useThemeColors();

  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      tabBarStyle: {
        backgroundColor: theme.background,
        ...styles.tabBar,
        borderTopWidth: 0, // Remove top border
      },
    }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{
        transitionSpec: TransitionSpecs.FadeSpec,
        title: 'Home',
        
        tabBarIcon: ({ size, focused, color }) => {
          return (
            <HomeIcon
              color={color}
              style={{ width: size, height: size }}
            />
          );
        },
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        transitionSpec: TransitionSpecs.FadeSpec,
        title: 'Settings',
        tabBarIcon: ({ size, focused, color }) => {
          return (
            <SettingsIcon
              color={color}
              style={{ width: size, height: size }}
            />
          );
        },
      }} />
    </Tab.Navigator>
  )
}



const styles = StyleSheet.create({
  tabBar: {
    height: '9.5%', 
    paddingTop: '1.5%',
  }
});
