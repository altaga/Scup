#include <WiFi.h>
#include "Esp32MQTTClient.h"
#include <Wire.h>
#include <Adafruit_MLX90614.h>

float tempAVG=0;
int counter = 0;

// Please input the SSID and password of WiFi
const char* ssid     = "xxxxx";
const char* password = "xxxxx";

// Primary Connection String

static const char* connectionString = "xxxxxxxxx";

static bool hasIoTHub = false;

bool flag = false;

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}

Adafruit_MLX90614 mlx = Adafruit_MLX90614();

float correlation(float amb, float skin) {
  if (skin > 27 && skin < 36) {
    float realTemp = 0.71429 * skin - 0.35714 * amb + 23.14286;
    return realTemp;
  }
  return skin;
}

void temp(){
  float temp = correlation(mlx.readAmbientTempC(), mlx.readObjectTempC());
  if(temp>35 && counter<5){
  tempAVG+=temp;
  counter++;
  }
  if(counter==5){
    flag=true;
  }
  Serial.println(temp);
  delay(500);
}

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
  mlx.begin();
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
}

void loop() {
  //checkWifi();
  temp();
  if (flag)
  {
    Serial.println("Data");
    if (hasIoTHub)
    {
      String jsonSend = String(tempAVG/5);
      char buff[128];
      snprintf(buff, 128, string2char("{\"data\":[" + jsonSend + "],\"pat\":\"1\"}"));
      Esp32MQTTClient_SendEvent(buff);
      flag = false;
      tempAVG=0;
      counter = 0;
    }
  }
}
