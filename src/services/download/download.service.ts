import { IStartDownload, IStartDownloadResponse, IStartDownloadAudioResponse, IStartDownloadAudio } from "./download.dto";
import Axios from "axios";

export class DownloadService {

    public static async startDownload({ids, playlistId}: IStartDownload): Promise<IStartDownloadResponse> {
        const {data, status, statusText} = await Axios.post("download/start-download", {ids, playlistId});
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

    public static async startDownloadAudio({ids, playlistId}: IStartDownloadAudio): Promise<IStartDownloadAudioResponse> {
        const {data, status, statusText} = await Axios.post("download/start-download/audio", {ids, playlistId});
        if (status !== 200) {
            throw new Error(statusText);
        }
        return data;
    }

}

