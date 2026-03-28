/*
============================================================
 Project: Selene - LunarPhase
 Author: Arshia Keshvari
 Role: Independent Developer, Project Author & Engineer
 Date: 01/02/2025
 License: MIT License
============================================================

Description:
Selene is an ESP32-based IoT project that retrieves real-time moon phase 
data from an online API and visualises it using a WS2812B LED strip. 
LED illumination represents the moon’s brightness, while colours reflect 
different lunar phases and special moon events.

Features:
- Wi-Fi connectivity with Access Point fallback
- Web server control (brightness, colour, time, mode)
- Automatic and manual display modes
- Persistent Wi-Fi storage using Preferences
- Real-time updates via NTP and API
*/

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <ESPmDNS.h>
#include <time.h>
#include <FastLED.h>

#define NUM_LEDS 283        
#define DATA_PIN 22         
CRGB leds[NUM_LEDS];   

// Server constants
const int serverPort = 80;

Preferences preferences;
AsyncWebServer server(serverPort); // Port of the esp32 webserver

char apSSID[22]; // Declare apSSID as a global variable
String ssid;
String password; 
int connectionAttempts = 0; // Track the number of connection attempts
const int MAX_CONNECTION_ATTEMPTS = 6; // Number of attempts before fallback to AP
bool manualMode = false;
bool isWiFiConnected = false;
bool LetsFetchData = true;

// MDNS constants
const char* mdnsServiceType = "moonlamp-sta";

// Our moon api global variables
String moonPhase;
float illumination;
String moonDescription;

// Brightness variable (0 to 255)
int ledBrightness = 255; // MAX brightness 100% is 255

// Interval for printing moon phase data (60000 ms = 60 seconds)
unsigned long moonPhaseInterval = 3600000;
unsigned long previousMoonPhaseMillis = 0;
unsigned long lastUpdateTime = 0;

// timezone / time dif variable
int utcOffset = 0;// to make into preferences

// Define the special moon descriptions and their corresponding RGB values
struct MoonColor {
    const char* description;
    int r;
    int g;
    int b;
};

// Function prototypes
bool findSpecialMoonColor(const char* moonDescription, int& r, int& g, int& b);
bool findPrimaryMoonColor(const char* moonPhase, int& r, int& g, int& b);
void setSystemTime(uint32_t unixTime);
unsigned long getSystemUnixTime();
void fetchMoonPhaseData(unsigned long timestamp);
void handleSetTimestamp(AsyncWebServerRequest *request);
void handleGetTimestamp(AsyncWebServerRequest *request);
void handleGetSystemState(AsyncWebServerRequest *request);
void handleSetUtcOffset(AsyncWebServerRequest *request);
void handleSetManualMode(AsyncWebServerRequest *request);
void setLEDBrightness(int brightness);
void handleSetBrightness(AsyncWebServerRequest *request);
void updateLEDBasedOnMoon();
void connectToWiFiAsync(const String& ssid, const String& password);
void saveWiFiCredentials(const String& ssid, const String& password);
void loadWiFiCredentials();
void handleRoot(AsyncWebServerRequest *request);
void handleSave(AsyncWebServerRequest *request);
void handleNotFound(AsyncWebServerRequest *request);
void handleRedirect(AsyncWebServerRequest *request);
void clearPreferencesForTesting();
void wifiEvent(WiFiEvent_t event);
void startAccessPoint();
void handleSetColour(AsyncWebServerRequest *request);

