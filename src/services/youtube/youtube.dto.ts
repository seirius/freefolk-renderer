export interface IVideoItem {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    disabled: boolean;
    author: string;
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