<template>
    <div class="home-container">
        <Toasts @clickToast="clickToast" ref="toasts" />
        <DownloadList
            @close="closeList"
            :open="openList"
            :downloadingList="downloadingList"
            @downloadClicked="downloadClicked($event)"
        />
        <div class="search container">
            <div class="row">
                <div class="col-12">
                    <form @submit="search">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button
                                        type="button"
                                        class="btn btn-outline-info"
                                        @click="list"
                                        title="Show download list"
                                    >
                                        <i class="fa fa-download"></i>
                                    </button>
                                </div>
                                <div class="input-group-prepend">
                                    <button
                                        type="button"
                                        class="btn btn-outline-success"
                                        v-bind:class="{active: autoDownload}"
                                        @click="toggleAutodownload"
                                        title="Start downloading when the item is ready"
                                    >
                                        <i class="fa fa-check-circle"></i>
                                    </button>
                                </div>
                                <input
                                    autofocus
                                    type="text"
                                    class="form-control"
                                    id="search"
                                    aria-describedby="searchHelp"
                                    placeholder="Search or paste a youtube link"
                                    v-model="searchInputValue"
                                />
                                <div class="input-group-append">
                                    <button type="submit" class="btn btn-outline-secondary">
                                        <span v-bind:class="{'d-none': loadingSearch}">
                                            <i class="fa fa-search"></i>
                                        </span>
                                        <span
                                            v-bind:class="{'d-none': !loadingSearch}"
                                            class="spinner-border spinner-border-sm"
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="search-result container-fluid" ref="searchResult">
            <div class="row">
                <div
                    v-for="videoItem in videos"
                    v-bind:key="videoItem.id"
                    class="video-item-container col-12 col-sm-6 col-md-3 col-lg-2"
                >
                    <div class="card-group">
                        <VideoItem
                            :videoItem="videoItem"
                            @download="startDownload($event, videoItem)"
                        />
                    </div>
                </div>
            </div>
            <div class="row" v-bind:class="{'d-none': this.videos.length === 0}">
                <div class="col-2"></div>
                <div class="col-8">
                    <div
                        class="btn btn-outline-primary btn-block"
                        :disabled="this.loadingSearch"
                        @click="search()"
                    >Load more</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import VideoItem from "./VideoItem.vue";
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import { YoutubeService } from "./../services/youtube/youtube.service";
import { IVideoItem } from "./../services/youtube/youtube.dto";
import DownloadList from "./DownloadList.vue";
import {
    IVideoItemWState,
    EDownloadType
} from "../services/youtube/youtube.dto";
import { DownloadService } from "./../services/download/download.service";
import { connect } from "socket.io-client";
import { EDownloadState } from "../services/download/download.dto";
import { FileManagerService } from "../services/filemanager/filemanager.service";
import Toasts from "./Toasts.vue";
import { IToast } from "../services/util/Toast.dto";

@Component({
    components: {
        VideoItem,
        DownloadList,
        Toasts
    }
})
export default class WelcomeHome extends Vue {
    searchValue = "";
    searchInputValue = "";
    loadingSearch = false;
    videos: IVideoItem[] = [];
    pageToken?: string;
    totalResults?: number;
    openList = false;
    downloadingList: IVideoItemWState[] = [];
    socket!: SocketIOClient.Socket;
    autoDownload = FileManagerService.AUTO_DOWNLOAD;

    async search(event?: Event) {
        if (this.searchValue !== this.searchInputValue) {
            this.searchValue = this.searchInputValue;
            this.videos = [];
            this.pageToken = undefined;
            this.totalResults = 0;
        }
        if (this.isSearchEmpty()) {
            return;
        }
        this.loadingSearch = true;
        try {
            if (event) {
                event.preventDefault();
            }
            const {
                videos,
                nextPageToken,
                totalResults
            } = await YoutubeService.resolveUserSearch({
                text: this.searchValue,
                maxResults: 20,
                pageToken: this.pageToken
            });
            this.videos.push(
                ...videos.filter(
                    video => !this.videos.find(v => v.id === video.id)
                )
            );
            this.pageToken = nextPageToken;
            this.totalResults = totalResults;
        } catch (error) {
            alert(error.message);
        } finally {
            this.loadingSearch = false;
        }
    }

