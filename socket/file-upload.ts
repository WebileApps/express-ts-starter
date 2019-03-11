import { Socket } from "socket.io";
const siofu = require("socketio-file-upload");
import readChunk from "read-chunk";
import fileType from "file-type";
import * as path from "path";
import { createMessage } from "../messages/module";
const imgTypes  = ['jpg', 'png', 'gif'];

export function setupUpload(socket : Socket, io : any) {
    const uploader = new siofu();
    uploader.dir = path.join(__dirname, "../public/uploads");
    uploader.listen(socket);

    // Uploader events
    // Start triggers spinner on client
    uploader.on('start', () => {
        socket.emit('fileUploadStarted');
    });

    // If transfer OK, auto create and push a message and hide spinner
    uploader.on('saved', async (event : any) => {
        if(event.file.success){
            // Auto create a message with a picture or download url
            var buffer   = readChunk.sync(event.file.pathName, 0, 262);
            var filetype = fileType(buffer);
            if(filetype && filetype.ext) {
                var uploadedName = path.basename(event.file.pathName);
                const msg = `/uploads/${uploadedName}`;
                const room = Object.keys(socket.rooms).find(key => key != socket.id) || "";
                const message : any = await createMessage(msg, room, imgTypes.indexOf(filetype.ext) >= 0 ? "image" : "file", event.file.name);
                io.in("global-room").emit('chat message', { id: message.id, userId : message.userId, content: message.content, createdAt : message.createdAt, type: message.type, fileName : event.file.name });
            }
            else {
                socket.emit('fileUploadError', 'File type is not supported');
            }
            console.log(event.file);
        } else {
                socket.emit('fileUploadError', 'File upload error 2');
            }
        }
    );
    // If transfer is not OK, push an error message
    uploader.on('error', (event : any) => {
    });
}