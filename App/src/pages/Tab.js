// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Avatar, Flex } from '@fluentui/react-northstar'
import { Col, Row, Card, CardBody, Form, FormGroup, Input } from 'reactstrap';
import LineGraph from "./components/line.js"
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

var mydata = ""

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
      example: "Text :("
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount() {
    this.setState({
      context: mydata
    });
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {
      console.log(context)
      this.setState({
        context: context
      });
    })

    // Next steps: Error handling using the error object
  }

  callbackFunction = (childData) => {
    console.log(childData)
    this.setState({
      example: childData
    })
  }

  handleChange(event) {
    const temp = arrayContains(event.target.value, numbers)
    this.setState({
      value: event.target.value,
      imag: images[temp],
      ages: age[temp],
      heights: height[temp],
      weights: weight[temp],
      patient: temp
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
          eventHubEndpoint={"Endpoint=xx.servicebus.windows.net/;SharedAccessKeyName=xxx;EntityPath=xxx"}
        />
        <Row>
          <Col>
            <Row md="1">
              <Col>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="3" className="d-flex justify-content-around">
                        <img src={ECG} alt="Logo" />
                      </Col>
                      <Col xs="7">
                        <LineGraph data={[this.state.data1, this.state.series1]} />
                      </Col>
                      <Col xs="2">
                        <Row md="1" className="h5">
                          <Col className="d-flex justify-content-around">
                            BPM
                          </Col>
                          <Col className="d-flex justify-content-around h1">
                            {this.state.vars[0]}
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
                        <LineGraph data={[this.state.data2, this.state.series2]} />
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
                        <LineGraph data={[this.state.data1, this.state.series1]} />
                      </Col>
                      <Col xs="2">
                        <Row md="1" className="h5" >
                          <Col className="d-flex justify-content-around">
                            Temp °F
                          </Col>
                          <Col className="d-flex justify-content-around h1">
                            {this.state.vars[2]}
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
                    tab2={"Pending...."}
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