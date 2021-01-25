// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Avatar, Flex } from '@fluentui/react-northstar'
import { Col, Row, Card, CardBody, Form, FormGroup, Input, CardTitle, CardText } from 'reactstrap';
import {
  isMobile
} from "react-device-detect";
import LineGraph from "./components/line.js"
import LineGraph2 from "./components/line2.js"
import ECG from './images/ecg.png';
import SAT from './images/sat.png';
import TEMP from './images/temp.png';

import MyEditor from "./components/MyEditor.js"

import p1 from './patients/1.jpg';
import p2 from './patients/2.PNG';
import p3 from './patients/3.PNG';
import p4 from './patients/4.PNG';
import p5 from './patients/5.png';

import TabsNav from "./components/tabs"

import IotReciever from "azure-reactjs-iot-hub-receiver/dist/iotreceiver"

var images = [p1, p2, p3, p4, p5]
const numbers = ["Patients", "Victor Altamirano", "Charlie Boy", "Millie Gates", "Pickle Rick"];
const age = [Number.NaN, 26, 65, 56, 70];
const height = [Number.NaN, 5.4, 6.2, 6.4, 7.1];
const weight = [Number.NaN, 178, 150, 174, 175];

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle);
}

function cround(num) {
  if (isNaN(num)) {
    return num
  }
  else {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}

var Fili = require('fili');

//  Instance of a filter coefficient calculator
var iirCalculator = new Fili.CalcCascades();

// calculate filter coefficients
var iirFilterCoeffs = iirCalculator.lowpass({
  order: 1, // cascade 3 biquad filters (max: 12)
  characteristic: 'bessel',
  Fs: 64, // sampling frequency
  Fc: 10, // cutoff frequency / center frequency for bandpass, bandstop, peak
  BW: 3, // bandwidth only for bandstop and bandpass filters - optional
  gain: 0, // gain for peak, lowshelf and highshelf
  preGain: false // adds one constant multiplication for highpass and lowpass
  // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
});

// create a filter instance from the calculated coeffs
var iirFilter = new Fili.IirFilter(iirFilterCoeffs);

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class Tab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'Patients',
      imag: images[0],
      ages: age[0],
      heights: height[0],
      weights: weight[0],
      vars: [Number.NaN, Number.NaN, Number.NaN],
      patient: 0,
      context: {},
      example: "Text :(",
      data1: [],
      datamem1: [],
      series1: [],
      memory1: [],
      data2: [],
      series2: [],
      data3: [],
      series3: [],
      temper: Number.NaN,
      bpm: Number.NaN,
      ibi: "+",
      sdnn: "+",
      sdsd: "+",
      rmssd: "+",
      pnn20: "+",
      pnn50: "+",
      hr_mad: "+",
      sd1: "+",
      sd2: "+",
      s: "+",
      sd1sd2: "+",
      br: "+",
      gray: 1
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkEKG() {
    if (this.state.memory1.length > 5000) {
      let _this = this
      let tempdata = ""
      for (var i = 0; i < this.state.memory1.length; i++) {
        tempdata += parseInt(this.state.memory1[i], 10) + ".0"
        if (i === this.state.memory1.length) {

        }
        else {
          tempdata += ","
        }
      }
      tempdata = tempdata.substring(0, tempdata.length - 1);

      console.log('{"data":"' + tempdata + '"}')

      var unirest = require('unirest');
      unirest('POST', 'https://xxxxxxxxxxxxxxxxxxxxx.net/ecg-api/ECG')
        .headers({
          'Host': 'xxxxxxxxxxxxxxxxxxxxx.net',
          'Ocp-Apim-Subscription-Key': 'xxxxxxxxxxxxxxxx',
          'Ocp-Apim-Trace': 'true'
        })
        .send('{"data":"' + tempdata + '"}')
        .end(function (res) {
          if (res.error) console.log(res.error);
          console.log(res.raw_body)

          let array = res.raw_body.replace("[", "").replace("]", "").replace(' ', "").replace('"', "")
          for (let k = 0; k < 25; k++) {
            array = array.replace(' ', "").replace('"', "")
          }
          array = array.split(",")
          for (let k = 0; k < array.length; k++) {
            array[k] = parseFloat(array[k], 10)
          }
          for (let k = 0; k < array.length; k++) {
            if (array[k] >= 100) {
              array[k] = array[k].toFixed(0)
            }
            else if (array[k] >= 1) {
              array[k] = array[k].toFixed(2)
            }
            else if (array[k] < 1) {
              array[k] = array[k].toFixed(4)
            }
          }
          for (let k = 0; k < array.length; k++) {
            array[k] = " " + (array[k].toString()).substring(0, 5);
          }

          _this.setState(
            {
              bpm: Math.round(array[1]),
              ibi: array[3],
              sdnn: array[5],
              sdsd: array[7],
              rmssd: array[9],
              pnn20: array[11],
              pnn50: array[13],
              hr_mad: array[15],
              sd1: array[17],
              sd2: array[19],
              s: array[21],
              sd1sd2: array[23],
              br: 2 * Math.round((parseInt(parseFloat(array[25]) * 60) + Number.EPSILON) * 100) / 100
            }
          )

        });
    }
    else {
      console.log("Wait For More Data...")
    }
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount() {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {
      console.log(context)
      this.setState({
        context: context
      });
    })
    setInterval(() => {
      if (this.state.memory1.length > 5000) {
        this.setState({
          gray: 0
        })
      }
    }, 5000);
    // Next steps: Error handling using the error object
  }

  callbackFunction = (childData) => {
    var indata = ""
    var inserie = ""
    var inmemory = ""
    var total = 0
    var avg = 0
    var i = ""
    console.log(parseInt(childData[0].body.pat))
    console.log(parseInt(this.state.patient))
    if (childData[0].systemProperties["iothub-connection-device-id"] === "ecg") {
      var temp = childData[0].body.data
      if (temp.length === 1) {
        temp = childData[0].body.data[0]
      }
      if (parseInt(childData[0].body.pat) === parseInt(this.state.patient)) {
        indata = this.state.datamem1
        inserie = this.state.series1
        inmemory = this.state.memory1

        for (i = 0; i < temp.length; i++) {
          indata.push(temp[i.toString()])
          inmemory.push(temp[i.toString()])
          inserie.push(".")
          if (indata.length > 1000) {
            indata.shift()
          }
          if (indata.length > 500) {
            inserie.shift()
          }
          if (inmemory.length > 10000) {
            inmemory.shift()
          }
        }

        indata = iirFilter.multiStep(indata)

        if (isMobile) {
          this.setState(
            {
              data1: indata.slice(0, 1000),
              datamem1: indata,
              series1: inserie,
              memory1: inmemory
            }
          )
        }
        else {
          this.setState(
            {
              data1: indata.slice(0, 500),
              datamem1: indata,
              series1: inserie,
              memory1: inmemory
            }
          )
        }
      }
    }
    else if (childData[0].systemProperties["iothub-connection-device-id"] === "satO") {
      const temp = childData[0].body.data
      if (parseInt(childData[0].body.pat) === parseInt(this.state.patient)) {
        indata = this.state.data2
        inserie = this.state.series2

        indata.push(temp)
        inserie.push(".")
        if (indata.length > 10) {
          indata.shift()
        }
        if (indata.length > 10) {
          inserie.shift()
        }

        total = 0;
        for (i = 0; i < indata.length; i++) {
          total += parseInt(indata[i]);
        }
        avg = Math.round(total / indata.length, 2);

        this.setState(
          {
            vars: [this.state.vars[0], avg, this.state.vars[2]],
            data2: indata.slice(0, 10),
            series2: inserie.slice(0, 10),
          }
        )

      }
    }
    else if (childData[0].systemProperties["iothub-connection-device-id"] === "temp") {
      const temp = childData[0].body.data
      if (parseInt(childData[0].body.pat) === parseInt(this.state.patient)) {
        indata = this.state.data3
        inserie = this.state.series3

        indata.push(temp)
        inserie.push(".")
        if (indata.length > 10) {
          indata.shift()
        }
        if (indata.length > 10) {
          inserie.shift()
        }

        total = 0;
        for (i = 0; i < indata.length; i++) {
          total += parseFloat(indata[i]);
        }
        avg = total / indata.length;
        avg = Math.round((avg + Number.EPSILON) * 100) / 100



        this.setState(
          {
            temper: avg,
            data3: indata.slice(0, 10),
            series3: inserie.slice(0, 10),
          }
        )
      }
    }
  }


  handleChange(event) {
    const temp = arrayContains(event.target.value, numbers)
    this.setState({
      value: event.target.value,
      imag: images[temp],
      ages: age[temp],
      heights: height[temp],
      weights: weight[temp],
      patient: temp,
      data1: [],
      datamem1: [],
      series1: [],
      memory1: [],
      data2: [],
      series2: [],
      data3: [],
      series3: [],
    });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {

    let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";

    return (
      <div style={{ padding: "1%" }}>
        <IotReciever
          callback={this.callbackFunction}
          eventHubConsumerGroup={"ConsumerGroupIoT"}
          eventHubEndpoint={"Endpoint=sb://xxxxxxxxxxxxxxxxx.servicebus.windows.net/;SharedAccessKeyName=xxxxxxxxxxxx;SharedAccessKey=xxxxxxxxxxxxxxxxxxxx=;EntityPath=xxxxxxxxxxxxxxx"}
        />
        <Row>
          <Col>
            <Row md="1">
              <Col>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="3" className="d-flex justify-content-around">
                        <img style={{ filter: "grayscale(" + this.state.gray + ")" }} src={ECG} alt="Logo" onClick={() => this.checkEKG()} />
                      </Col>
                      <Col xs="7">
                        <LineGraph max={2225} min={1750} data={[this.state.data1, this.state.series1]} />
                      </Col>
                      <Col xs="2">
                        <Row md="1" className="h5">
                          <Col className="d-flex justify-content-around">
                            BPM
                          </Col>
                          <Col className="d-flex justify-content-around h1">
                            {this.state.bpm}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="3" className="d-flex justify-content-around">
                        <img src={SAT} alt="Logo" />
                      </Col>
                      <Col xs="7">
                        <LineGraph2 max={100} min={70} data={[this.state.data2, this.state.series2]} />
                      </Col>
                      <Col xs="2">
                        <Row md="1" className="h5">
                          <Col className="d-flex justify-content-around ">
                            Sat %
                          </Col>
                          <Col className="d-flex justify-content-around h1">
                            {this.state.vars[1]}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <Row >
                      <Col xs="3" className="d-flex justify-content-around">
                        <img src={TEMP} alt="Logo" />
                      </Col>
                      <Col xs="7">
                        <LineGraph2 max={42} min={35} data={[this.state.data3, this.state.series3]} />
                      </Col>
                      <Col xs="2">
                        <Row md="1" className="h5" >
                          <Col className="d-flex justify-content-around">
                            Temp °F
                          </Col>
                          <Col className="d-flex justify-content-around h1">
                            {this.state.temper}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col>
            <Card style={{ height: "80%" }}>
              <CardBody>
                <Flex gap="gap.small">
                  <Avatar
                    size="large"
                    image={this.state.imag}
                    label="Senior Accounts Orchestrator"
                    name={userName}
                    status="unknown"
                  />
                  <Flex column>
                    <Form>
                      <FormGroup>
                        <Input type="select" name="select" id="exampleSelect" value={this.state.value} onChange={this.handleChange}>
                          {
                            numbers.map((number) => <option key={number}>{number}</option>)
                          }
                        </Input>
                      </FormGroup>
                    </Form>
                  </Flex>
                </Flex>
                <FormGroup>
                  <TabsNav
                    tab1={<MyEditor patient={this.state.patient} cookies={this.props.cookies} />}
                    tab2={
                      <Card>
                        <CardBody>
                          <CardTitle style={{ textAlign: "center", fontSize: "32px" }}>Analysis:</CardTitle>
                          <Row md="2">
                            <Col style={{ textAlign: "left", fontSize: "20px" }}>
                              <CardText>BreathsPM:{this.state.br}</CardText>
                              <div />
                              <CardText>IBI:{this.state.ibi}</CardText>
                              <div />
                              <CardText>SDNN:{this.state.sdnn}</CardText>
                              <div />
                              <CardText>SDSD:{this.state.sdsd}</CardText>
                              <div />
                              <CardText>RMSSD:{this.state.rmssd}</CardText>
                              <div />
                              <CardText>PNN20:{this.state.pnn20}</CardText>
                              <div />
                            </Col>
                            <Col style={{ textAlign: "left", fontSize: "20px" }}>
                              <CardText>PNN50:{this.state.pnn50}</CardText>
                              <div />
                              <CardText>HR_MAD:{this.state.hr_mad}</CardText>
                              <div />
                              <CardText>SD1:{this.state.sd1}</CardText>
                              <div />
                              <CardText>SD2:{this.state.sd2}</CardText>
                              <div />
                              <CardText>S:{this.state.s}</CardText>
                              <div />
                              <CardText>SD1SD2:{this.state.sd1sd2}</CardText>
                              <div />
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    }
                  />
                </FormGroup>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Row md="4" className="h5">
                  <Col>
                    <Col>
                      Age [years]
                    </Col>
                    <Col>
                      {this.state.ages}
                    </Col>
                  </Col>
                  <Col>
                    <Col>
                      Height [ft]
                    </Col>
                    <Col>
                      {this.state.heights}
                    </Col>
                  </Col>
                  <Col>
                    <Col>
                      Weight [lb]
                    </Col>
                    <Col>
                      {this.state.weights}
                    </Col>
                  </Col>
                  <Col>
                    <Col>
                      BMI
                    </Col>
                    <Col>
                      {
                        cround(703 * this.state.weights / Math.pow(this.state.heights * 12, 2))
                      }
                    </Col>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Tab;