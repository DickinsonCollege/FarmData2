"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const reader_1 = require("./reader");
const writer_1 = require("./writer");
function createWebSocketConnection(socket, logger) {
    const messageReader = new reader_1.WebSocketMessageReader(socket);
    const messageWriter = new writer_1.WebSocketMessageWriter(socket);
    const connection = vscode_jsonrpc_1.createMessageConnection(messageReader, messageWriter, logger);
    connection.onClose(() => connection.dispose());
    return connection;
}
exports.createWebSocketConnection = createWebSocketConnection;
//# sourceMappingURL=connection.js.map