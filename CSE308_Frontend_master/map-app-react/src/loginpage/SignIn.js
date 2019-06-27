import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Toggle from './Toggle';
import store from 'store'

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
        msg :''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){

  }
  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let  data=JSON.stringify({//×ªJSON ¸ñÊ½
      "email":e.target.elements.email.value,
      "password":e.target.elements.password.value
    })
    axios.post('http://localhost:8080/homepage/signin',
      data,{
      headers:{ 'Content-Type': 'application/json;charset=UTF-8'}
    })
    .then(request =>{
      store.set('loggedIn',true);
      store.set('email',request.data.email)
        if(request.data.role=== 'manager'){
            this.props.history.push('/admin');
        }else {
            this.props.history.push('/home');
        }

    }).catch((error)=>{
      this.setState({
          msg: 'Invalid User or Password'
      })
    })
  }

  render() {
    return (
      <div className="FormCenter" >
      <Toggle/>
          <div style={{color :'red'}}>{this.state.msg}</div>
      <form onSubmit={this.handleSubmit} className="FormFields">
      <div className="FormField">
      <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
      <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
      </div>

      <div className="FormField">
      <label className="FormField__Label" htmlFor="password">Password</label>
      <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
      </div>

      <div className="FormField">
      <button className="FormField__Button mr-20">Sign In</button> <Link to="/sign-up" className="FormField__Link">Create an account</Link>
      </div>
      </form>

      </div>
    );
  }
}

export default SignInForm;
