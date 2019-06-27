import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import {Tabs,Tab,InputGroup} from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import ProgressBar from 'react-bootstrap/ProgressBar'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range';
import Alert from 'react-bootstrap/Alert'
import './App.css';
import './loginpage/Toggle.css'
import store from 'store'
import {Link, NavLink, Redirect,withRouter} from 'react-router-dom';
import hashmap from "hashmap";
import CompareInfo from "./components/CompareInfo";
import axios from "axios";

class home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: store.get('email'),
            state: 19,
            targetDistrictNumber:10,
            equality: 5,
            fairness :5,
            compactness : 5,
            majorMinorWeight : 5,
            competitiveness :5,
            efficiencyGpa :5,
            numOfRun:1,
            maxMajorMinorPercent : 50,
            minMajorMinorPercent: 0,
            desiredNumMajorMinorDistrict: 0,
            interestCommunity : 'Community of Interest',
            phase: 'Start',
            text : "",
            startDisable: false,
            compactnessMethod: 'Select compactness',
            mapHistory : [],
            selectedMap : 'Select Map',
            summary :'',
            changeMeasures: ''
        };

        this.clickOnStart = this.clickOnStart.bind(this);
        this.setNumOfDistrict = this.setNumOfDistrict.bind(this);
        this.setNumOfMajorMinor = this.setNumOfMajorMinor.bind(this);
        this.setNumOfBatchRun = this.setNumOfBatchRun.bind(this);
        this.logout = this.logout.bind(this);
        this.setSelectedInterest = this.setSelectedInterest.bind(this);
        this.clickOnCompare = this.clickOnCompare.bind(this);
        this.clickOnCompareWithOriginal = this.clickOnCompareWithOriginal.bind(this)
        this.updateMapHistory = this.updateMapHistory.bind(this)
        this.setSelectedMap = this.setSelectedMap.bind(this)
        this.saveMap = this.saveMap.bind(this)
        this.loadMap = this.loadMap.bind(this)
        this.deleteMap = this.deleteMap.bind(this)
        this.startBatchRun = this.startBatchRun.bind(this)
        this.setRadio = this.setRadio.bind(this)
    }
    setRadio(e){
        console.log(e.target.value)
        this.setState({
            changeMeasures : e.target.value
        })
    }
    updateMapHistory(){
        let mapList = [];
        console.log(store.get('user'))
        axios.post('http://localhost:8080/homepage/getMap',store.get('user'))
            .then(request =>{
                mapList = request.data.map((map) => {
                    console.log(map)
                    return <Dropdown.Item onClick={()=> this.setSelectedMap(map) }>{map}</Dropdown.Item>
                })
                this.setState({
                    mapHistory : mapList
                });
            })
    }
    setSelectedMap(map){
        this.setState({
            selectedMap : map
        })
    }
    saveMap(e){
        this.props.socket.emit('saveMap',()=>{
            this.updateMapHistory()
        })
    }
    loadMap(e){
        this.props.socket.emit('loadMap',this.state.selectedMap)
    }
    deleteMap(e){
        if(this.state.selectedMap !== 'Select Map') {
            this.props.socket.emit('deleteMap', this.state.selectedMap, ()=>{
                this.setState({
                    selectedMap :'Select Map'
                })
                this.updateMapHistory()
            })


        }
    }
    clickOnCompare(e){
        console.log(this.props.compareList)
        ReactDOM.render(<CompareInfo compareList ={this.props.compareList}/>,document.getElementById("summaryResult"))
    }
    logout(e){
        this.props.history.push("/")
        store.remove('loggedIn')
    }
    clickOnCompareWithOriginal(e){

    }
    setSelectedInterest(s){
        this.setState({
            interestCommunity : s
        })
    }
    startBatchRun(e){
        this.props.socket.emit('runAlgorithm', this.state)
    }
    clickOnStart(e){
        if(e.target.value === 'Start') {
            this.props.socket.emit('runAlgorithm', this.state)
            this.setState({
                phase : 'Next'
            })
        }else if(e.target.value === 'Next'){
            this.props.socket.emit('resume')
        }else if(e.target.value === 'Phase two'){
            this.props.socket.emit('resume')
            this.setState({
                startDisable : true
            })
        }else if(e.target.value === 'stop'){
            this.props.socket.emit('stop')
        }else if(e.target.value === 'pause'){
            this.props.socket.emit('pause')
        }else if(e.target.value === 'resume'){
            this.props.socket.emit('resume')
        }

    }
    setSelectedCompactnessMethod(s){
        this.setState({
            compactnessMethod : s
        })

    }
    setNumOfDistrict(e){
        this.setState({
            targetDistrictNumber : e.target.value
        })
    }
    setNumOfMajorMinor(e){
        this.setState({
            desiredNumMajorMinorDistrict : e.target.value
        })
    }
    setNumOfBatchRun(e){
        this.setState({
            numOfRun : e.target.value
        })
    }
    componentDidMount() {
        this.updateMapHistory()
        this.props.socket.on('message', (data)=> {
          this.setState({
              text: this.state.text +'\n'+ data
          })
        });
        this.props.socket.on('Phase two', (data)=> {
            this.setState({
                phase: 'Phase two'
            })
        });
        this.props.socket.on('summary', (data)=> {
            this.updateMapHistory()
            this.setState({
                summary: data
            })
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.selectedState !== this.props.selectedState){
            if(this.props.selectedState === 'New Mexico'){
                this.setState({
                    state : 35
                })
            }else if(this.props.selectedState=== 'Iowa'){
                this.setState({
                    state : 19
                })
            }else if(this.props.selectedState === 'Pennsylvania'){
                this.setState({
                    state : 42
                })
            }
        }
        this.textarea.scrollTop = this.textarea.scrollHeight;

    }
    render() {
        console.log(!store.get('loggedIn'))
        if(!store.get('loggedIn')){
            return <Redirect to="/sign-in" />
        }
        return (
            <div>
                <Container>
                    <Row>
                        <Tabs defaultActiveKey="basicRun" >
                            <Tab variant = "pills"eventKey="basicRun" title="Basic Setting">
                                <Row style={{margin:10}}><Col>
                                    <Dropdown >
                                        <Dropdown.Toggle style={{width:210}} variant="outline-light" id="dropdown-basic">
                                            {this.props.selectedState}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>{this.props.setSelectedState('New Mexico');}}>New Mexico</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.props.setSelectedState('Iowa');}}>Iowa</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.props.setSelectedState('Pennsylvania');}}>Pennsylvania</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col><Col>
                                    <Button style={{width:100}} variant="outline-light" onClick={this.logout}>Log Out</Button>
                                </Col>
                                </Row>
                                <Row style={{margin:10}}><Col>
                                    <Dropdown>
                                        <Dropdown.Toggle style={{width:210}} variant="outline-light" id="dropdown-basic">
                                            {this.state.selectedMap}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {this.state.mapHistory}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col><Col>
                                    <Button style={{width:100}} variant="outline-light" onClick={this.saveMap}>Save Map</Button>
                                </Col></Row>
                                <Row style={{margin:10}}><Col>
                                    <Dropdown>
                                        <Dropdown.Toggle style={{width:210}} variant="outline-light" id="dropdown-basic">
                                            {this.state.interestCommunity}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('WHITE');}}>White</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('AFRICANAMERICAN');}}>African-American</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('ASIAN');}}>Asian</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('HISPANIC');}}>Hispanic</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('HAWAIIAN');}}>Hawaiian</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedInterest('OTHER');}}>Other</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col><Col>
                                        <Button style={{width:100}} variant="outline-light" onClick={this.loadMap}>Load Map</Button>
                                </Col></Row>
                                <Row style={{margin:10}}><Col>
                                    <Dropdown>
                                        <Dropdown.Toggle style={{width:210}} variant="outline-light" id="dropdown-basic">
                                            {this.state.compactnessMethod}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>{this.setSelectedCompactnessMethod('PolsbyPopper');}}>PolsbyPopper</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>{this.setSelectedCompactnessMethod('Schwartzberg');}}>Schwartzberg</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col><Col>
                                        <Button style={{width:100}} variant="outline-light" onClick={this.deleteMap}>Delete Map</Button>
                                </Col></Row>
                                <Row style={{'margin-top':20}}>
                                    <Col sm={4}>
                                            TargetDistrict:

                                    </Col>
                                    <Col sm={3}>
                                        <Form.Control type="number"  value = {this.state.targetDistrictNumber} onChange={this.setNumOfDistrict}/>
                                    </Col>
                                    <Col>
                                        <Button style={{width:100}} variant="outline-light" onClick={()=>{
                                            this.props.socket.emit('saveLog')
                                        }}>Save Log</Button>
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':20}}>
                                    <Col sm={4}>
                                        TargetMajorMinor:
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Control type="number"  value = {this.state.desiredNumMajorMinorDistrict} onChange={this.setNumOfMajorMinor}/>
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':20}}>
                                    <Col sm={4}>

                                            MinMajorMinor:

                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={100}
                                            minValue={0}
                                            value={this.state.minMajorMinorPercent}
                                            onChange={value => this.setState({minMajorMinorPercent: value})} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':20}}>
                                    <Col sm={4}>

                                            MaxMajorMinor:

                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={100}
                                            minValue={0}
                                            value={this.state.maxMajorMinorPercent}
                                            onChange={value => this.setState({ maxMajorMinorPercent : value})} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':20}}>
                                    <Col sm={4}>

                                            Population Equality:
                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.equality}
                                            onChange={value => this.setState({ equality : value})} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Col sm={4}>

                                            Partition Fairness:

                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.fairness}
                                            onChange={value => this.setState({ fairness:value })} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Col sm={4}>

                                            Compactness:
                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.compactness}
                                            onChange={value => this.setState({ compactness: value })} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Col sm={4}>

                                            MajorMinor:
                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.majorMinorWeight}
                                            onChange={value => this.setState({  majorMinorWeight: value })} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Col sm={4}>

                                            EfficiencyGpa

                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.efficiencyGpa}
                                            onChange={value => this.setState({ efficiencyGpa: value })} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Col sm={4}>
                                            Competitive:

                                    </Col>
                                    <Col sm={8}>
                                        <InputRange
                                            maxValue={10}
                                            minValue={0}
                                            value={this.state.competitiveness}
                                            onChange={value => this.setState({ competitiveness: value })} />
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':30}}>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} disabled = {this.state.startDisable} value = {this.state.phase} onClick={this.clickOnStart}>{this.state.phase}</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} value = 'stop' onClick={this.clickOnStart}>Stop</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} value = 'pause' onClick={this.clickOnStart} >Pause</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} value = 'resume' onClick={this.clickOnStart}>Resume</Button></Col>
                                </Row>
                                <Row style={{'margin-top':20}}>
                                    <Button disable variant="outline-light" style={{width:70, 'font-size': '0.8em'}} disabled>Console:</Button>
                                    <Form style={{'margin-top':10, fontSize: '0.5em'}}>
                                        <Form.Group controlId="exampleForm.ControlTextarea1" >
                                            <Form.Control ref = {(el)=>this.textarea = el} as="textarea" style={{width:'400px',height:'130px','background-color':'black',opacity:1,color:'white','font-size': '12px'}} value = {this.state.text} disabled />
                                        </Form.Group>
                                    </Form>
                                </Row>
                                <Row style={{'margin-top':10}}>
                                    <Button variant="outline-light" style={{width:160, 'font-size': '0.8em'}} disabled>Estimated Time: 2m 3s:</Button>
                                </Row>
                                <ProgressBar variant="dark" style={{'margin-top':10}} animated now={45} />
                            </Tab>
                            <Tab eventKey="batch run" title="Batch Run Setting">
                                <Row style={{'margin-top':30}}>
                                <Col>
                                    <Button variant="outline-light" style={{width:100, 'font-size': '0.8em'}} disabled>
                                        Number Of Run:
                                    </Button>
                                </Col>
                                    <Col>
                                        <Form.Control type="number"  value = {this.state.numOfRun} onChange={this.setNumOfBatchRun}/>
                                    </Col>
                                </Row>
                                <Row style={{'margin-top':30}}>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}}  onClick={this.startBatchRun}>Batch Run</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}}  onClick={this.clickOnStart}>Stop</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}}  onClick={this.clickOnStart}>Pause</Button></Col>
                                    <Col><Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}}  onClick={this.clickOnStart}>Resume</Button></Col>
                                </Row>
                                <Row>
                                    <input type="radio" name="config" value="COMPACTNESS" onChange={this.setRadio}/> Compactness
                                </Row>
                                <Row>
                                    <input type="radio" name="config" value="POPULATION_EQUALITY" onChange={this.setRadio}/> Population equality
                                </Row>
                                <Row>
                                    <input type="radio" name="config" value="PARTISAN_FAIRNESS" onChange={this.setRadio}/> Partition Fairness
                                </Row>
                                <Row>
                                    <input type="radio" name="config" value="EFFICIENCY_GAP" onChange={this.setRadio}/> Efficiency Gap
                                </Row>
                                <Row>
                                    <input type="radio" name="config" value="COMPETITIVENESS" onChange={this.setRadio}/> Competitive
                                </Row>

                                <Row style={{'margin-top':10}}>
                                    <Button variant="outline-light" style={{width:160, 'font-size': '0.8em'}} disabled>Estimated Time: 2m 3s:</Button>
                                </Row>
                                <ProgressBar variant="dark" style={{'margin-top':10}} animated now={45} />
                            </Tab>
                            <Tab eventKey="summary" title="Summary">
                                <Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} value = 'Compare' onClick={this.clickOnCompare}>Compare</Button>
                                <Button variant="outline-light" style={{width:70, 'font-size': '0.8em'}} value = 'CompareWithOriginal' onClick={this.clickOnCompareWithOriginal}>CompareWithOriginal</Button>
                                <div id="summaryResult" style={{'white-space': 'pre-line',overflow : 'auto'}}>
                                    {this.state.summary}
                                </div>
                            </Tab>
                        </Tabs>
                    </Row>
                </Container>
            </div>


        )
    }
}

export default withRouter(home);
