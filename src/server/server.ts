
// Das hier ist der neue JavaScript Syntax für Code Importierungen, den nutzt auch TypeScript
// Um euch den Umstieg leichter zu machen packe ich in jede Zeile darüber, wie man's sonst mit Node machen würde.

// var express = require('express');
import * as express from "express";
// usw.
import {Request, Response} from "express";
import {Server} from "http";
import * as path from "path";
// var express = require('socket.io');
import * as socket from "socket.io";
import {RequestManager} from "./scripts/ConnectionManager/RequestManager";

const app = express();

const http = new Server(app);
const io = socket(http);

app.use("/css", express.static(__dirname + "/../client/css"));
app.use("/dist", express.static(__dirname + "/../client/dist"));
app.use("/img", express.static(__dirname + "/../client/img"));
app.use("/phaser", express.static(__dirname + "/../../node_modules/phaser"));

app.get("/", (req: Request, res: Response) => res.sendFile(path.resolve(__dirname + "/../client/index.html")));
// Handle all Incoming/Outgoing Events
const connectionManager = new RequestManager(io);
connectionManager.RequestListener();

console.log("Server is running. Port 8080 (http://localhost:8080)");
http.listen(8080);
