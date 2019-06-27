import React from "react";
import {link} from "react-router";


export const header = (props) =>{
  return (
      <nav className = "navbar navbar-default">
        <div className = " Container">
          <div className = "navbar-header">
            <ul className = "nav navbar-nav">
              <li><link to ={"/home"}>Home</link></li>
              <li><link to ={"/user"}>User</link></li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
export default header;
