
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import openSocket from 'socket.io-client';
import ChatPane from './chat';

class RoomsList extends Component {
  
}

class AgentChat extends Component {

    constructor() {
        super();
        this.socket = openSocket("/");
        this.state = {
            messages : []
        }
        this.handleMessage = this.handleMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleHistory = this.handleHistory.bind(this);
    }

    componentDidMount() {
        const storage = window.localStorage;
        const credentials = storage.getItem("credentials");
        if (credentials) {
            this.socket.emit("login", credentials);
        } else {
            this.socket.emit("register");
        }
        this.socket.on("credentials", credentials => {
            this.storage.setItem("credentials", credentials);
        });
        this.socket.on('chat message', this.handleMessage);
        this.socket.on('history', this.handleHistory);
    }

    handleMessage({content : message, id, createdAt, type, fileName}) {
        this.setState(({messages = []}) => ({ messages : messages.concat({type, incoming : false, message, id, createdAt, fileName})}));
        if (type != "text") {
            this.setState(({files = []})=> {
                return { files : files.filter(({file}) => file.name !== fileName)};
            });
        }
    }

    handleHistory({messages, page}) {
        this.setState({messages});
    }

    handleSubmit(message) {
        this.socket.emit("chat message", message);
    }

    render() {
        const { messages = [] } = this.state;
        return <ChatPane title="Karvy Support" imageUrl="/images/chat.png" messages={messages} socket={this.socket} submitMessage={this.handleSubmit}></ChatPane>
    }
}

class App extends Component {
    render() {
        return <AgentChat />
    }
}
ReactDOM.render(
    <App />,
  document.getElementById('frame')
);
