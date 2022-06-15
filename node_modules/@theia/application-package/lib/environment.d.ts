/**
 * The electron specific environment.
 */
declare class ElectronEnv {
    /**
     * Environment variable that can be accessed on the `process` to check if running in electron or not.
     */
    readonly THEIA_ELECTRON_VERSION = "THEIA_ELECTRON_VERSION";
    /**
     * `true` if running in electron. Otherwise, `false`.
     *
     * Can be called from both the `main` and the render process. Also works for forked cluster workers.
     */
    is(): boolean;
    /**
     * `true` if running in Electron in development mode. Otherwise, `false`.
     *
     * Cannot be used from the browser. From the browser, it is always `false`.
     */
    isDevMode(): boolean;
    /**
     * Creates and return with a new environment object which always contains the `ELECTRON_RUN_AS_NODE: 1` property pair.
     * This should be used to `spawn` and `fork` a new Node.js process from the Node.js shipped with Electron. Otherwise, a new Electron
     * process will be spawned which [has side-effects](https://github.com/eclipse-theia/theia/issues/5385).
     *
     * If called from the backend and the `env` argument is not defined, it falls back to `process.env` such as Node.js behaves
     * with the [`SpawnOptions`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).
     * If `env` is defined, it will be shallow-copied.
     *
     * Calling this function from the frontend does not make any sense, hence throw an error.
     */
    runAsNodeEnv(env?: any): any & {
        ELECTRON_RUN_AS_NODE: 1;
    };
}
declare const environment: Readonly<{
    electron: ElectronEnv;
}>;
export { environment };
//# sourceMappingURL=environment.d.ts.map