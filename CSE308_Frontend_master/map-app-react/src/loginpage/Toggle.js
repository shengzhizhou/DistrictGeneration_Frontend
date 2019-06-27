import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './Toggle.css';

class Toggle extends Component{

  render() {
      return (
        <div className="PageSwitcher">
        <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
        <NavLink exact to="/sign-up" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
        <NavLink exact to="/Guest" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Guest</NavLink>
        </div>
      );

    }
}
export default Toggle;
