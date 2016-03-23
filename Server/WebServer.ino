#include <SPI.h>
#include <Ethernet.h>
#include <EEPROM.h>

//pin 30 ประตูบ้าน

String payload = "";
int ledStatus = 0;
int state = 0;
int pin = 0;
boolean end = false;
boolean login = false;
/*
  39 ห้องนอนเล็ก
  33 พัดลมห้องนอนเล็ก
  43 ห้องนอนใหญ่
  35 พัดลมห้องนอนใหญ่
  41 ห้องนั่งเล่น
  48 ห้องเก็บของ
  53 ห้องครัว
  45 ห้องน้ำ
  23,25 ประตู
*/

int relay[] = {39, 33, 43, 35, 41, 48, 53};
char led[(sizeof(relay) / sizeof(int) * 2 ) + 1];
int lastIndex = sizeof(led) / sizeof(char);

byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFA, 0xEB
};
IPAddress ip(192, 168, 1, 2);

EthernetServer server(80);


void setup() {

  Serial.begin(9600);

  for (int i = 0; i < sizeof(relay) / sizeof(int); i++) {
    pinMode(relay[i], OUTPUT);
  }

  for (int i = 0; i < lastIndex; i++) {
    if (i % 2 != 0) {
      led[i] = '0';
    }
    else if (i == 0) {
      led[i] = '[';
    }
    else if (i == lastIndex - 1) {
      led[i] = ']';
    }
    else {
      led[i] = ',';
    }
  }


  for (int i = 0; i < sizeof(relay) / sizeof(int); i++) {
    int n = EEPROM.read(i);
     
     led[ (i * 2) + 1] = n + '0';

    if (n == 1) {

      digitalWrite(relay[i], HIGH);
    }
    else {
      digitalWrite(relay[i], LOW);
    }
  }

  while (!Serial) {}

  Ethernet.begin(mac, ip);
  server.begin();
  Serial.print("server is at ");

  Serial.println(Ethernet.localIP());
  Serial.println(led);
}

void loop() {
  //Serial.println(led);
  
  EthernetClient client = server.available();
  if (client) {
    Serial.println("new client");

    boolean currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();

        if(payload.length() < 100){
            
            payload += c;
        }else{
          //Serial.println(led);
          
          end = true;

          //Serial.println(payload);
          Serial.println("#########################################");
          String sub;
          String user;
          String pass;
          if(payload.indexOf("ON") > 0){
            sub = "ON";
            state = 1;
            ledStatus = 1;

          }
          else if(payload.indexOf("OFF") > 0){
            sub = "OFF";
            state = 1;
            ledStatus = 0;

          }
          else if(payload.indexOf("DOOR") > 0){
            sub = "DOOR";
            state = 2;
          }
          else if(payload.indexOf("CHECK") > 0){
            sub = "CHECK";
            state = 3;
          }
          else if(payload.indexOf("LOGIN/") > 0){
            //http://192.168.1.2/LOGIN/USER:JAME/PASS:1234
            user = "/USER:";
            pass = "/PASS:";          
            state = 4;
            
            user = payload.substring(payload.indexOf(user) + user.length(), payload.indexOf(pass));
            pass = payload.substring(payload.indexOf(pass) + pass.length(), payload.indexOf(" HTTP"));
            //Serial.println(payload.indexOf(user));
            Serial.println(user);
            Serial.println(pass);
            if(user == "JAME" && pass == "1234"){
              login = true;
            }
          }
          else{

            state = 5;
          }     
          

          switch(state){
            case 1:   
                      Serial.println("state 1");

                      //Serial.println(payload.substring(payload.indexOf(sub) + sub.length(), payload.indexOf(" HTTP")).toInt());
                      pin = payload.substring(payload.indexOf(sub) + sub.length(), payload.indexOf(" HTTP")).toInt();
                      digitalWrite(relay[pin], ledStatus);
                      led[(pin * 2) + 1] = ledStatus + '0';
                      EEPROM.write(pin, ledStatus);

                      break; 
            case 2:   
                      Serial.println("state 2"); 
                      break;
            case 3:   
                      Serial.println("state 3");  
                      break; 

            case 4:   
                      Serial.println("state 4");  
                    
                      break;   
            default: 
                      Serial.println("no error");
                      break;
          }
         
       

        }
   
        if (c == '\n' && currentLineIsBlank || end == true) {
          
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("Connection: close");
          client.println();
         
         if(state == 1 || state == 3){

          client.print(led);
          Serial.println(led);
         }
         else if(state == 4){

          client.print(login);
      
         }
         login = false;
         end = false;
         payload = "";
     
          break;
        }

        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        }
        else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      }
    }
    // give the web browser time to receive the data
    delay(1);
    // close the connection:
    client.stop();
    Serial.println("client disconnected");

  }
}



