#include <WiFi.h>
#include "Esp32MQTTClient.h"
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#define VBATPIN A7

#define REPORTING_PERIOD_MS     500

// Please input the SSID and password of WiFi
const char* ssid     = "xxxxx";
const char* password = "xxxxx";

// Primary Connection String

static const char* connectionString = "xxxxxxxxx";

static bool hasIoTHub = false;

float so2 = 0;
float bpm = 0;

int counter = 0;
int subcounter = 0;
int bpmc = 0;
int so2c = 0;
String jsonSends = "";
bool flagc=false;

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}
PulseOximeter pox;
uint32_t tsLastReport = 0;
uint32_t tsLastReport2 = 0;

void checkWifi() {
  int conCounter = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
    conCounter++;
    if (conCounter == 10) {
      ESP.restart();
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting connecting WiFi.");
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  delay(10);
  WiFi.begin(ssid, password);
  checkWifi();
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  if (!Esp32MQTTClient_Init((const uint8_t*)connectionString))
  {
    hasIoTHub = false;
    return;
  }
  hasIoTHub = true;
label:
  if (!pox.begin(PULSEOXIMETER_DEBUGGINGMODE_AC_VALUES)) {
    Serial.println("FAILED");
    goto label;
  } else {
    Serial.println("SUCCESS");
  }
  digitalWrite(13, LOW);
  float measuredvbat = analogRead(VBATPIN);
  measuredvbat *= 2;    // we divided by 2, so multiply back
  measuredvbat *= 3.3;  // Multiply by 3.3V, our reference voltage
  measuredvbat /= 1024; // convert to voltage
  Serial.print("VBat: " ); Serial.println(measuredvbat);
}

void loop() {
  //checkWifi();
  float values;
  pox.update(values);
  bool flag = false;

  if (millis() - tsLastReport2 > 10) {
    if(int(values)<500){
      jsonSends += String(int(values));
    tsLastReport2 = millis();
    flagc=true;
    }
  }

  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    so2 = pox.getSpO2();
    bpm = pox.getHeartRate();

    if (bpm > 60 && so2 > 50 && so2 <= 100)
    {
      bpmc += bpm;
      so2c += so2;
      counter++;
      flag = true;
      subcounter = 0;
    }
    else if (bpm == 0 && so2 == 0) {
      bpmc = 0;
      so2c = 0;
      jsonSends = "";
      subcounter++;
      if (subcounter > 8) {
        if (!pox.begin(PULSEOXIMETER_DEBUGGINGMODE_AC_VALUES)) {
          Serial.println("FAILED");
        } else {
          Serial.println("SUCCESS");
        }
        subcounter = 0;
      }
    }
    else {
      bpmc = 0;
      so2c = 0;
      jsonSends = "";
      counter = 0;
      subcounter = 0;
    }
    tsLastReport = millis();
  }
  if (flag) {
    if (hasIoTHub)
    {
      if (counter > 5) {
        bpmc = bpmc / counter;
        so2c = so2c / counter;
        jsonSends += String(int(values));
        String jsonSend = String(so2c) + "," + String(int(bpmc));
        char buff[2048];
        snprintf(buff, 2048, string2char("{\"data\":[" + jsonSend + "],\"graph\":[" + jsonSends + "],\"pat\":\"1\"}"));
        Serial.println(buff);
        Esp32MQTTClient_SendEvent(buff);
        if (!pox.begin(PULSEOXIMETER_DEBUGGINGMODE_AC_VALUES)) {
          Serial.println("FAILED");
        } else {
          Serial.println("SUCCESS");
        }
        counter = 0;
        jsonSends = "";
        bpmc = 0;
        so2c = 0;
      }
    }
  }
  else {
    if (jsonSends != "") {
      if(flagc){
        jsonSends += ",";
        flagc=false;
      }
    }
  }
}
