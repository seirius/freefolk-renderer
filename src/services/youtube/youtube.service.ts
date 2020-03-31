import { ISearchArgs, ISearchResponse, IListArgs, IListResponse, IPlaylistArgs, IPlaylistResponse, IVideoItem } from "./youtube.dto";
import Axios from "axios";

export class YoutubeService {

    public static async list(args: IListArgs): Promise<IListResponse> {
        const {data, status, statusText} = await Axios.get("youtube/list", {
            params: args
        });
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

    public static async playlist(args: IPlaylistArgs): Promise<IPlaylistResponse> {
        const { data, status, statusText } = await Axios.get("youtube/playlist", { params: args });
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }
    
    public static async search(args: ISearchArgs): Promise<ISearchResponse> {
        const {data, status, statusText} = await Axios.get("youtube/search", { params: args });
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

    public static async resolveUserSearch({text, pageToken, maxResults}: IResolveUserSearchArgs): Promise<IResolveUserSearchResponse> {
        const {data, status, statusText} = await Axios.get("youtube/resolve-user-search", {
            params: {text, pageToken, maxResults},
        });
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

    public static isUrl(value: string): boolean {
        try {
            new URL(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    public static getUrlParams(value: string, paramName: string): string | null {
        if (YoutubeService.isUrl(value)) {
            return new URL(value).searchParams.get(paramName);
        }
        return null;
    }

}

export interface IResolveUserSearchArgs {
    text: string;
    pageToken?: string;
    maxResults?: number;
}

export interface IResolveUserSearchResponse {
    videos: IVideoItem[];
    nextPageToken?: string;
    totalResults?: number;
}