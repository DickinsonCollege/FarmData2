import { DataCallback, AbstractMessageReader } from "vscode-jsonrpc/lib/messageReader";
import { IWebSocket } from "./socket";
export declare class WebSocketMessageReader extends AbstractMessageReader {
    protected readonly socket: IWebSocket;
    protected state: 'initial' | 'listening' | 'closed';
    protected callback: DataCallback | undefined;
    protected readonly events: {
        message?: any;
        error?: any;
    }[];
    constructor(socket: IWebSocket);
    listen(callback: DataCallback): void;
    protected readMessage(message: any): void;
    protected fireError(error: any): void;
    protected fireClose(): void;
}
