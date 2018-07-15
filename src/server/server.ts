
// Setup express, Socket.io, public routes of server

import * as express from "express";
import {Request, Response} from "express";
import {Server} from "http";
import * as path from "path";
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
