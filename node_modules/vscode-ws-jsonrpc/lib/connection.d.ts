import { MessageConnection, Logger } from 'vscode-jsonrpc';
import { IWebSocket } from './socket';
export declare function listen(options: {
    webSocket: WebSocket;
    logger?: Logger;
    onConnection: (connection: MessageConnection) => void;
}): void;
export declare function toSocket(webSocket: WebSocket): IWebSocket;
