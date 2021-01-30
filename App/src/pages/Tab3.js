// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Col, Row, Card, CardBody, Form, FormGroup, Input } from 'reactstrap';
import {
    isMobile
} from "react-device-detect";
import ECG from './images/ecg.png';
import SAT from './images/sat.png';
import TEMP from './images/temp.png';

import IotReciever from "azure-reactjs-iot-hub-receiver/dist/iotreceiver"

class Tab3 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 'PatientID',
            temp: "+",
            so2: "+",
            bpm: "+",
            patient: "PatientCode3",
            context: {},
            gray1: 1,
            gray2: 1,
            gray3: 1,
            data1: [],
            datamem1: [],
            series1: [],
            memory1: [],
            data2: [],
            series2: [],
            data3: [],
            series3: [],
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {

        this.setState({
            value: event.target.value
        });
    }

    callbackFunction = (childData) => {
        var indata = ""
        var inserie = ""
        var total = 0
        var avg = 0
        var i = ""
        console.log(parseInt(childData[0].body.pat))
        console.log(parseInt(this.state.value.substring(this.state.value.length - 1, this.state.value.length)))
        if (childData[0].systemProperties["iothub-connection-device-id"] === "ecg") {
            this.setState(
                {
                    gray1: 0
                }
            )

        }
        else if (childData[0].systemProperties["iothub-connection-device-id"] === "satO") {
            const temp = childData[0].body.data[0]
            if (parseInt(childData[0].body.pat) === parseInt(this.state.value.substring(this.state.value.length - 1, this.state.value.length))) {
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
                        so2: avg,
                        data2: indata.slice(0, 10),
                        series2: inserie.slice(0, 10),
                        gray2: 0,
                        bpm: childData[0].body.data[1]
                    }
                )

            }
        }
        else if (childData[0].systemProperties["iothub-connection-device-id"] === "temp") {
            const temp = childData[0].body.data
            if (parseInt(childData[0].body.pat) === parseInt(this.state.value.substring(this.state.value.length - 1, this.state.value.length))) {
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
                        temp: avg,
                        data3: indata.slice(0, 10),
                        series3: inserie.slice(0, 10),
                        gray3: 0
                    }
                )
            }
        }
    }

    componentDidMount() {
        microsoftTeams.getContext((context, error) => {
            console.log(context)
            this.setState({
                context: context
            });
        })
    }

    render() {
        if (isMobile) {
            return (
                <div style={{ padding: "1%" }}>
                    <IotReciever
                        callback={this.callbackFunction}
                        eventHubConsumerGroup={"ConsumerGroupIoT"}
                        eventHubEndpoint={"Endpoint=sb://iothub-ns-iot-hub-mo-7500432-40ed126299.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=1PXO0tERraEC8gasBHhXaK5The0p7n6RwZ6q+twarMw=;EntityPath=iot-hub-monitor-1"}
                    />
                    <Row>
                        <Col>
                            <Row md="1">
                                <Col>
                                    <Form>
                                        <FormGroup>
                                            <Input style={{ fontSize: "5rem" }} type="email" name="email" id="exampleEmail" placeholder="with a placeholder" value={this.state.value} onChange={this.handleChange} />
                                        </FormGroup>
                                    </Form>
                                    <Card>
                                        <CardBody>
                                            <Row>
                                                <Col xs="6" className="d-flex justify-content-around ">
                                                    <img style={{ width: "20vh", filter: "grayscale(" + this.state.gray1 + ")" }} src={ECG} alt="Logo" onClick={() => this.checkEKG()} />
                                                </Col>
                                                <Col xs="6">
                                                    <Row md="1" style={{ fontSize: "5rem" }}>
                                                        <Col className="d-flex justify-content-around">
                                                            BPM
                              </Col>
                                                        <Col className="d-flex justify-content-around">
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
                                                <Col xs="6" className="d-flex justify-content-around">
                                                    <img style={{ height: "22vh", filter: "grayscale(" + this.state.gray2 + ")" }} src={SAT} alt="Logo" />
                                                </Col>
                                                <Col xs="6">
                                                    <Row md="1" style={{ fontSize: "5rem" }}>
                                                        <Col className="d-flex justify-content-around ">
                                                            Sat %
                              </Col>
                                                        <Col className="d-flex justify-content-around ">
                                                            {this.state.so2}
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
                                                <Col xs="6" className="d-flex justify-content-around">
                                                    <img style={{ height: "22vh", filter: "grayscale(" + this.state.gray3 + ")" }} src={TEMP} alt="Logo" />
                                                </Col>
                                                <Col xs="6">
                                                    <Row md="1" style={{ fontSize: "5rem" }} >
                                                        <Col className="d-flex justify-content-around">
                                                            Temp °F
                              </Col>
                                                        <Col className="d-flex justify-content-around">
                                                            {this.state.temp}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div >
            );
        }
        else {
            return (
                <div style={{ padding: "1%" }}>
                    <IotReciever
                        callback={this.callbackFunction}
                        eventHubConsumerGroup={"ConsumerGroupIoT"}
                        eventHubEndpoint={"Endpoint=sb://iothub-ns-iot-hub-mo-7500432-40ed126299.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=1PXO0tERraEC8gasBHhXaK5The0p7n6RwZ6q+twarMw=;EntityPath=iot-hub-monitor-1"}
                    />
                    <Row>
                        <Col>
                            <Row md="1">
                                <Col>
                                    <Form>
                                        <FormGroup>
                                            <Input style={{ fontSize: "1.5rem" }} type="email" name="email" id="exampleEmail" placeholder="with a placeholder" value={this.state.value} onChange={this.handleChange} />
                                        </FormGroup>
                                    </Form>
                                    <Card>
                                        <CardBody>
                                            <Row>
                                                <Col xs="6" className="d-flex justify-content-around">
                                                    <img style={{ filter: "grayscale(" + this.state.gray1 + ")" }} src={ECG} alt="Logo" onClick={() => this.checkEKG()} />
                                                </Col>
                                                <Col xs="6">
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
                                                <Col xs="6" className="d-flex justify-content-around">
                                                    <img style={{ filter: "grayscale(" + this.state.gray2 + ")" }} src={SAT} alt="Logo" />
                                                </Col>
                                                <Col xs="6">
                                                    <Row md="1" className="h5">
                                                        <Col className="d-flex justify-content-around ">
                                                            Sat %
                              </Col>
                                                        <Col className="d-flex justify-content-around h1">
                                                            {this.state.so2}
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
                                                <Col xs="6" className="d-flex justify-content-around">
                                                    <img style={{ filter: "grayscale(" + this.state.gray3 + ")" }} src={TEMP} alt="Logo" />
                                                </Col>
                                                <Col xs="6">
                                                    <Row md="1" className="h5" >
                                                        <Col className="d-flex justify-content-around">
                                                            Temp °F
                              </Col>
                                                        <Col className="d-flex justify-content-around h1">
                                                            {this.state.temp}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div >
            );
        }
    }
}
export default Tab3;