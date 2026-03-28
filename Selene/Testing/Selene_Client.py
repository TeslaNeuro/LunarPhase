# ============================================================
# Project: Selene – Simulating Client Requests
# Author: Arshia Keshvari
# Role: Independent Developer, Project Author & Engineer
# Date: 01/02/2025
# License: MIT License
# ============================================================

"""
Description:
This Python script acts as a client interface for the Selene ESP32 
Lunar Phase LED system. It communicates with the device via HTTP 
requests to control and monitor its behaviour.

Functionality:
- Set system time using Unix timestamp
- Adjust LED brightness
- Set RGB colour (manual mode)
- Enable or disable manual mode
- Retrieve current system state and timestamp
- Configure UTC offset

The script is primarily used for testing, remote control, and 
integration with external systems.
"""

import requests

# ESP32 IP address
esp32_ip = "http://moonap_34ab959bd50c.local"  # ESP32 dev board
# esp32_ip = "http://192.168.1.60" # Alternative IP address

def set_esp32_time(unix_timestamp):
    url = f"{esp32_ip}/setTimestamp"
    data = {'timestamp': str(unix_timestamp)}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print("Time updated successfully")
        else:
            print(f"Failed to set time. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

def set_led_brightness(brightness):
    url = f"{esp32_ip}/setBrightness"
    data = {'brightness': str(brightness)}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print(f"LED brightness set to {brightness} successfully")
        else:
            print(f"Failed to set brightness. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

def get_esp32_timestamp():
    url = f"{esp32_ip}/getTimestamp"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            timestamp = response.text
            print(f"Current ESP32 Timestamp: {timestamp}")
            return timestamp
        else:
            print(f"Failed to get timestamp. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
    return None

def set_rgb_colour(r, g, b):
    url = f"{esp32_ip}/setColour"
    data = {'colour': f"{r},{g},{b}"}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print(f"Colour set successfully to RGB({r}, {g}, {b})")
        else:
            print(f"Failed to set colour. Status code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def set_manual_mode(manual_mode):
    url = f"{esp32_ip}/setManualMode"
    data = {'manualMode': 'true' if manual_mode else 'false'}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print(f"Manual mode set to {'ON' if manual_mode else 'OFF'} successfully")
        else:
            print(f"Failed to set manual mode. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

def get_system_state():
    url = f"{esp32_ip}/getSystemState"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            system_state = response.json()
            print("ESP32 System State:")
            print(system_state)
            return system_state
        else:
            print(f"Failed to get system state. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
    return None

def set_utc_offset(offset):
    url = f"{esp32_ip}/setUtcOffset"
    data = {'utcOffset': str(offset)}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print(f"UTC Offset set to {offset} successfully")
        else:
            print(f"Failed to set UTC Offset. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Set a new time using a Unix timestamp (current time for testing)
    unix_timestamp = 1729182792 # 1729257139 or 1729182792 or 1730300517
    print(f"Setting ESP32 Time to Unix timestamp: {unix_timestamp}")
    set_esp32_time(unix_timestamp)

    # Set LED brightness (value between 0 and 255)
    brightness_value = 125
    print(f"Setting LED brightness to: {brightness_value}")
    set_led_brightness(brightness_value)

    # Fetch the current timestamp from ESP32
    timestamp = get_esp32_timestamp()
    print(f"ESP32 Timestamp is: {timestamp}")

    # Set RGB color
    r, g, b = 255, 0, 0
    print(f"Setting RGB colour to ({r}, {g}, {b})")
    set_rgb_colour(r, g, b)

    # Set manual mode
    print("Enabling Manual Mode")
    set_manual_mode(False)

    # Fetch system state
    print("Fetching system state...")
    system_state = get_system_state()
    
    # Set UTC Offset
    utc_offset = 7200
    print(f"Setting UTC Offset to {utc_offset}")
    set_utc_offset(utc_offset)
