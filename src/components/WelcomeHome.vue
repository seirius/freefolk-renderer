<template>
    <div class="home-container">
        <DownloadList @close="closeList" :open="openList" :downloadingList="downloadingList" />
        <div class="search container">
            <div class="row">
                <div class="col-12">
                    <form @submit="search">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button type="button" class="btn btn-outline-info" @click="list"><i class="fa fa-download"></i></button>
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
                                        <span v-bind:class="{'d-none': loadingSearch}"><i class="fa fa-search"></i></span>
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
                        <VideoItem :videoItem="videoItem" @download="startDownload($event, videoItem)" />
                    </div>
                </div>
            </div>
            <div class="row" v-bind:class="{'d-none': this.videos.length === 0}">
                <div class="col-2"></div>
                <div class="col-8">
                    <div class="btn btn-outline-primary btn-block" :disabled="this.loadingSearch" @click="search()">Load more</div>
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
import { IVideoItem } from "../../../freefolk-download/src/youtube/youtube.service";
import DownloadList from "./DownloadList.vue";
import { IVideoItemWState, EVideoState, EDownloadType } from "../services/youtube/youtube.dto";
import { DownloadService } from "./../services/download/download.service";
import { connect } from "socket.io-client";

@Component({
    components: {
        VideoItem,
        DownloadList,
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
            this.videos.push(...videos.filter((video) => !this.videos.find(v => v.id === video.id)));
            this.pageToken = nextPageToken;
            this.totalResults = totalResults;
        } catch (error) {
            alert(error.message);
        } finally {
            this.loadingSearch = false;
        }
    }

    isSearchEmpty(): boolean {
        return !this.searchValue || !this.searchValue.trim();
    }

    list(): void {
        this.openList = !this.openList;
    }

    closeList(): void {
        this.openList = false;
    }

    async startDownload(type: EDownloadType, videoItem: IVideoItem): Promise<void> {
        if (this.downloadingList.find(({type: t, item: {id}}) => t === type && id === videoItem.id)) {
            this.list();
        } else {
            const args = {
                ids: [videoItem.id],
            };
            if (type === EDownloadType.AUDIO) {
                await DownloadService.startDownloadAudio({
                    ids: [videoItem.id],
                });
            } else if (type === EDownloadType.VIDEO) {
                await DownloadService.startDownload({
                    ids: [videoItem.id],
                });
            }
            this.downloadingList.unshift({
                state: {value: EVideoState.INIT},
                type,
                item: videoItem,
            });
        }
    }

    mounted() {
        console.log(1);
        const socket = connect({
            path: "/websocket"
        });
        socket.on("download", (data: any) => {
            const {id: incId, state, progress} = JSON.parse(data);
            const item = this.downloadingList.find(({item: { id }}) => id === incId);
            if (item) {
                const {type} = item;
                item.state.value = state;
                if (progress !== undefined) {
                    console.log(progress);
                    item.progress = parseInt(progress);
                }
                if (state === "done") {
                    item.progress = undefined;
                }
            }
        });
        socket.on("convert", (data: any) => console.log(data));
        const { searchResult }: {[key: string]: any} = this.$refs;
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