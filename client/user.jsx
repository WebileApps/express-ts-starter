import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';
import ChatPane from './chat';

class UserChat extends Component {

    constructor() {
        super();
        this.socket = openSocket("/");
        this.state = {
            messages : [],
            userId : ""
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
            storage.setItem("credentials", credentials);
        });
        this.socket.on('chat message', this.handleMessage);
        this.socket.on('history', this.handleHistory);
        this.socket.on("userId", (userId) => {
            this.setState({userId});
        })
    }

    handleMessage({content, id, createdAt, type, fileName, userId}) {
        this.setState(({messages = []}) => ({ messages : messages.concat({type, userId, content, id, createdAt, fileName})}));
        if (type != "text") {
            this.setState(({files = []})=> {
                return { files : files.filter(({file}) => file.name !== fileName)};
            });
        }
    }

    handleHistory({messages, page}) {
        this.setState({messages});
    }

    handleSubmit(text) {
        this.socket.emit("chat message", text);
    }

    render() {
        const { messages = [], userId } = this.state;
        let myMessages = messages.map(message => ({...message, incoming : message.userId != userId}));
        return <ChatPane title="Karvy Support" imageUrl="/images/chat.png" messages={myMessages} socket={this.socket} submitMessage={this.handleSubmit}></ChatPane>
    }
}

class App extends Component {
    render() {
        return <UserChat />
    }
}
ReactDOM.render(<App />,document.getElementById('frame'));