// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import { Avatar, Flex } from '@fluentui/react-northstar'
import { Col, Row, Card, CardBody, Form, FormGroup, Input } from 'reactstrap';
import LineGraph2 from "./components/line2.js"
import ECG from './images/ecg.png';
import SAT from './images/sat.png';
import TEMP from './images/temp.png';

import p1 from './patients/1.jpg';
import p2 from './patients/2.PNG';
import p3 from './patients/3.PNG';
import p4 from './patients/4.PNG';
import p5 from './patients/5.PNG';

import './Calendar.css';

import * as microsoftTeams from "@microsoft/teams-js";

import Calendar from 'react-calendar';

var images = [p1, p2, p3, p4, p5]
const numbers = ["Patients", "Andrea Altamirano", "Satya Nadella", "Millie Gates", "Charlie Boy"];
const age = [Number.NaN, 21, 65, 56, 70];
const height = [Number.NaN, 4.9, 5.9, 6.4, 7.1];
const weight = [Number.NaN, 99, 165, 174, 175];

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

function todayCorr() {
    var today = new Date();
    var time = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
    return time
}

function avgArray(indat) {
    let total = 0;
    for (let i = 0; i < indat.length; i++) {
        total += parseFloat(indat[i]);
    }
    let avg = total / indat.length;
    avg = Math.round((avg + Number.EPSILON) * 100) / 100
    return (avg)
}


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec;
    return time;
}

