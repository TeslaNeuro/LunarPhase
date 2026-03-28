import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux'

// Create the context
const DeviceControl = createContext();

export default DeviceControl;

// Context Provider (Wrap your app with this)
export const DeviceControlProvider = ({ children, currentDeviceName }) => {

  const devices = useSelector((state) => {
    return state.devices
  })

  const endPointConfig = {
    brightness: {
      dataHeading: ['brightness'],
      endPoint: 'setBrightness'
    },
    timestamp: {
      dataHeading: ['timestamp'],
      endPoint: 'setTimestamp'
    },
    utcOffset: {
      dataHeading: ['utcOffset'],
      endPoint: 'setUtcOffset'
    },
    colour: {
      dataHeading: ['colour'],
      endPoint: 'setColour'
    },
    systemState: {
      endPoint: 'getSystemState'
    },
    manualMode: {
      dataHeading: ['manualMode'],
      endPoint: 'setManualMode'
    }
  }
  
  
  

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentColor, setCurrentColor] = useState('#FFFFFF')
  const [currentBrightness, setCurrentBrightness] = useState(100)
  const [currentUtcOffset, setCurrentUtcOffset] = useState(0)
  const [manualMode, setManualMode] = useState(false)
  const [moonPhase, setMoonPhase] = useState('Full Moon')
  const [illumination, setIllumination] = useState(1.0)

  

  const postCommand = async (command, value) => {
    const domainHost = __DEV__ ? `${devices[currentDeviceName].host}:${devices[currentDeviceName].port}` : `${devices[currentDeviceName].name}.local`
    const deviceUrl = `http://${domainHost}/${endPointConfig[command].endPoint}`
    console.log(deviceUrl)
    let formData = new FormData();
    for (let i = 0; i < endPointConfig[command].dataHeading.length; i++){
      formData.append(endPointConfig[command].dataHeading[i], value[i]);
    }
    
    console.log('formData',formData)

    try {
      const resp = await fetch(deviceUrl,
        {
          body: formData,
          method: "post"
        });
      console.log('set ',command,' response', resp)
    } catch (e) {
      console.warn(e)
    }
    
  }


  
  

  return (
    <DeviceControl.Provider value={{ 
      currentDate,
      setCurrentDate,
      currentColor,
      setCurrentColor,
      currentBrightness,
      setCurrentBrightness,
      currentUtcOffset,
      setCurrentUtcOffset,
      manualMode,
      setManualMode,
      moonPhase,
      setMoonPhase,
      illumination,
      setIllumination,
      postCommand,
      endPointConfig
     }}>
      {children}
    </DeviceControl.Provider>
  );
};

