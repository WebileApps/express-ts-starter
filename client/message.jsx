import React, {Component} from 'react';
import TimeAgo from "react-timeago";

export default class Message extends Component {
    constructor(props) {
        super(props)
    }

    formatTime(value, unit, suffix, epochSeconds, nextFormatter) {
        if (unit == 'second') {
            return value < 15 ? "now" : "less than a minute ago";
        }
        return nextFormatter();
    }

    render() {
        const { incoming, type = "text", content, createdAt, fileName } = this.props.message;
        return <li className={incoming?"sent":"replies"}>
            {incoming && <img src={this.props.imageUrl}></img>}
            <div className="text">
                {type == "text" && <p>{content}</p>}
                {type == "image" && <div className="media">
                <a href={content} target="_blank">Download: {fileName}</a>
                <img src={content}></img>
                </div>}
                {type == "file" && <div className="media">
                <a href={content} target="_blank">{fileName}</a>
                </div>}
                <TimeAgo className="timeago" date={createdAt} formatter={this.formatTime}></TimeAgo>
            </div>
        </li>
    }
}