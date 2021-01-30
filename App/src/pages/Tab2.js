// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Avatar, Flex } from '@fluentui/react-northstar'
import { Col, Row, Card, Form, FormGroup, Input } from 'reactstrap';
import {
    isMobile
} from "react-device-detect";
import ECG from './images/ecg.png';
import SAT from './images/sat.png';
import TEMP from './images/temp.png';
import p1 from './patients/1.jpg';
import p2 from './patients/2.PNG';
import p3 from './patients/3.PNG';
import p4 from './patients/4.PNG';
import p5 from './patients/5.PNG';

var images = [p1, p2, p3, p4, p5]
const numbers = ["Patients", "Andrea Altamirano","Satya Nadella", "Millie Gates", "Charlie Boy"];

function arrayContains(needle, arrhaystack) {
    return arrhaystack.indexOf(needle);
}

function apiCall(device, counter, pat) {
    var unirest = require('unirest');
    unirest('GET', 'https://xxxxxxxxxxxxxxxxxxxxxxxx' + device + '&ecgframe=' + counter + "&pat=" + pat)
        .headers({
            'Host': 'xxxxxxxxxxxxxxxxxxxxxx',
            'Ocp-Apim-Subscription-Key': 'xxxxxxxxxxxxxxxxxxxxxxx',
            'Ocp-Apim-Trace': 'true'
        })
        .end(function (res) {
            if (res.error) return "ERROR";
            return ("OK")
        });
}

var count = 0;

class Tab2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 'Patients',
            imag: images[0],
            patient: 0,
            context: {},
            gray1: 1,
            gray2: 1,
            gray3: 1
        }
        this.handleChange = this.handleChange.bind(this);
    }

    toggleEKG() {
        const temp = arrayContains(this.state.value, numbers)
        if (this.state.gray1 && temp !== 0) {
            this.setState({
                gray1: 0
            })
            this.intervalID1 = setInterval(() => {
                console.log(apiCall("ecg", count, temp) + "ECG")
                count = count + 1
                if (count > 39) {
                    count = 0
                }
            }, 1000);
        }
        else {
            this.setState({
                gray1: 1
            })
            clearInterval(this.intervalID1)
        }
    }
    toggleSAT() {
        const temp = arrayContains(this.state.value, numbers)
        if (this.state.gray2 && temp !== 0) {
            this.setState({
                gray2: 0
            })
            this.intervalID2 = setInterval(() => {
                console.log(apiCall("so2", count, temp) + "so2")
            }, 1000);
        }
        else {
            this.setState({
                gray2: 1
            })
            clearInterval(this.intervalID2)
        }
    }
    toggleTEMP() {
        const temp = arrayContains(this.state.value, numbers)
        if (this.state.gray3 && temp !== 0) {
            this.setState({
                gray3: 0
            })
            this.intervalID3 = setInterval(() => {
                console.log(apiCall("temp", count, temp) + "temp")
            }
                , 1000);
        }
        else {
            this.setState({
                gray3: 1
            })
            clearInterval(this.intervalID3)
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

    handleChange(event) {
        const temp = arrayContains(event.target.value, numbers)
        if (temp === 0) {
            //.......
        }
        else {
            clearInterval(this.intervalID1)
            clearInterval(this.intervalID2)
            clearInterval(this.intervalID3)
            this.setState({
                value: event.target.value,
                imag: images[temp],
                patient: temp,
                gray1: 1,
                gray2: 1,
                gray3: 1
            });
        }
    }

    render() {
        let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";
        if (isMobile) {
            return (
                <div style={{ padding: "1%", size: "100vh" }}>
                    <Row>
                        <Col>
                            <Card>
                                <Row md="1">
                                    <Col xs="12" style={{ paddingTop: "3%" }} className="d-flex justify-content-around">
                                        <Flex gap="gap.large">
                                            <Avatar
                                                size="large"
                                                image={this.state.imag}
                                                label="Senior Accounts Orchestrator"
                                                name={userName}
                                                status="unknown"
                                                styles={{ height: "10vh", width: "20vw" }}
                                            />
                                            <Flex column>
                                                <Form >
                                                    <FormGroup>
                                                        <Input style={{ height: "10vh", fontSize: "4rem" }} type="select" name="select" id="exampleSelect" value={this.state.value} onChange={this.handleChange}>
                                                            {
                                                                numbers.map((number) => <option key={number}>{number}</option>)
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                                </Form>
                                            </Flex>
                                        </Flex>
                                    </Col>
                                    <p />
                                    <Col xs="12" className="d-flex justify-content-around">
                                        <img style={{ height: "22vh", filter: "grayscale(" + this.state.gray1 + ")" }} src={ECG} alt="Logo" onClick={() => this.toggleEKG()} />
                                    </Col>
                                    <p />
                                    <Col xs="12" className="d-flex justify-content-around">
                                        <img onClick={() => this.toggleSAT()} style={{ height: "25vh", filter: "grayscale(" + this.state.gray2 + ")" }} src={SAT} alt="Logo" />
                                    </Col>
                                    <p />
                                    <Col xs="12" className="d-flex justify-content-around">
                                        <img style={{ height: "25vh", filter: "grayscale(" + this.state.gray3 + ")" }} onClick={() => this.toggleTEMP()} src={TEMP} alt="Logo" />
                                    </Col>
                                </Row>
                            </Card>
                        </Col >
                    </Row >
                </div >
            );
        }
        else {
            return (
                <div style={{ padding: "1%" }}>
                    <Row>
                        <Col>
                            <Card>
                                <Row md="4">
                                    <Col xs="3" style={{ paddingTop: "3%" }} className="d-flex justify-content-around">
                                        <Flex gap="gap.small">
                                            <Avatar
                                                size="large"
                                                image={this.state.imag}
                                                label="Senior Accounts Orchestrator"
                                                name={userName}
                                                status="unknown"
                                                styles={{ height: "10vh", width: "5vw" }}
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
                                    </Col>
                                    <Col xs="3" className="d-flex justify-content-around">
                                        <img style={{ filter: "grayscale(" + this.state.gray1 + ")" }} src={ECG} alt="Logo" onClick={() => this.toggleEKG()} />
                                    </Col>

                                    <Col xs="3" className="d-flex justify-content-around">
                                        <img onClick={() => this.toggleSAT()} style={{ filter: "grayscale(" + this.state.gray2 + ")" }} src={SAT} alt="Logo" />
                                    </Col>

                                    <Col xs="3" className="d-flex justify-content-around">
                                        <img style={{ filter: "grayscale(" + this.state.gray3 + ")" }} onClick={() => this.toggleTEMP()} src={TEMP} alt="Logo" />
                                    </Col>
                                </Row>
                            </Card>
                        </Col >
                    </Row >
                </div >
            );
        }
    }
}
export default Tab2;