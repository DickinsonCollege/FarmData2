"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const connection_1 = require("./connection");
const socket_1 = require("../socket");
function createServerProcess(serverName, command, args, options) {
    const serverProcess = cp.spawn(command, args, options);
    serverProcess.on('error', error => console.error(`Launching ${serverName} Server failed: ${error}`));
    serverProcess.stderr.on('data', data => console.error(`${serverName} Server: ${data}`));
    return createProcessStreamConnection(serverProcess);
}
exports.createServerProcess = createServerProcess;
function createWebSocketConnection(socket) {
    const reader = new socket_1.WebSocketMessageReader(socket);
    const writer = new socket_1.WebSocketMessageWriter(socket);
    return connection_1.createConnection(reader, writer, () => socket.dispose(), { socket });
}
exports.createWebSocketConnection = createWebSocketConnection;
function createProcessSocketConnection(process, outSocket, inSocket = outSocket) {
    return createSocketConnection(outSocket, inSocket, () => process.kill());
}
exports.createProcessSocketConnection = createProcessSocketConnection;
function createSocketConnection(outSocket, inSocket, onDispose) {
    const reader = new vscode_jsonrpc_1.SocketMessageReader(outSocket);
    const writer = new vscode_jsonrpc_1.SocketMessageWriter(inSocket);
    return connection_1.createConnection(reader, writer, onDispose);
}
exports.createSocketConnection = createSocketConnection;
function createProcessStreamConnection(process) {
    return createStreamConnection(process.stdout, process.stdin, () => process.kill());
}
exports.createProcessStreamConnection = createProcessStreamConnection;
function createStreamConnection(outStream, inStream, onDispose) {
    const reader = new vscode_jsonrpc_1.StreamMessageReader(outStream);
    const writer = new vscode_jsonrpc_1.StreamMessageWriter(inStream);
    return connection_1.createConnection(reader, writer, onDispose);
}
exports.createStreamConnection = createStreamConnection;
//# sourceMappingURL=launch.js.map