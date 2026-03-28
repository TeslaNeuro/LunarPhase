# 🌙 Selene

Selene is an ESP32-based IoT project that visualizes the current **moon phase** using a string of **addressable LEDs (WS2812B)**. LED colors and brightness change automatically according to the moon phase and special lunar events like "Supermoon" or "Blood Moon". The system connects to Wi-Fi, fetches real-time data from an API, and provides **web-based control** for configuration and monitoring.

---

## ✨ Features

- **Automatic Moon Phase Display** – LEDs reflect the current moon phase in real-time.  
- **Special Moon Event Colors** – Unique colors for "Supermoon", "Blood Moon", and other lunar events.  
- **Manual Control Mode** – Override automatic behavior with custom RGB colors.  
- **Brightness Control** – Adjust LED brightness remotely (0–255).  
- **Timezone Support** – Set UTC offset for accurate moon phase display.  
- **Web Interface** – Access settings, monitor status, and configure Wi-Fi easily.  

---

## 🛠 Hardware Requirements

| Component                  | Details                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| **ESP32**                   | Microcontroller board                                                   |
| **Addressable LEDs (WS2812B)** | LED strip connected to ESP32                                         |
| **Power Supply**            | 5V power supply suitable for number of LEDs                             |
| **Internet Connection**     | Required for fetching real-time moon phase data                          |

---

## 💻 Software Requirements

- **Arduino IDE** – ESP32 development environment  
- **Arduino Core Library** – **esp32 by Espressif Systems v3.0.7** (required)  
- **Libraries** (Install via Library Manager):
  - `WiFi.h`  
  - `ESPAsyncWebServer.h`  
  - `HTTPClient.h`  
  - `ArduinoJson.h`  
  - `Preferences.h`  
  - `ESPmDNS.h`  
  - `FastLED.h`  

> ⚠️ **Important:** Make sure your Arduino Core for ESP32 is exactly **v3.0.7** to ensure compatibility.

---

## ⚙️ Installation

1. Clone the repository or download the source code.  
2. Open the project in **Arduino IDE**.  
3. Install required libraries via **Library Manager**.  
4. Connect the ESP32 to your computer, select the correct **board** and **port**.  
5. Upload the code to the ESP32.  

---

## 📡 Setup Instructions

### Wi-Fi Configuration

1. On first boot, Selene attempts to connect to saved Wi-Fi credentials.  
2. If no credentials are found, it creates an **Access Point**: `MoonAP_XXXXXX`.  
3. Open a browser and navigate to:  

```http
http://moonap_xxxxxxx.local/
