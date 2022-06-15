import * as ffmpeg from './ffmpeg';
export interface CheckFfmpegOptions extends ffmpeg.FfmpegOptions {
    json?: boolean;
}
export interface CheckFfmpegResult {
    free: ffmpeg.Codec[];
    proprietary: ffmpeg.Codec[];
}
export declare const KNOWN_PROPRIETARY_CODECS: Set<string>;
export declare function checkFfmpeg(options?: CheckFfmpegOptions): Promise<void>;
//# sourceMappingURL=check-ffmpeg.d.ts.map