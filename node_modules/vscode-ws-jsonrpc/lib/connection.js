"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
const logger_1 = require("./logger");
function listen(options) {
    const { webSocket, onConnection } = options;
    const logger = options.logger || new logger_1.ConsoleLogger();
    webSocket.onopen = () => {
        const socket = toSocket(webSocket);
        const connection = socket_1.createWebSocketConnection(socket, logger);
        onConnection(connection);
    };
}
exports.listen = listen;
function toSocket(webSocket) {
    return {
        send: content => webSocket.send(content),
        onMessage: cb => webSocket.onmessage = event => cb(event.data),
        onError: cb => webSocket.onerror = event => {
            if ('message' in event) {
                cb(event.message);
            }
        },
        onClose: cb => webSocket.onclose = event => cb(event.code, event.reason),
        dispose: () => webSocket.close()
    };
}
exports.toSocket = toSocket;
//# sourceMappingURL=connection.js.map