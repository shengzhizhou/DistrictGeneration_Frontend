import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Toggle from './Toggle';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import {Tab} from "react-bootstrap";

class GuestForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            hasAgreed: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.history.push('/home');
        console.log('The form was submitted with the following data:');
        console.log(this.state);
    }

    render() {
        return (
            <div className="FormCenter" >
                  <Toggle/>
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
                </Col>
                </Row>
            </div>
        );
    }
}
export default GuestForm;
