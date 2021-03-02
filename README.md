# Smart-Check-up:

Telemedicine smart platform with integration to IoT devices that provides vital signs in real-time.

- [Smart-Check-up:](#smart-check-up)
- [Introduction:](#introduction)
- [Solution:](#solution)
- [Materials:](#materials)
- [Connection Diagram:](#connection-diagram)
- [Laptop Test:](#laptop-test)
  - [Environment Creation:](#environment-creation)
    - [Pytorch](#pytorch)
    - [Dependencies](#dependencies)
    - [Jupyter Notebook](#jupyter-notebook)
- [Summary and mini demos:](#summary-and-mini-demos)
  - [Drowsiness Monitor:](#drowsiness-monitor)
  - [Driving Monitor:](#driving-monitor)
  - [Emotion Monitor:](#emotion-monitor)
- [Jetson Nano Setup:](#jetson-nano-setup)
- [The Final Product:](#the-final-product)
    - [Epic DEMO:](#epic-demo)
- [Commentary:](#commentary)
  - [References:](#references)


# Introduction:

<img src="IMAGEN1" width="1000">

<img src="IMAGEN2" width="1000">

<img src="IMAGEN3" width="1000">

# Solution:

Creamos una App para Microsoft Teams que se basa en una plataforma IoT de monitoreo en tiempo real de los pacientes durante sus consultas. 

<img src="https://i.gifer.com/origin/7d/7d5a3e577a7f66433c1782075595f4df_w200.gif" width="1000">

<img src="https://thumbsnap.com/s/Wy5w7JPR.jpg?1205" width="600">


<img src="https://i.ibb.co/xX4G7Yd/dondraper-car.gif" width="1000">

Current Solutions:



# Materials:

Hardware:
- ESP32.                                            x3.
https://www.adafruit.com/product/3405
- Ad8232 EKG sensor.                                            x1.
https://www.amazon.com/-/es/m%C3%B3dulo-ad8232-ECG-Medici%C3%B3n-Coraz%C3%B3n-Vigilancia/dp/B0722Y8YC6?language=en_US
- MAX30102 Blood Oxygen Concentration Sensor.                                          x1.
https://www.amazon.com/dp/B07SVYDX9M/ref=cm_sw_em_r_mt_dp_-9KdGb2VVX9A9
- MLX90614ESF Non-contact Infrared Temperature Sensor Module. x1.
https://www.amazon.com/dp/B071VF2RWM/ref=cm_sw_em_r_mt_dp_c.KdGbEJHN5BB

Software:
- Microsoft Teams:
https://www.microsoft.com/en-us/microsoft-teams/group-chat-software/
- ReactJS:
https://reactjs.org/
- VScode:
https://code.visualstudio.com/
    - Extension:
  https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension

Azure Services:

- Azure DevOps:
https://azure.microsoft.com/en-us/services/devops/
- API Management:
https://azure.microsoft.com/en-us/services/api-management/
- App Service:
https://azure.microsoft.com/en-us/services/app-service/
- Azure IoT Hub:
https://azure.microsoft.com/en-us/services/iot-hub/
- Azure Functions:
https://azure.microsoft.com/en-us/services/functions/

# Connection Diagram:

This is the connection diagram of the system:

<img src="https://i.ibb.co/Bqq3p6b/Esquema.png" width="1000">

# Laptop Test:

To test the code on a computer, the first step will be to have a python environments manager, such as Python Anaconda.

https://www.anaconda.com/distribution/

## Environment Creation:

### Pytorch

First we will create a suitable enviroment for pytorch.

    conda create --name pytorch

To activate the enviroment run the following command:

    activate pytorch

In the case of Anaconda the PyTorch page has a small widget that allows you to customize the PyTorch installation code according to the operating system and the python environment manager, in my case the configuration is as follows.

https://pytorch.org/

<img src="https://i.ibb.co/6RMJp5F/image.png" width="800">

    conda install pytorch torchvision cudatoolkit=10.2 -c pytorch
    
### Dependencies
    
The other packages we need are the following:

    pip install opencv-python matplotlib tqdm python-vlc Pillow
    
Anyway we attach the file requirements.txt where all packages come in our environment.

### Jupyter Notebook

Inside the **Drowsiness**, **Emotion detection** and **YoloV3** folders, you will find a file "Notebook.ipynb" which contains the code to run the programs in jupyter notebook, however I attach in each folder a file called "notebook.py" with the code in format **. py **.

    conda install -c conda-forge notebook

Command to start jupyter notebook

    jupyter notebook

# Summary and mini demos:

All the demos that we are going to show are executed from a jupyter notebook and are focused on showing the functionality of the AI models, the demo with the hardware is shown at the end of the repository. [Demo](#epic-demo)

## Drowsiness Monitor:

La funcion de esta modelo es realizar una deteccion de distraccion o cerrado de ojos del conductor por mas de 2 segundos o esta distraido del camino (ejemplo, mirando el celular).

<img src="https://i.ibb.co/sQVStkj/Esquema-3.png" width="1000">

Details: https://github.com/altaga/DBSE-monitor/blob/master/Drowsiness

Video: Click on the image
[![Torch](https://i.ibb.co/4mx4LPK/Logo.png)](https://youtu.be/dircJ37T0fs)

## Driving Monitor:

La funcion de esta modelo es realizar una deteccion objetos que esten a menos de 3 metros del auto en el punto ciego.

<img src="https://i.ibb.co/Xpd9rs8/Esquema-2.png" width="1000">

Details: https://github.com/altaga/DBSE-monitor/blob/master/YoloV3

Video: Click on the image
[![Torch](https://i.ibb.co/4mx4LPK/Logo.png)](https://youtu.be/95eDav-Smks)

## Emotion Monitor:

La funcion de esta modelo es detectar las emociones del conductor en todo momento y mediante respuestas musicales (canciones) tratar de corregir el estado mental de el conductor con el fin de mantenerlo neutral o feliz.

<img src="https://i.ibb.co/dkfMKh7/Esquema-5.png" width="1000">

Details: https://github.com/altaga/DBSE-monitor/blob/master/Emotion%20detection

Video: Click on the image
[![Torch](https://i.ibb.co/4mx4LPK/Logo.png)](https://youtu.be/BWWdUta6gsY)

# Jetson Nano Setup:

The setup process to run everything on the jetson nano are in this folder:

https://github.com/altaga/DBSE-monitor/tree/master/Jetson


# The Final Product:

Product:

<img src="https://i.ibb.co/hK6Y0pM/68747470733a2f2f692e6962622e636f2f674a42346636522f32303230303231302d3231323731342e6a7067.jpg" width="800">
<img src="https://i.ibb.co/WFKx2DC/68747470733a2f2f692e6962622e636f2f393974436d74382f57686174732d4170702d496d6167652d323032302d30332d31.jpg" width="800">

Product installed inside the car:

<img src="https://i.ibb.co/yQgJGfk/Whats-App-Image-2020-03-16-at-14-03-07-1.jpg" width="800">
<img src="https://i.ibb.co/hXvWmbf/68747470733a2f2f692e6962622e636f2f364a356a5342352f57686174732d4170702d496d6167652d323032302d30332d31.jpg" width="800"> 

Notifications:

<img src="https://i.ibb.co/VNWzJ37/Screenshot-20200210-212306-Messages.jpg" width="600">

### Epic DEMO:

Video: Click on the image
[![Car](https://i.ibb.co/4mx4LPK/Logo.png)](https://youtu.be/rNhcBHKiGik)

Sorry github does not allow embed videos.

# Commentary:

I would consider the product finished as we only need a little of additional touches in the industrial engineering side of things for it to be a commercial product. Well and also a bit on the Electrical engineering perhaps to use only the components we need. That being said this functions as an upgrade from a project that a couple friends and myself are developing and It was ideal for me to use as a springboard and develop the idea much more. This one has the potential of becoming a commercially available option regarding Smart cities as the transition to autonomous or even smart vehicles will take a while in most cities.

That middle ground between the Analog, primarily mechanical-based private transports to a more "Smart" vehicle is a huge opportunity as the transition will take several years and most people are not able to afford it. Thank you for reading.

## References:

Links:

(1) https://medlineplus.gov/healthysleep.html

(2) http://www.euro.who.int/__data/assets/pdf_file/0008/114101/E84683.pdf

(3) https://dmv.ny.gov/press-release/press-release-03-09-2018

(4) https://www.nhtsa.gov/risky-driving/drowsy-driving

(5) https://www.nhtsa.gov/risky-driving/speeding

