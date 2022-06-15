export declare function deepl(parameters: DeeplParameters): Promise<DeeplResponse>;
export declare type DeeplLanguage = 'BG' | 'CS' | 'DA' | 'DE' | 'EL' | 'EN-GB' | 'EN-US' | 'EN' | 'ES' | 'ET' | 'FI' | 'FR' | 'HU' | 'IT' | 'JA' | 'LT' | 'LV' | 'NL' | 'PL' | 'PT-PT' | 'PT-BR' | 'PT' | 'RO' | 'RU' | 'SK' | 'SL' | 'SV' | 'ZH-CN' | 'ZH';
export declare const supportedLanguages: string[];
export declare function isSupportedLanguage(language: string): language is DeeplLanguage;
export interface DeeplParameters {
    free_api: Boolean;
    auth_key: string;
    text: string[];
    source_lang?: DeeplLanguage;
    target_lang: DeeplLanguage;
    split_sentences?: '0' | '1' | 'nonewlines';
    preserve_formatting?: '0' | '1';
    formality?: 'default' | 'more' | 'less';
    tag_handling?: string[];
    non_splitting_tags?: string[];
    outline_detection?: string;
    splitting_tags?: string[];
    ignore_tags?: string[];
}
export interface DeeplResponse {
    translations: DeeplTranslation[];
}
export interface DeeplTranslation {
    detected_source_language: string;
    text: string;
}
//# sourceMappingURL=deepl-api.d.ts.map