    toggleAutodownload(): void {
        this.autoDownload = !this.autoDownload;
        FileManagerService.AUTO_DOWNLOAD = this.autoDownload;
    }

    isSearchEmpty(): boolean {
        return !this.searchValue || !this.searchValue.trim();
    }

    list(): void {
        this.openList = !this.openList;
    }

    openAlwaysList(): void {
        this.openList = true;
    }

    clickToast(toast: IToast): void {
        this.openAlwaysList();
    }

    closeList(): void {
        this.openList = false;
    }

    async startDownload(
        type: EDownloadType,
        videoItem: IVideoItem
    ): Promise<void> {
        if (
            this.downloadingList.find(
                ({ type: t, item: { id } }) => t === type && id === videoItem.id
            )
        ) {
            this.list();
        } else {
            const args = {
                ids: [videoItem.id]
            };
            await DownloadService.finalStartDownload({
                ids: [videoItem.id],
                type
            });
            this.downloadingList.unshift({
                state: { value: EDownloadState.STAND_BY },
                type,
                item: videoItem
            });
            this.toasts.addToast({
                title: "Download started",
                img: videoItem.thumbnailUrl,
                message: "Open download list",
                vault: {
                    type: "start-download"
                }
            });
        }
    }

    get toasts(): Toasts {
        return this.$refs.toasts as any;
    }

    async downloadClicked(item: IVideoItemWState): Promise<void> {
        const {
            state: { value },
            item: { id },
            type
        } = item;
        try {
            if (value === EDownloadState.END) {
                await FileManagerService.download(
                    type === EDownloadType.MP3 ? id + "_mp3" : id
                );
            } else if (
                value === EDownloadState.ERASED ||
                value === EDownloadState.ERROR
            ) {
                await DownloadService.finalStartDownload({ ids: [id], type });
                item.state.value = EDownloadState.STAND_BY;
            }
        } catch (error) {
            item.state.value = EDownloadState.ERROR;
        }
    }

    mounted() {
        const socket = connect({
            path: "/websocket/"
        });
        socket.on("progress", async (data: any) => {
            const {
                id: incId,
                state,
                type: incType,
                errorMessage
            } = JSON.parse(data);
            const item = this.downloadingList.find(
                ({ item: { id }, type }) => id === incId && incType === type
            );
            if (item) {
                item.state.value = state;
                if (state === EDownloadState.END) {
                    const {
                        item: { id, thumbnailUrl },
                        type: itemType
                    } = item;
                    if (FileManagerService.AUTO_DOWNLOAD) {
                        await FileManagerService.download(
                            itemType === EDownloadType.MP3 ? id + "_mp3" : id
                        );
                    }
                    this.toasts.addToast({
                        title: "Download ready",
                        img: thumbnailUrl,
                        message: "Open download list",
                        vault: {
                            type: "download-ready"
                        }
                    });
                }
            }
        });
        socket.on("file_state", (data: any) => {
            const { id: incId, tags } = JSON.parse(data);
            const [parsedId] = incId.split("_");
            const parsedType = tags.includes("mp3")
                ? EDownloadType.MP3
                : EDownloadType.MP4;
            const finalType: EDownloadType = parsedType
                ? parsedType
                : EDownloadType.MP4;
            const item = this.downloadingList.find(
                ({ item: { id }, type }) =>
                    id === parsedId && finalType === type
            );
            if (item) {
                item.state.value = EDownloadState.ERASED;
            }
        });
        const { searchResult }: { [key: string]: any } = this.$refs;
        searchResult.onscroll = () => {
            const bottomOfWindow =
                searchResult.scrollHeight - searchResult.offsetHeight ===
                searchResult.scrollTop;

            if (bottomOfWindow) {
                if (!this.loadingSearch) {
                    this.search();
                }
            }
        };
    }
}
</script>

<style lang="scss">
.home-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .search-result {
        height: 100%;
        overflow: auto;
        .video-item-container {
            padding-bottom: 10px;
            padding-left: 5px;
            padding-right: 5px;
        }
    }
}
</style>