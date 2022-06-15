import { MessageReader, MessageWriter, Disposable, Message } from 'vscode-jsonrpc';
export declare function forward(clientConnection: IConnection, serverConnection: IConnection, map?: (message: Message) => Message): void;
export interface IConnection extends Disposable {
    readonly reader: MessageReader;
    readonly writer: MessageWriter;
    forward(to: IConnection, map?: (message: Message) => Message): void;
    onClose(callback: () => void): Disposable;
}
export declare function createConnection<T extends {}>(reader: MessageReader, writer: MessageWriter, onDispose: () => void, extensions?: T): IConnection & T;