class Htab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "",
            valuec: "",
            bpm: "+",
            so2: "+",
            temp: "+",
            data1: [],
            data2: [],
            data3: [],
            series1: [],
            series2: [],
            series3: [],
            imag: images[0],
            ages: age[0],
            heights: height[0],
            weights: weight[0],
            time: Math.floor(Date.now() / 1000) - todayCorr(),
            memdata: "",
            templabel: "F°",
            weightlabel: "lb",
            heightlabel: "ft",
            bmi: "+",
            range1: 42 * 1.8 + 32,
            range2: 35 * 1.8 + 32
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangec = this.handleChangec.bind(this);
    }


    componentDidMount() {
        microsoftTeams.getContext((context, error) => {
            this.setState({
                context: context
            });
        })
    }


    handleChange(event) {
        const temp = arrayContains(event.target.value, numbers)
        if (temp === 0) {

        }
        else {
            this.setState({
                value: event.target.value,
                weightlabel: "lb",
                heightlabel: "ft",
                templabel: "°F",
                imag: images[temp],
                patient: temp,
                ages: age[temp],
                heights: height[temp],
                weights: weight[temp],
                bmi: cround(703 * weight[temp] / Math.pow(height[temp] * 12, 2)),
                range1: 42 * 1.8 + 32,
                range2: 35 * 1.8 + 32
            });
        }
        var unirest = require('unirest');
        let _this = this
        unirest('GET', 'https://cosmoswr-apim.azure-api.net/cosmoswr/HttpTrigger1?name=' +
            event.target.value + '&oper=read')
            .headers({
                'Host': 'cosmoswr-apim.azure-api.net',
                'Ocp-Apim-Subscription-Key': 'ef9531e9f1ef4d6e89f1d8418956ac7e',
                'Ocp-Apim-Trace': 'true'
            })
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                if (res.raw_body !== "") {
                    let temp = res.raw_body.slice(0, -1).split(";")
                    let dataArray1 = []
                    let dataArray2 = []
                    let dataArray3 = []
                    let dateArray = []
                    for (let i = 0; i < temp.length; i++) {
                        let tempo = JSON.parse(temp[i])
                        let frame = tempo._ts - _this.state.time
                        console.log(frame)
                        if (frame < 86400 && tempo._ts >= _this.state.time) {
                            dateArray.push(timeConverter(tempo._ts))
                            dataArray1.push(tempo.bpm)
                            dataArray2.push(tempo.so2)
                            dataArray3.push(tempo.temp * 1.8 + 32)
                        }
                    }
                    _this.setState({
                        memdata: temp,
                        series1: dateArray.reverse(),
                        series2: dateArray.reverse(),
                        series3: dateArray.reverse(),
                        data1: dataArray1.reverse(),
                        data2: dataArray2.reverse(),
                        data3: dataArray3.reverse(),
                        bpm: avgArray(dataArray1),
                        so2: avgArray(dataArray2),
                        temp: avgArray(dataArray3)
                    })
                }
                else {
                    _this.setState({
                        memdata: temp,
                        data1: [],
                        data2: [],
                        data3: [],
                        series1: [],
                        series2: [],
                        series3: [],
                        bpm: "NA",
                        so2: "NA",
                        temp: "NA"
                    })
                }
            });
    }

    toogleSI() {
        let arrayTemp = []
        if (this.state.weightlabel === "lb") {
            for (let i = 0; i < this.state.data3.length; i++) {
                arrayTemp.push((this.state.data3[i] - 32) / 1.8)
            }
            this.setState({
                weightlabel: "kg",
                weights: cround(this.state.weights * 0.453592, 2),
                heightlabel: "m",
                heights: cround(this.state.heights * 0.3048, 2),
                templabel: "°C",
                temp: cround((this.state.temp - 32) / 1.8),
                range1: 42,
                range2: 35,
                data3: arrayTemp
            });
        }
        else {
            for (let i = 0; i < this.state.data3.length; i++) {
                arrayTemp.push(this.state.data3[i] * 1.8 + 32)
            }
            this.setState({
                weightlabel: "lb",
                weights: cround(this.state.weights / 0.453592, 2),
                heightlabel: "ft",
                heights: cround(this.state.heights / 0.3048, 2),
                templabel: "°F",
                temp: cround((this.state.temp * 1.8) + 32),
                range1: 42 * 1.8 + 32,
                range2: 35 * 1.8 + 32,
                data3: arrayTemp
            });
        }
    }

    handleChangec(event) {
        console.log(Date.parse(event) / 1000)
        this.setState({
            valuec: event,
            time: Date.parse(event) / 1000
        });
        if (this.state.memdata !== "") {
            let dataArray1 = []
            let dataArray2 = []
            let dataArray3 = []
            let dateArray = []
            for (let i = 0; i < this.state.memdata.length; i++) {
                let tempo = JSON.parse(this.state.memdata[i])
                let frame = tempo._ts - Date.parse(event) / 1000
                console.log(frame)
                if (frame < 86400 && tempo._ts >= Date.parse(event) / 1000) {
                    dateArray.push(timeConverter(tempo._ts))
                    dataArray1.push(tempo.bpm)
                    dataArray2.push(tempo.so2)
                    dataArray3.push(tempo.temp * 1.8 + 32)
                }
            }
            this.setState({
                series1: dateArray.reverse(),
                series2: dateArray.reverse(),
                series3: dateArray.reverse(),
                data1: dataArray1.reverse(),
                data2: dataArray2.reverse(),
                data3: dataArray3.reverse(),
                bpm: avgArray(dataArray1),
                so2: avgArray(dataArray2),
                temp: avgArray(dataArray3)
            })
        }
    }

    render() {

        return (
            <div style={{ padding: "1%" }}>
                <Row>
                    <Col>
                        <Row md="1">
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col xs="3" className="d-flex justify-content-around">
                                                <img style={{ filter: "grayscale(" + this.state.gray + ")" }} src={ECG} alt="Logo" />
                                            </Col>
                                            <Col xs="7">
                                                <LineGraph2 max={200} min={40} data={[this.state.data1, this.state.series1]} />
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
                                            <Col xs="3" className="d-flex justify-content-around">
                                                <img src={TEMP} alt="Logo" />
                                            </Col>
                                            <Col xs="7">
                                                <LineGraph2 max={this.state.range1} min={this.state.range2} data={[this.state.data3, this.state.series3]} />
                                            </Col>
                                            <Col xs="2">
                                                <Row md="1" className="h5" >
                                                    <Col className="d-flex justify-content-around">
                                                        Temp {this.state.templabel}
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
                    <Col>
                        <Card style={{ height: "80%" }}>
                            <CardBody>
                                <Flex gap="gap.small">
                                    <Avatar
                                        size="large"
                                        image={this.state.imag}
                                        label="Senior Accounts Orchestrator"
                                        name={""}
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
                                <Calendar
                                    onChange={this.handleChangec}
                                    value={this.state.valuec}
                                />
                            </CardBody>
                        </Card>
                        <Card onClick={() => this.toogleSI()}>
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
                                            Height [{this.state.heightlabel}]
                    </Col>
                                        <Col>
                                            {this.state.heights}
                                        </Col>
                                    </Col>
                                    <Col>
                                        <Col>
                                            Weight [{this.state.weightlabel}]
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
                                                this.state.bmi
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
export default Htab;