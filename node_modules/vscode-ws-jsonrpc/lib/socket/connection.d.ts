import { MessageConnection, Logger } from "vscode-jsonrpc";
import { IWebSocket } from "./socket";
export declare function createWebSocketConnection(socket: IWebSocket, logger: Logger): MessageConnection;
