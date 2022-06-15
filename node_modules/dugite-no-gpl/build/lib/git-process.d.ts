/// <reference types="node" />
import { GitError } from './errors';
import { ChildProcess } from 'child_process';
/** The result of shelling out to git. */
export interface IGitResult {
    /** The standard output from git. */
    readonly stdout: string;
    /** The standard error output from git. */
    readonly stderr: string;
    /** The exit code of the git process. */
    readonly exitCode: number;
}
/**
 * A set of configuration options that can be passed when
 * executing a streaming Git command.
 */
export interface IGitSpawnExecutionOptions {
    /**
     * An optional collection of key-value pairs which will be
     * set as environment variables before executing the git
     * process.
     */
    readonly env?: Object;
}
/**
 * A set of configuration options that can be passed when
 * executing a git command.
 */
export interface IGitExecutionOptions {
    /**
     * An optional collection of key-value pairs which will be
     * set as environment variables before executing the git
     * process.
     */
    readonly env?: Object;
    /**
     * An optional string or buffer which will be written to
     * the child process stdin stream immediately immediately
     * after spawning the process.
     */
    readonly stdin?: string | Buffer;
    /**
     * The encoding to use when writing to stdin, if the stdin
     * parameter is a string.
     */
    readonly stdinEncoding?: string;
    /**
     * The size the output buffer to allocate to the spawned process. Set this
     * if you are anticipating a large amount of output.
     *
     * If not specified, this will be 10MB (10485760 bytes) which should be
     * enough for most Git operations.
     */
    readonly maxBuffer?: number;
    /**
     * An optional callback which will be invoked with the child
     * process instance after spawning the git process.
     *
     * Note that if the stdin parameter was specified the stdin
     * stream will be closed by the time this callback fires.
     */
    readonly processCallback?: (process: ChildProcess) => void;
}
export declare class GitProcess {
    private static pathExists(path);
    /**
     * Execute a command and interact with the process outputs directly.
     *
     * The returned promise will reject when the git executable fails to launch,
     * in which case the thrown Error will have a string `code` property. See
     * `errors.ts` for some of the known error codes.
     */
    static spawn(args: string[], path: string, options?: IGitSpawnExecutionOptions): ChildProcess;
    /**
     * Execute a command and read the output using the embedded Git environment.
     *
     * The returned promise will reject when the git executable fails to launch,
     * in which case the thrown Error will have a string `code` property. See
     * `errors.ts` for some of the known error codes.
     *
     * See the result's `stderr` and `exitCode` for any potential git error
     * information.
     */
    static exec(args: string[], path: string, options?: IGitExecutionOptions): Promise<IGitResult>;
    /** Try to parse an error type from stderr. */
    static parseError(stderr: string): GitError | null;
}
