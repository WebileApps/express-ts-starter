import uuid = require("uuid");
import * as SocketIo from "socket.io";
import { getOrCreateUser } from "../users/module";
import { createMessage } from "../messages/module";
import { setupUpload } from "./file-upload";
export function init(http : any) : void {
    const io = SocketIo(http);
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
            await getOrCreateUser(uniqueId);
            socket.join(uniqueId);
        })
    
        socket.on("login", async (credentials) => {
            console.log(`Returning user ${credentials}`);
            await getOrCreateUser(credentials);
            socket.join(credentials);
        });

        socket.on('chat message', async (msg : any) => {
            const room = Object.keys(socket.rooms).find(key => key != socket.id);
            // console.log(msg, rooms);
            if (room) {
                const message : any = await createMessage(msg, room);
                io.in(room).emit('chat message', { id: message.id, username : "guest", msg, createdAt : message.createdAt });
            } else {
                console.error("No such room found");
            }
        });

        /** agent only functions */
        socket.on("agent join", ({roomId}) => {
            if ((socket as any).agent == true) {
                socket.join(roomId);
            }
        });
    
        socket.on("disconnect", (reason : string) => {
            // console.log(`Socket ${socket.id} disconnected ${reason}`);
        });
    });
}