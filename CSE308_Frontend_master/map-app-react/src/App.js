import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Map from './components/Map';
import SignUp from './loginpage/SignUp';
import SignIn from './loginpage/SignIn';
import Guest from './loginpage/Guest';
import Toggle from './loginpage/Toggle';
import Home from './home';
import Admin from './components/Admin'
import io from "socket.io-client";


class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      selectedState :'Select State',
        compareList : [],
        email : '',
    }
    this.setSelectedState = this.setSelectedState.bind(this)
      this.updateCompare = this.updateCompare.bind(this)
      this.socket = io('http://localhost:9093');
      this.socket.on('connect',()=>{
          console.log("success")
      })
  }


  setSelectedState(s){
    this.setState({
        selectedState : s
    })
  }

  updateCompare(l){
    this.setState({
        compareList : l
    })
  }

  storeEmail(s){
      this.setState({
          email: s
      })
  }


    render() {
    return (
      <Router basename="/">
      <div className="App">

      <Map selectedState = {this.state.selectedState} setSelectedState = {this.setSelectedState} socket = {this.socket} updateCompare ={this.updateCompare} compareList ={this.state.compareList} email ={this.state.email}/>


      <div className="App__Form" >

      <Route exact path="/" component={SignUp} >
      </Route>

      <Route exact path="/sign-up" component={SignUp} >
      </Route>
      <Route path="/sign-in" component={SignIn} storeEmail = {this.storeEmail}>
      </Route>
      <Route exact path="/Guest" render ={()=><Guest selectedState = {this.state.selectedState} setSelectedState = {this.setSelectedState}/>}>
      </Route>
      <Route exact path="/home" render={()=> <Home selectedState = {this.state.selectedState} setSelectedState = {this.setSelectedState} socket={this.socket} compareList = {this.state.compareList}/>} >
      </Route>
          <Route exact path="/admin" component={Admin}>
          </Route>
      </div>
      </div>
      </Router>
    );
  }
}

export default App;
