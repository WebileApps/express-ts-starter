const express = require("express");
const SocketIOFileUpload = require("socketio-file-upload");

import { Application, Request, Response, Handler, RequestHandler } from "express";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";
import * as usersRouter from "./users/router";
import { connect as mongooseConnect } from "mongoose";
import * as path from "path";

const app : Application = express();
mongooseConnect(process.env.MONGO_URL as string, { useNewUrlParser: true}, (err) => {
    if (err) {
        console.log("Could not connect to mongodb");
        console.error(err);
    }
});

app.use(SocketIOFileUpload.router);
app.use(express.static('public'));

app.get('/', (req : Request, res : Response) => {
    res.sendFile(path.join(__dirname , './public/user.html'));
});

app.get('/agent', (req : Request, res : Response) => {
    res.sendFile(path.join(__dirname, './public/agent.html'));
});

app.use('/users', usersRouter);

app.use((error: Error, request : Request, response : Response, next : Handler) => {
   response.status((error as any).code < 600 ? (error as any).code : INTERNAL_SERVER_ERROR || INTERNAL_SERVER_ERROR).send({errors: [{error: error.message || (error as any).error}]}) 
});

export = app;