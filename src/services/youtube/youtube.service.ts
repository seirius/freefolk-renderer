import { ISearchArgs, ISearchResponse } from './youtube.dto';
import Axios from "axios";

export class YoutubeService {
    
    public static async search(args: ISearchArgs): Promise<ISearchResponse> {
        const {data, status, statusText} = await Axios.post("youtube/search", args);
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

}