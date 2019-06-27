import React from 'react';
import Websocket from 'react-websocket';

class websocket extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        count: 90
      };
    }

    handleData(data) {
      let result = JSON.parse(data);
      this.setState({count: this.state.count + result.movement});
    }

    render() {
      return (
        <div>
          Count: <strong>{this.state.count}</strong>

          <Websocket url='ws://localhost:3000'
              onMessage={this.handleData.bind(this)}/>
        </div>
      );
    }
  }

  export default websocket;