// Array of special full moon descriptions and their RGB values (Check Colours based on location)
MoonColor specialMoonColors[] = {
    {"Blood Moon", 204, 0, 0},        // Blood Moon: Deep Red, often observed during lunar eclipses
    {"Supermoon", 255, 255, 255},     // Supermoon: Bright white, due to the moon being closer to Earth
    {"Micromoon", 180, 180, 180},     // Micromoon: Pale grey, as it appears smaller and less bright
    {"Harvest Moon", 255, 153, 51},   // Harvest Moon: Golden-orange, typical for harvest times
    {"Fruit Moon", 255, 100, 50},     // Fruit Moon: Reddish-orange, symbolizing fruit harvests
    {"Hunter's/Harvest Moon", 255, 140, 0}, // Hunter's Moon: A bright orange, related to autumn harvest
    {"Blue Moon", 0, 0, 255},         // Blue Moon: A pale blue, very rare but the name suggests it
    {"Black Moon", 5, 5, 5},          // Black Moon: The absence of visible light, a very dark color
    {"Grain Moon", 255, 255, 153},    // Grain Moon: A soft golden-yellow, symbolizing grains ripening
    {"Grass Moon", 144, 238, 144},    // Grass Moon: Light green, symbolizing new growth
    {"Wolf Moon", 255, 255, 255},     // Wolf Moon: Pale, full moon often depicted as white
    {"Honey Moon", 255, 223, 50},     // Honey Moon: Warm yellow, associated with sweet, warm honey
    {"Moon after Yule", 255, 250, 250}, // Moon after Yule: Very light, near-white, winter moon
    {"Planting Moon", 144, 238, 144}, // Planting Moon: Light green, symbolizing spring planting
    {"Strawberry Moon", 255, 99, 71}, // Strawberry Moon: Light red or pinkish-red, associated with strawberries
    {"Sap Moon", 139, 69, 19},        // Sap Moon: A deep brown, representing tree sap during spring
    {"Pink Moon", 255, 182, 193},     // Pink Moon: Soft pink, due to blooming flowers (especially pink flowers)
    {"Snow Moon", 255, 250, 250},     // Snow Moon: White to very light gray, winter snow
    {"Cold Moon", 240, 248, 255},     // Cold Moon: Pale blue, representing cold winter nights
    {"Frosty Moon", 240, 248, 255},   // Frosty Moon: Similar to Cold Moon, pale blue or frosty white
    {"Thunder Moon", 255, 105, 180}   // Thunder Moon: A vivid pink or magenta, linked with summer storms
};

// To save power and lower heat loss when testing
MoonColor primaryMoonColors[] = {
  {"New Moon", 0, 0, 0},           // Completely dark (no moonlight)
  {"Waxing Crescent", 128, 128, 100}, // Dim warm white to reflect a small crescent
  {"First Quarter", 128, 128, 128}, // Dimmed white for half illumination
  {"Waxing Gibbous", 100, 100, 100}, // Softer white to simulate increasing brightness
  {"Full Moon", 128, 128, 128},    // Dimmed bright white
  {"Waning Gibbous", 100, 100, 100}, // Similar to waxing gibbous, dimmed
  {"Last Quarter", 128, 128, 128}, // Dimmed bright white for half illumination
  {"Waning Crescent", 128, 128, 100} // Dim warm white for the small crescent
};

MoonColor customColour = {"Custom", 255, 255, 255};

// Function to check for special moon description match
bool findSpecialMoonColor(const char* moonDescription, int& r, int& g, int& b) {
    for (int i = 0; i < sizeof(specialMoonColors) / sizeof(specialMoonColors[0]); i++) {
        if (strstr(moonDescription, specialMoonColors[i].description) != NULL) {
            r = specialMoonColors[i].r;
            g = specialMoonColors[i].g;
            b = specialMoonColors[i].b;
            return true;
        }
    }
    return false;
}

// Function to check for primary moon phase match
bool findPrimaryMoonColor(const char* moonPhase, int& r, int& g, int& b) {
    for (int i = 0; i < sizeof(primaryMoonColors) / sizeof(primaryMoonColors[0]); i++) {
        if (strcmp(moonPhase, primaryMoonColors[i].description) == 0) {
            r = primaryMoonColors[i].r;
            g = primaryMoonColors[i].g;
            b = primaryMoonColors[i].b;
            return true;
        }
    }
    return false;
}

// Function to set time manually using Unix timestamp
void setSystemTime(uint32_t unixTime) {
  struct timeval tv;
  tv.tv_sec = unixTime;
  tv.tv_usec = 0;
  settimeofday(&tv, NULL);
  Serial.printf("\nESP32 time set to Unix timestamp: %u\n", unixTime);
}

// Function to check current system time in unix based format
unsigned long getSystemUnixTime() {
  time_t now;
  time(&now);
  
  return (now + utcOffset);
}

// Function to fetch moon phase data from the API
void fetchMoonPhaseData(unsigned long timestamp) {
  if (WiFi.status() == WL_CONNECTED) { // Check WiFi connection

    HTTPClient http;
    String url = "https://api.farmsense.net/v1/moonphases/?d=" + String(timestamp);
    
    http.begin(url);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.print("\n");
        Serial.println(payload);

        // Parse JSON response
        DynamicJsonDocument doc(1024); // Adjust size based on expected response
        DeserializationError error = deserializeJson(doc, payload);

        if (!error) { // Check for parsing errors
            moonPhase = doc[0]["Phase"].as<String>();
            illumination = doc[0]["Illumination"].as<float>();
            moonDescription = doc[0]["Moon"][0].as<String>();

            Serial.println("Moon Phase: " + moonPhase);
            Serial.println("Illumination: " + String(illumination));
            Serial.println("Description: " + moonDescription);
            LetsFetchData = false;
        } else {
            Serial.print("JSON parsing error: ");
            Serial.println(error.f_str()); // Print the parsing error
        }
    } else {
        Serial.print("Error fetching moon phase data, HTTP response code: ");
        Serial.println(httpResponseCode);
    }

    http.end(); // closes the HTTP connection
  } else{
    Serial.println("WiFi not connected");
    //WiFi.reconnect();  // Attempt to reconnect if disconnected
  }
}

