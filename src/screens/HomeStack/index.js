
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'
import AddDeviceScreen from './AddDeviceScreen'
import AddWifiNetworkScreen from './AddWifiNetworkScreen'
import DeviceControlScreen from '../DeviceControlScreen'
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { useThemeColors } from '../../components/ui/colors';
const Stack = createNativeStackNavigator()

const HomeStack = () => {

  const navigation = useNavigation();
  const theme = useThemeColors();

  return (
    <Stack.Navigator initialRouteName="HomeScreen" >
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen} />
      <Stack.Screen name="Add_device" options={{ headerShown: true, headerStyle: { backgroundColor: theme.background }, headerTintColor: theme.text }} component={AddDeviceScreen} />
      <Stack.Screen name="Add_Wifi_Network" options={{ headerShown: true, headerStyle: { backgroundColor: theme.background }, headerTintColor: theme.text }} component={AddWifiNetworkScreen} />
      {/* <Stack.Screen name="Device_Control" options={{headerShown: true,}} component={DeviceControlScreen} /> */}
    </Stack.Navigator>
  )
}
export default HomeStack