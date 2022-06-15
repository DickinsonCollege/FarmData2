import { Message } from "vscode-jsonrpc/lib/messages";
import { AbstractMessageWriter } from "vscode-jsonrpc/lib/messageWriter";
import { IWebSocket } from "./socket";
export declare class WebSocketMessageWriter extends AbstractMessageWriter {
    protected readonly socket: IWebSocket;
    protected errorCount: number;
    constructor(socket: IWebSocket);
    write(msg: Message): void;
}
