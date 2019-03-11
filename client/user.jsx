
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';
import Message from './message';
import * as SocketIOFileUpload from "socketio-file-upload";
import LocalFile from './localFile';

let socket = openSocket("/");
const siofu = new SocketIOFileUpload(socket);

const messages = [{
    id : "1",
    username : "someone",
    message : "How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!",
    incoming : true, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "2",
    username : "someone",
    message : "When you're backed against the wall, break the god damn thing down.",
    incoming : false, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "3",
    username : "someone",
    message : "Excuses don't win championships.",
    incoming : false, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "4",
    username : "someone",
    message : "Oh yeah, did Michael Jordan tell you that?",
    incoming : true, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "5",
    username : "someone",
    message : "No.",
    incoming : false, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "6",
    username : "someone",
    message : "What are your choices when someone puts a gun to your head?",
    incoming : false, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "7",
    username : "someone",
    message : "What are you talking about? You do what they say or they shoot you.",
    incoming : true, createdAt : "2019-03-10T19:53:04.861+00:00"
},
{
    id : "8",
    username : "someone",
    message : "Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.",
    incoming : false, createdAt : "2019-03-10T19:53:04.861+00:00"
}
];

class App extends Component {

    constructor() {
        super();
        this.state = {
            value: '',
            messages: messages,
            files : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleAttachment = this.handleAttachment.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.messagePanel = null;
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        socket.emit('chat message', this.state.value);
        this.setState({ value : ''});
        event.preventDefault();
    }

    handleMessage({msg : message, id, createdAt, type, fileName}) {
        this.setState(({messages = []}) => ({ messages : messages.concat({type, incoming : false, message, id, createdAt, fileName})}));
        if (type != "text") {
            this.setState(({files = []})=> {
                return { files : files.filter(({file}) => file.name !== fileName)};
            });
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(_ => this.messagePanel.scrollTop = this.messagePanel.scrollHeight - this.messagePanel.clientHeight, 10);
    }

    handleAttachment(event) {
        event.preventDefault();
        siofu.prompt();
        return false;
    }

    componentDidMount() {
        const storage = window.localStorage;
        const credentials = storage.getItem("credentials");
        if (credentials) {
            socket.emit("login", credentials);
        } else {
            socket.emit("register");
        }
        socket.on("credentials", credentials => {
            storage.setItem("credentials", credentials);
        });
        socket.on('chat message', this.handleMessage);

        siofu.listenOnDrop(document.getElementsByClassName("messages")[0]);
        siofu.addEventListener("progress", (event) => {
            var progress = event.bytesLoaded / event.file.size * 100;
            this.setState(({files = []}) => {
                return { files : files.map(({file, percent}) => ({
                    file,
                    percent : file.name == event.file.name ? progress : percent
                })) };
            })
        });
     
        // Do something when a file is uploaded:
        siofu.addEventListener("complete", (event) => {
            // this.setState(({files = []})=> {
            //     return { files : files.filter(({file}) => file.name !== event.file.name)};
            // });
        });

        siofu.addEventListener("start", (event) => {
            this.setState(({files = []}) => ({ files : files.concat({file : event.file, percent: 0}) }));
            this.scrollToBottom();
        });
    }

    render() {
        const {messages, files = []} = this.state;
        return <div className="content" style={{width : "100%"}}>
            <div className="contact-profile">
                <img src="/images/chat.png" alt=""></img>
                <p>Karvy Support</p>
                <div className="social-media">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <i className="fa fa-video" aria-hidden="true"></i>
                </div>
            </div>
            <div className="messages" ref={element => this.messagePanel = element}>
                <ul>{
                    messages.map(({id, incoming, message, createdAt, type, fileName }) => <Message key={id} message={{ incoming, message, createdAt, type, fileName }}></Message>) 
                }
                {
                    files.map(({file, percent}) => <LocalFile key={file.name} percent={percent} file={file} onImageLoaded={this.scrollToBottom}></LocalFile>)
                }
                </ul>
            </div>
            <div className="message-input">
                <form onSubmit={this.handleSubmit}>
                <div className="wrap">
                <input type="text" placeholder="Write your message..." autoComplete="off" value={this.state.value} onChange={this.handleChange}/>
                <div className="attachment" onClick={this.handleAttachment}><i className="fa fa-paperclip" aria-hidden="true"></i></div>
                <button className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                </div>
                </form>
            </div>
        </div>;
    }
}

ReactDOM.render(
    <App />,
  document.getElementById('frame')
);