// Function to handle client request to set timestamp
void handleSetTimestamp(AsyncWebServerRequest *request) {
  if (request->hasParam("timestamp", true)) {
    String timestampStr = request->getParam("timestamp", true)->value();
    uint32_t unixTime = timestampStr.toInt();
    setSystemTime(unixTime);
    fetchMoonPhaseData(getSystemUnixTime());
    request->send(200, "text/plain", "ESP32 Timestamp set");
  } else {
    request->send(400, "text/plain", "Timestamp not provided.");
  }
}

// Function to handle client request to set manual mode for the color
void handleSetManualMode(AsyncWebServerRequest *request) {
  if (request->hasParam("manualMode", true)) {
    String manualModeStr = request->getParam("manualMode", true)->value();
    bool manualModeBool = manualModeStr == "true";
    manualMode = manualModeBool;
    request->send(200, "text/plain", "manual mode set");
  } else {
    request->send(400, "text/plain", "manual mode not provided.");
  }
}

// Function to handle client request to get the current timestamp
void handleGetTimestamp(AsyncWebServerRequest *request) {
    unsigned long timestamp = getSystemUnixTime(); // Get the current Unix timestamp
    // Check if the timestamp is valid
    if (timestamp > 0) {
        request->send(200, "text/plain", String(timestamp));
    } else {
        request->send(500, "text/plain", "Internal Server Error: Invalid timestamp");
    }
}

// Function to handle client request to get the current state of the device
void handleGetSystemState(AsyncWebServerRequest *request) {
    unsigned long timestamp = getSystemUnixTime(); // Get the current Unix timestamp
    int currentBrightness = FastLED.getBrightness();
    String color = String(customColour.r) + "," + String(customColour.g) + "," + String(customColour.b);

    //Prepare JSON document
    DynamicJsonDocument doc(1024);
    doc["timestamp"] = getSystemUnixTime();
    doc["brightness"] = FastLED.getBrightness();
    doc["manualMode"] = manualMode;
    doc["color"] = color;
    doc["utcOffset"] = utcOffset;
    doc["moonPhase"] = moonPhase;
    doc["illumination"] = illumination;
    doc["moonDescription"] = moonDescription;

    // Serialize JSON document
    String json;
    serializeJson(doc, json);

    request->send(200, "application/json", json);
}

// Function to handle client request to set time diff aka timezone
void handleSetUtcOffset(AsyncWebServerRequest *request) {
  if (request->hasParam("utcOffset", true)) {
    String utcOffsetStr = request->getParam("utcOffset", true)->value();
    int utcOffsetInt = utcOffsetStr.toInt();
    utcOffset = utcOffsetInt;
    request->send(200, "text/plain", "Time diff set");
  } else {
    request->send(400, "text/plain", "Time diff not provided.");
  }
}

// Function to set LED brightness
void setLEDBrightness(int brightness) {
    ledBrightness = constrain(brightness, 0, 255);  // Ensure the brightness is within 0-255
    FastLED.setBrightness(ledBrightness);  // Set the brightness for all LEDs
    FastLED.show();  // Update the LEDs
}

// Function to handle brightness requests
void handleSetBrightness(AsyncWebServerRequest *request) {
    if (request->hasParam("brightness", true)) {
        String brightnessStr = request->getParam("brightness", true)->value();
        int brightness = brightnessStr.toInt();
        setLEDBrightness(brightness);
        request->send(200, "text/plain", "LED Brightness set to " + String(brightness));
    } else {
        request->send(400, "text/plain", "Brightness not provided.");
    }
}

