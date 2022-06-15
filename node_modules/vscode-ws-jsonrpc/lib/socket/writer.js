"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const messageWriter_1 = require("vscode-jsonrpc/lib/messageWriter");
class WebSocketMessageWriter extends messageWriter_1.AbstractMessageWriter {
    constructor(socket) {
        super();
        this.socket = socket;
        this.errorCount = 0;
    }
    write(msg) {
        try {
            const content = JSON.stringify(msg);
            this.socket.send(content);
        }
        catch (e) {
            this.errorCount++;
            this.fireError(e, msg, this.errorCount);
        }
    }
}
exports.WebSocketMessageWriter = WebSocketMessageWriter;
//# sourceMappingURL=writer.js.map