
// Das hier ist der neue JavaScript Syntax für Code Importierungen, den nutzt auch TypeScript
// Um euch den Umstieg leichter zu machen packe ich in jede Zeile darüber, wie man's sonst mit Node machen würde.

// var express = require('express');
import * as express from 'express';
// var express = require('socket.io');
import * as socket from 'socket.io';
// var Socket = require('socket.io').Socket;
import {Socket} from "socket.io";
// usw.
import {Request, Response} from "express";
import {Server} from 'http';
import {compileClientTypeScript} from "./compileClientTypeScript";

compileClientTypeScript();

const app = express();

const http = new Server(app);
const io = socket(http);

app.use('/phaser', express.static(__dirname + '/../node_modules/phaser'));
// /scripts auf dem Server zeigt auf den dist Ordner in dem die kompilierten .ts Dateien aus dem "echten" scripts Ordner landen.
app.use('/scripts', express.static(__dirname + '/client/dist'));

app.get('/', (req: Request, res: Response) => res.sendFile(__dirname + '/client/index.html'));

io.on('connection', (socket: Socket) => {
    socket.emit('HelloWorld', "HelloWorld");
});

console.log("Server is running. Port 8080");
http.listen(8080);