// Function to handle setting user colour
void handleSetColour(AsyncWebServerRequest *request) {
    if (request->hasParam("colour", true, false)) {  // Check for POST body parameter
        manualMode = true;  // Switch to manual mode
        String ColourStr = request->getParam("colour", true, false)->value();

        // Split and parse the incoming string
        int r = 0, g = 0, b = 0;
        int firstComma = ColourStr.indexOf(',');
        int secondComma = ColourStr.indexOf(',', firstComma + 1);

        if (firstComma != -1 && secondComma != -1) {
            r = ColourStr.substring(0, firstComma).toInt();
            g = ColourStr.substring(firstComma + 1, secondComma).toInt();
            b = ColourStr.substring(secondComma + 1).toInt();
        }

        // Validate RGB values
        r = constrain(r, 0, 255);
        g = constrain(g, 0, 255);
        b = constrain(b, 0, 255);

        customColour = {"Custom", r, g, b};

        // Respond to the client
        request->send(200, "text/plain", "Colour set to RGB(" + String(r) + "," + String(g) + "," + String(b) + ")");
    } else {
        request->send(400, "text/plain", "Colour not provided.");
    }
}

// Function to save Wi-Fi credentials to preferences
void saveWiFiCredentials(const String& ssid, const String& password) {
    preferences.begin("wifi_config", false);
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.end();
}

// Function to load Wi-Fi credentials from preferences
void loadWiFiCredentials() {
    preferences.begin("wifi_config", true);
    ssid = preferences.getString("ssid", "");
    password = preferences.getString("password", "");
    preferences.end();

    if (ssid.length() > 0 && password.length() > 0) {
        connectToWiFiAsync(ssid, password); // Connect to saved credentials if they exist
    } else {
        startAccessPoint(); // Start access point otherwise
    }
}

// Handle root web page
void handleRoot(AsyncWebServerRequest *request) {
    Serial.println("Received request for root page."); // Debug statement
    String html = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'>";
    html += "<style>body { font-family: Arial; text-align: center; } input[type='text'] { width: 80%; margin: 10px 0; }</style></head><body>";
    html += "<h2>Configure Wi-Fi</h2>";
    html += "<form action='/save' method='POST'>";
    html += "Wi-Fi SSID: <input type='text' name='ssid' placeholder='Enter your Wi-Fi SSID' required><br>";
    html += "Password: <input type='text' name='password' placeholder='Enter your Wi-Fi Password' required><br>";
    html += "<input type='submit' value='Save'>";
    html += "</form></body></html>";
    request->send(200, "text/html", html);
}

// Handle saving Wi-Fi credentials
void handleSave(AsyncWebServerRequest *request) {
  if (request->hasArg("ssid") && request->hasArg("password")) {
      String new_ssid = request->arg("ssid");
      String new_password = request->arg("password");

      // Save SSID and Password to preferences
      saveWiFiCredentials(new_ssid, new_password);

      // Save the new credentials
      ssid = new_ssid.c_str();
      password = new_password.c_str();

      // Provide feedback to the user
      String feedbackHtml = "<html><body><h1>Settings Saved!</h1>";
      feedbackHtml += "<p>Attempting to connect to Wi-Fi...</p>";
      feedbackHtml += "</body></html>";
      request->send(200, "text/html", feedbackHtml);

      // Connect to the new Wi-Fi network asynchronously
      connectToWiFiAsync(new_ssid, new_password);

  } else {
      request->send(400, "text/html", "<html><body><h1>Error</h1><p>SSID and Password must not be empty.</p></body></html>");
  }
}

// Handle not found
void handleNotFound(AsyncWebServerRequest *request) {
    // Automatically redirect to the root page
    handleRedirect(request);
}

// Redirect any request to the root page
void handleRedirect(AsyncWebServerRequest *request) {
    // Send a 302 redirect response to the root page
    request->send(302, "text/plain", "Redirecting to /");
}

// Function to clear stored preferences for testing
void clearPreferencesForTesting() {
    preferences.begin("wifi_config", false);
    preferences.clear(); // Clear all saved preferences
    preferences.end();
}

// Function to connect to Wi-Fi asynchronously
void connectToWiFiAsync(const String& ssid, const String& password) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid.c_str(), password.c_str());
    Serial.println("Connecting to Wi-Fi...");

    // Register Wi-Fi event handler
    WiFi.onEvent(wifiEvent);
}

void startAccessPoint() {
    Serial.println("Starting Access Point...");
    WiFi.mode(WIFI_AP); // switch mode to access point
    WiFi.softAP(apSSID, "moonphase");
}

void wifiEvent(WiFiEvent_t event) {
    switch (event) {
        case ARDUINO_EVENT_WIFI_STA_GOT_IP:
            Serial.println("\nConnected to WiFi!");
            connectionAttempts = 0; // Reset attempts on successful connection
            Serial.print("IP address: ");
            Serial.println(WiFi.localIP());
            isWiFiConnected = true;
            LetsFetchData = true;
            break;

        case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:
            Serial.println("Disconnected! Attempting to reconnect...");
            isWiFiConnected = false;
            connectionAttempts++;
            if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
                connectionAttempts = 0; // reset attemps
                startAccessPoint();
            } else {
                // Retry connecting without blocking
                WiFi.disconnectAsync();
                WiFi.reconnect();
            }
            break;
    }
}

