"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const disposable_1 = require("../disposable");
function forward(clientConnection, serverConnection, map) {
    clientConnection.forward(serverConnection, map);
    serverConnection.forward(clientConnection, map);
    clientConnection.onClose(() => serverConnection.dispose());
    serverConnection.onClose(() => clientConnection.dispose());
}
exports.forward = forward;
function createConnection(reader, writer, onDispose, extensions = {}) {
    const disposeOnClose = new disposable_1.DisposableCollection();
    reader.onClose(() => disposeOnClose.dispose());
    writer.onClose(() => disposeOnClose.dispose());
    return Object.assign({ reader, writer,
        forward(to, map = (message) => message) {
            reader.listen(input => {
                const output = map(input);
                to.writer.write(output);
            });
        },
        onClose(callback) {
            return disposeOnClose.push(vscode_jsonrpc_1.Disposable.create(callback));
        }, dispose: () => onDispose() }, extensions);
}
exports.createConnection = createConnection;
//# sourceMappingURL=connection.js.map