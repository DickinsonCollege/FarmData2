/**
 * Bare minimum information of the locally available Git executable.
 */
export interface Git {
    /**
     * The FS path to the Git executable.
     */
    readonly path: string;
    /**
     * The Git version. [`git --version`]
     */
    readonly version: string;
    /**
     * The path to wherever your core Git programs are installed. [`git --exec-path`]
     */
    readonly execPath: string;
}
export interface FindGitOptions {
    hint?: string;
    onLookup?: (path: string) => void;
}
/**
 * Resolves to the path of the locally available Git executable. Will be rejected if Git cannot be found on the system.
 * `hint` can be provided as the initial lookup path, and `onLookup` function is used for logging during the Git discovery.
 */
export default function ({ hint, onLookup }?: FindGitOptions): Promise<Git>;
