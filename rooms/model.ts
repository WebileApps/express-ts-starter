import { Schema, model } from "mongoose";

const roomsSchema = new Schema({
    title: {
        type: String,
        required: false,
        default: "Chat"
    },
    connections: {
        type: [{
            userId: String,
            socketId: String
        }]
    }
}, {
    timestamps: true
});

export const Users = model("rooms", roomsSchema);