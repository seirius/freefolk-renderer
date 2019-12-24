import { EDownloadType } from '../youtube/youtube.dto';

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

export interface IFinalStartDownload {
    ids?: string[];
    playlistId?: string;
    type?: EDownloadType;
}

export enum EDownloadState {
    STAND_BY = "stand_by",
    INIT = "init",
    DOWNLOADING = "downloading",
    CONVERTING = "converting",
    END = "end",
    ERROR = "error",
    ERASED = "erased"
}

export const DownloadStateText = {
    stand_by: "Stand by",
    init: "Init",
    downloading: "Fetching",
    converting: "Formating",
    end: "Ready",
    error: "Error",
    erased: "Expired"
};