// Function to update LEDs based on the moon phase and special conditions
void updateLEDBasedOnMoon() {
    int r = 0, g = 0, b = 0;

    if (manualMode == true) {
      r = customColour.r;
      g = customColour.g;
      b = customColour.b;
    } else {
      if (strcmp(moonPhase.c_str(), "Full Moon") == 0) {
        findSpecialMoonColor(moonDescription.c_str(), r, g, b);
      } else {
        findPrimaryMoonColor(moonPhase.c_str(), r, g, b);
      }
    }
    

    uint16_t numLitLEDs = constrain(round(illumination * NUM_LEDS), 0, NUM_LEDS);

    for (uint16_t i = 0; i < NUM_LEDS; i++) {
        leds[i] = (i < numLitLEDs) ? CRGB(r, g, b) : CRGB::Black;
    }
    FastLED.show();
}

// Initial setup for Wi-Fi and server
void setup() {
  delay(500);  // Delay to allow voltage stabilization
  Serial.begin(115200);
  
  uint64_t chipId = ESP.getEfuseMac();  // Retrieve chip MAC ID
  snprintf(apSSID, sizeof(apSSID), "MoonAP_%02X%02X%02X%02X%02X%02X",
      (uint8_t)chipId,             // Lowest byte
      (uint8_t)(chipId >> 8),      // Second lowest byte
      (uint8_t)(chipId >> 16),     // Third lowest byte
      (uint8_t)(chipId >> 24),     // Fourth lowest byte
      (uint8_t)(chipId >> 32),     // Fifth lowest byte
      (uint8_t)(chipId >> 40));    // Highest byte

  // Delay the Wi-Fi and LED setup by another 500 ms if needed
  delay(500);
  
  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
  FastLED.clear();  
  FastLED.show();

  // Clear stored wifi credentials FOR TESTING ONLY
  // clearPreferencesForTesting();

  // Load saved SSID and password from preferences
  loadWiFiCredentials(); // This attempts to connect to saved Wi-Fi credential
  delay(500);
  
  // Set initial time to UTC Synchronize system time with NTP server
  configTime(0, 0, "pool.ntp.org");

  // Handle routes for WiFi AP setup
  server.on("/", HTTP_GET, handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  server.onNotFound(handleNotFound);

  // Define routes for general functions as needed
  server.on("/setTimestamp", HTTP_POST, handleSetTimestamp);
  server.on("/setBrightness", HTTP_POST, handleSetBrightness);
  server.on("/setUtcOffset", HTTP_POST, handleSetUtcOffset);
  server.on("/getTimestamp", HTTP_GET, handleGetTimestamp);
  server.on("/getSystemState", HTTP_GET, handleGetSystemState);
  server.on("/setColour", HTTP_POST, handleSetColour);
  server.on("/setManualMode", HTTP_POST, handleSetManualMode);

  // Start server
  server.begin();

  // Set up mDNS using apssid as default hostname
  if (!MDNS.begin(apSSID)) {
    Serial.println("Error starting mDNS");
  } else {
    Serial.println("MDNS responder started. Access the config page at http://moonap_xxxxxxx.local/");
    
    Serial.println("Advertising MDNS on the local network...");
    MDNS.addService(mdnsServiceType, "tcp", serverPort);
  }
}

// Loop function does nothing as server is asynchronous
void loop() {
  
  // Get the current time
  unsigned long currentMillis = millis();

  if (currentMillis - lastUpdateTime >= 3000) {
    lastUpdateTime = currentMillis;
    Serial.println("\nSystem Unix Timestamp is : " + String(getSystemUnixTime())); 
    updateLEDBasedOnMoon();
    
    if(isWiFiConnected && LetsFetchData && (getSystemUnixTime()>86400)){
      fetchMoonPhaseData(getSystemUnixTime());
      //WiFi.disconnect(); // FOR TESTING ONLY
    }
  }

  // // Check if 60 seconds (60000 ms) has passed lets get moon phase data
  if (currentMillis - previousMoonPhaseMillis >= moonPhaseInterval) {
    previousMoonPhaseMillis = currentMillis;  // Save the last time moon phase data was printed
    fetchMoonPhaseData(getSystemUnixTime());  // Fetch moon data with new timestamp
    //WiFi.disconnect(); // FOR TESTING ONLY
  }

}
