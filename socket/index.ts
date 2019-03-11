import uuid = require("uuid");
import * as SocketIo from "socket.io";
import { getOrCreateUser } from "../users/module";
import { createMessage, getMessageHistory } from "../messages/module";
import { setupUpload } from "./file-upload";
import { MongooseDocument } from "mongoose";
export function init(http : any) : void {
    const io = SocketIo(http);
    // io.of('/rooms').on('connection', async function (socket) {
    //     // Create a new room
    //     const users = await getLatestUsers();
    //     socket.emit("users", users);
    // });
    io.use((socket : SocketIO.Socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            (socket as any).agent = true;
        }
        next();
    }).on('connection', function(socket : SocketIO.Socket){

        setupUpload(socket, io);

        if ((socket as any).agent === true) {
            socket.join("agents");
        }
        socket.on("register", async () => {
            const uniqueId = uuid.v4();
            socket.emit("credentials", uniqueId);
            const user = await getOrCreateUser(uniqueId);
            socket.join(uniqueId);
            socket.join("global-room");
            const messages = await getMessageHistory(user._id);
            socket.emit("history", { messages, page: 1});
        })
    
        socket.on("login", async (credentials) => {
            console.log(`Returning user ${credentials}`);
            const user = await getOrCreateUser(credentials);
            socket.join(credentials);
            socket.emit("userId", user._id);
            socket.join("global-room");
            const messages : Array<MongooseDocument> = await getMessageHistory(user._id);
            socket.emit("history", { messages, page: 1});
        });

        socket.on('chat message', async (msg : any) => {
            const room = Object.keys(socket.rooms).find(key => key != socket.id);
            // console.log(msg, rooms);
            if (room) {
                const message : any = await createMessage(msg, room);
                io.in("global-room").emit('chat message', { id: message.id, userId : message.userId, content: message.content, createdAt : message.createdAt });
            } else {
                console.error("No such room found");
            }
        });

        /** agent only functions */
        socket.on("agent join", ({roomId}) => {
            if ((socket as any).agent == true) {
                socket.join(roomId);
            }
            socket.join("global-room");
        });
    
        socket.on("disconnect", (reason : string) => {
            // console.log(`Socket ${socket.id} disconnected ${reason}`);
        });
    });
}