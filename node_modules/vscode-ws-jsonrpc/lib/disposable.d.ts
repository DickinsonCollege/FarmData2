import { Disposable } from 'vscode-jsonrpc/lib/events';
export { Disposable };
export declare class DisposableCollection implements Disposable {
    protected readonly disposables: Disposable[];
    dispose(): void;
    push(disposable: Disposable): Disposable;
}
