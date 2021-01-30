#include <WiFi.h>
#include "Esp32MQTTClient.h"
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

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
int bpmc=0;

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}
PulseOximeter pox;
uint32_t tsLastReport = 0;

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
  if (!pox.begin()) {
    Serial.println("FAILED");
    goto label;
  } else {
    Serial.println("SUCCESS");
  }

}

void loop() {
  //checkWifi();
  pox.update();
  bool flag = false;
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    so2 = pox.getSpO2();
    bpm = pox.getHeartRate();
    
    if (bpm > 60 && so2 > 50 && so2 < 100)
    {
      bpmc+=bpm;
      Serial.println(bpm);
      counter++;
      flag = true;
      subcounter=0;
    }
    else if (bpm == 0 && so2 == 0) {
      bpmc=0;
      subcounter++;
      if(subcounter>8){
       if (!pox.begin()) {
        Serial.println("FAILED");
      } else {
        Serial.println("SUCCESS");
      }
      subcounter=0; 
      }
    }
    else {
      bpmc=0;
      counter = 0;
      subcounter=0;
    }
    tsLastReport = millis();
  }
  if (flag) {
    if (hasIoTHub)
    {
      if (counter > 16) {
      bpmc=bpmc/counter;
      String jsonSend = String(so2) + "," + String(int(bpmc));
      char buff[128];
      snprintf(buff, 128, string2char("{\"data\":[" + jsonSend + "],\"pat\":\"1\"}"));
      Serial.println(buff);
        Esp32MQTTClient_SendEvent(buff);
        if (!pox.begin()) {
          Serial.println("FAILED");
        } else {
          Serial.println("SUCCESS");
        }
        counter = 0;
      }
    }
  }
}
