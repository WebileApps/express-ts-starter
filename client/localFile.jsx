import React, { Component } from "react";

export default class LocalFile extends Component {

    constructor() {
        super();
        this.imageEl = null;
    }

    componentDidMount() {
        const file = this.props.file;
        const isImage = (file.type.startsWith("image"));
        if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => { 
                this.imageEl.src = e.target.result; 
                this.props.onImageLoaded && this.props.onImageLoaded();
            };
            reader.readAsDataURL(file);
        }
    }
    render () {
        const { file, percent = 0 } = this.props;

        // const isImage = (file.type.startsWith("image"));
        return <li className="replies">
            <div className="text">
                <div className="media">
                    File: {file.name}
                    <img ref={element => this.imageEl = element} ></img>
                    <div className="progress_container">
                        <div className="progress" style={{width : `${percent}%`}}></div>
                    </div>
                </div>
            </div>
        </li>
    }
}