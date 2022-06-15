import { Localization } from './common';
export interface ExtractionOptions {
    root?: string;
    output?: string;
    exclude?: string;
    logs?: string;
    /** List of globs matching the files to extract from. */
    files?: string[];
    merge?: boolean;
    quiet?: boolean;
}
export declare function extract(options: ExtractionOptions): Promise<void>;
export declare function extractFromFile(file: string, content: string, errors?: string[], options?: ExtractionOptions): Promise<Localization>;
//# sourceMappingURL=localization-extractor.d.ts.map