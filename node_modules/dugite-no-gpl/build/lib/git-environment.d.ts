/**
 * Setup the process environment before invoking Git.
 *
 * This method resolves the Git executable and creates the array of key-value
 * pairs which should be used as environment variables.
 *
 * @param additional options to include with the process
 */
export declare function setupEnvironment(environmentVariables: Object): {
    env: Object;
    gitLocation: string;
};
