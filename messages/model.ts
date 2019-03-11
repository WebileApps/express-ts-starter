import { Schema, model } from 'mongoose';
var MessageSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref : 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type : {
        type: String,
        enum : ["text", "image", "file"],
        default : "text"
    },
    fileName : {
        type: String
    }
}, {
    timestamps : true
});
const messageModel = model('message', MessageSchema);
export = messageModel;