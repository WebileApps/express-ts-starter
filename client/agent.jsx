
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';

class App extends Component {

  componentDidMount() {
    const socket = openSocket("/", {
      query : { token : "token" }
    });
    socket.on('chat message', function({username, message}){
      console.log(username, message);
    });
  }

  render() {
    return <div>Hello World</div>;
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('app')
);
