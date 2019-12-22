export interface IVideoItem {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    disabled: boolean;
    author: string;
}

export interface IListArgs {
    ids: string[];
    part?: string;
}

export interface IListResponse {
    videos: IVideoItem[];
}

export interface IPlaylistArgs {
    id: string;
    pageToken: string;
    maxResults: number;
}

export interface IPlaylistResponse {
    nextPageToken?: string;
    prevPageToken?: string;
    totalResults: number;
    resultPerPage: number;
    videos: IVideoItem[];
}

export interface ISearchArgs {
    q: string;
    maxResults?: number;
    pageToken?: string;
}

export interface ISearchResponse {
    nextPageToken: string;
    prevPageToken: string;
    totalResults: number;
    resultsPerPage: number;
    videos: IVideoItem[];
}

export enum EVideoState {
    INIT = "init",
    DOWNLOADING = "downloading",
    CONVERTING = "converting",
    READY = "ready"
}

export enum EDownloadType {
    AUDIO = "audio",
    VIDEO = "video"
}

export interface IVideoItemWState {
    state: {
        value: EVideoState;
    },
    type: EDownloadType;
    item: IVideoItem;
}

