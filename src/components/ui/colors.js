import { useColorScheme } from "react-native"
import { useSelector } from "react-redux";


const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#0E0D0C',
    primary: '#006fff', 
    listButton: '#FFFFFF',
    divider: '#000000',
    emptyBoxIconOutline: '',
  },
  dark: {
    background: '#202124',
    mainBackground: '#292B2E',
    text: '#FFFFFF',
    primary: '#006fff', 
    listButton: '#3A3C43',
    divider: '#9ca3af',
    emptyBoxIconOutline: '',
  },
};


export const white = {
  neutral: '#FFFFFF',
  dark: '#f3f7fe'
}

export const blue = {
  light: '#00BFFF',
  neutral: '#006fff',
}

export const black = {
  lighter: '#222427',
  light: '#2d2f31',
  neutral: '#0E0D0C',
  dark: '#000',
}

export const grey = {
  light: '#dadada',
  neutral: '#9ca3af',
  dark: '#5e5e5e',
}


export const useThemeColors = () => {
  const scheme = useColorScheme();  // Get the system color scheme
  const mode = useSelector((state) => state.settings.themeMode);  // Get the theme mode from Redux
  const useDevice = useSelector((state) => state.settings.useDevice);

  // If mode is 'useDevice', follow the system's color scheme
  if (useDevice === true) {
    return scheme === 'dark' ? Colors.dark : Colors.light;
  }

  // If mode is 'dark' or 'light', return the respective color scheme
  if (mode === 'dark') {
    return Colors.dark;
  }

  if (mode === 'light') {
    return Colors.light;
  }

  // Default to light mode if no mode is set
  return Colors.light;
  
};

export default Colors;