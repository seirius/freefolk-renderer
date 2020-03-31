import { EDownloadState } from '../download/download.dto';

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
    id: string[];
    part?: string[];
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

export enum EDownloadType {
    MP3 = "mp3",
    MP4 = "mp4"
}

export interface IVideoItemWState {
    state: {
        value: EDownloadState;
    },
    type: EDownloadType;
    item: IVideoItem;
}

