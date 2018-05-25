
// Das hier ist der neue JavaScript Syntax für Code Importierungen, den nutzt auch TypeScript
// Um euch den Umstieg leichter zu machen packe ich in jede Zeile darüber, wie man's sonst mit Node machen würde.

// var express = require('express');
import * as express from "express";
// usw.
import {Request, Response} from "express";
import {Server} from "http";
// var express = require('socket.io');
import * as socket from "socket.io";
import {compileClientTypeScript} from "./compileClientTypeScript";
import {ConnectionManager} from "./server/scripts/ConnectionManager";

compileClientTypeScript();

const app = express();

const http = new Server(app);
const io = socket(http);

app.use("/phaser", express.static(__dirname + "/../node_modules/phaser"));
app.use("/requirejs", express.static(__dirname + "/../node_modules/requirejs"));
//scripts auf dem Server zeigt auf den dist Ordner in dem die kompilierten .ts Dateien aus dem "echten" scripts Ordner landen.
app.use("/scripts", express.static(__dirname + "/client/scripts"));
app.use("/dist", express.static(__dirname + "/client/dist"));
app.use("/img", express.static(__dirname + "/client/img"));

app.get("/", (req: Request, res: Response) => res.sendFile(__dirname + "/client/index.html"));
// Handle all Incoming/Outgoing Events
const connectionManager = new ConnectionManager(io);
connectionManager.EventListener();

console.log("Server is running. Port 8080");
http.listen(8080);
