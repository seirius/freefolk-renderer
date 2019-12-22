import Axios from 'axios';
import FileDownload from "js-file-download";

export class FileManagerService {

    public static async download(id: string): Promise<void> {
        const {data, status, statusText, headers} = await Axios.get(`filemanager/download/${id}`, {
            params: {erase: false},
            responseType: "blob"
        });
        if (status !== 200) {
            throw new Error(statusText);
        }
        FileDownload(data, headers["x-suggested-filename"]);
    }

}