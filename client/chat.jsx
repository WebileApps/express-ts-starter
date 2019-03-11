import React, {Component} from 'react';

import Message from './message';
import * as SocketIOFileUpload from "socketio-file-upload";
import LocalFile from './localFile';

export default class ChatPane extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            files : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAttachment = this.handleAttachment.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.messagePanel = null;
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.messages.length != this.props.messages.length) {
            this.scrollToBottom();
        }
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        this.props.submitMessage(this.state.value);
        this.setState({ value : ''});
        event.preventDefault();
    }
    
    scrollToBottom() {
        setTimeout(_ => this.messagePanel.scrollTop = this.messagePanel.scrollHeight - this.messagePanel.clientHeight, 10);
    }
    
    handleAttachment(event) {
        event.preventDefault();
        this.state.siofu.prompt();
        return false;
    }
    
    componentDidMount() {
        this.scrollToBottom();
        
        const siofu = new SocketIOFileUpload(this.props.socket);
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

        siofu.addEventListener("start", (event) => {
            this.setState(({files = []}) => ({ files : files.concat({file : event.file, percent: 0}) }));
            this.scrollToBottom();
        });

        siofu.addEventListener("complete", (event) => {
            this.setState({ files :  []});
            this.scrollToBottom();
        });

        this.setState({siofu});
    }

    render() {
        const { files = []} = this.state;
        const { messages } = this.props;
        const { title = "Karvy Support", imageUrl = "/images/chat.png" } = this.props;
        return <div className="content" style={{width : "100%"}}>
            <div className="contact-profile">
                <img src={imageUrl} alt=""></img>
                <p>{title}</p>
                <div className="social-media">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <i className="fa fa-video" aria-hidden="true"></i>
                </div>
            </div>
            <div className="messages" ref={element => this.messagePanel = element}>
                <ul>{
                    messages.map(({id, incoming, content, createdAt, type, fileName }) => <Message key={id} imageUrl={imageUrl} message={{ incoming, content, createdAt, type, fileName }}></Message>)
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