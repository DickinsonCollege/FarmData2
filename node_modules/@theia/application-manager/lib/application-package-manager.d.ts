/// <reference types="node" />
import * as cp from 'child_process';
import { ApplicationPackage, ApplicationPackageOptions } from '@theia/application-package';
import { ApplicationProcess } from './application-process';
import { GeneratorOptions } from './generator/abstract-generator';
import yargs = require('yargs');
declare module 'semver' {
    function minVersion(range: string): string;
}
export declare class ApplicationPackageManager {
    static defineGeneratorOptions<T>(cli: yargs.Argv<T>): yargs.Argv<T & {
        mode: 'development' | 'production';
        splitFrontend?: boolean;
    }>;
    readonly pck: ApplicationPackage;
    /** application process */
    readonly process: ApplicationProcess;
    /** manager process */
    protected readonly __process: ApplicationProcess;
    constructor(options: ApplicationPackageOptions);
    protected remove(fsPath: string): Promise<void>;
    clean(): Promise<void>;
    prepare(): Promise<void>;
    generate(options?: GeneratorOptions): Promise<void>;
    copy(): Promise<void>;
    build(args?: string[], options?: GeneratorOptions): Promise<void>;
    start(args?: string[]): cp.ChildProcess;
    startElectron(args: string[]): cp.ChildProcess;
    startBrowser(args: string[]): cp.ChildProcess;
    /**
     * Inject Theia's Electron-specific dependencies into the application's package.json.
     *
     * Only overwrite the Electron range if the current minimum supported version is lower than the recommended one.
     */
    protected prepareElectron(): Promise<void>;
    protected insertAlphabetically<T extends Record<string, string>>(object: T, key: string, value: string): T;
    private adjustArgs;
    private get forkOptions();
}
//# sourceMappingURL=application-package-manager.d.ts.map