export interface IStartDownload {
    ids?: string[];
    playlistId?: string;
}

export interface IStartDownloadResponse {
    filename: string[];
}

export interface IStartDownloadAudio {
    ids?: string[];
    playlistId?: string;
}

export interface IStartDownloadAudioResponse {
    filename: string[];
}