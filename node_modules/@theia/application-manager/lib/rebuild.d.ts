export declare type RebuildTarget = 'electron' | 'browser';
declare type NodeABI = string | number;
export declare const DEFAULT_MODULES: string[];
export interface RebuildOptions {
    /**
     * What modules to rebuild.
     */
    modules?: string[];
    /**
     * Folder where the module cache will be created/read from.
     */
    cacheRoot?: string;
    /**
     * In the event that `node-abi` doesn't recognize the current Electron version,
     * you can specify the Node ABI to rebuild for.
     */
    forceAbi?: NodeABI;
}
/**
 * @param target What to rebuild for.
 * @param options
 */
export declare function rebuild(target: RebuildTarget, options?: RebuildOptions): void;
export {};
//# sourceMappingURL=rebuild.d.ts.map