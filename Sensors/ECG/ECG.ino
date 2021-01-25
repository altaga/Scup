#include <WiFi.h>
#include "Esp32MQTTClient.h"

#define packageSize 250
#define ESP_getChipId()   ((uint32_t)ESP.getEfuseMac())

int hrArray[packageSize * 2];
int counter = 0;

// Please input the SSID and password of WiFi
const char* ssid     = "xxxxxxx";
const char* password = "xxxxxxxxxx";

// Primary Connection String

static const char* connectionString = "HostName=xxxx;DeviceId=xxxxx;SharedAccessKey=xxxxxxx";

static bool hasIoTHub = false;

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}

volatile int interruptCounter;
int totalInterruptCounter;

hw_timer_t * timer = NULL;
portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

void IRAM_ATTR onTimer() {
  portENTER_CRITICAL_ISR(&timerMux);
  int sensorValue = analogRead(A2);
  hrArray[counter] = sensorValue;
  counter++;
  portEXIT_CRITICAL_ISR(&timerMux);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting connecting WiFi.");
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  if (!Esp32MQTTClient_Init((const uint8_t*)connectionString))
  {
    hasIoTHub = false;
    return;
  }
  hasIoTHub = true;
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 4000, true);
  timerAlarmEnable(timer);
}

void loop() {
  if (counter > packageSize) {
    if (hasIoTHub)
    {
      String jsonSend = "";
      for (int i = 0; i < counter; i++) {
        jsonSend += String(hrArray[i]);
        if (i != (counter - 1)) {
          jsonSend += ",";
        }
      }
      counter = 0;
      char buff[2048];
      snprintf(buff, 2048, string2char("{\"data\":[" + jsonSend + "]}"));
      Esp32MQTTClient_SendEvent(buff);
      
    }
  }
}
