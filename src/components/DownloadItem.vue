<template>
    <div class="download-item">
        <div class="card">
            <div class="video-title">{{downloadItem.item.title}}</div>
            <div class="options" @click="download">
                <div class="top"></div>
                <div class="bottom">
                    <span class="badge badge-primary" v-if="downloadItem.type === 'mp3'">
                        <i class="fa fa-volume-up"></i>
                    </span>
                    <span class="badge badge-primary" v-if="downloadItem.type === 'mp4'">
                        <i class="fa fa-film"></i>
                    </span>
                    <span class="badge" v-bind:class="{
                        'badge-warning': ['downloading', 'converting'].includes(downloadItem.state.value),
                        'badge-success': downloadItem.state.value === 'end',
                        'badge-secondary': downloadItem.state.value === 'stand_by',
                        'badge-primary': downloadItem.state.value === 'init',
                        'badge-danger': downloadItem.state.value === 'error',
                        'badge-info': downloadItem.state.value === 'erased'
                    }">{{getStateText(downloadItem.state.value)}}</span>
                </div>
            </div>
            <img
                class="card-img-top"
                v-bind:src="downloadItem.item.thumbnailUrl"
                alt="thumbnail url"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FileManagerService } from "../services/filemanager/filemanager.service";
import { IVideoItemWState, EDownloadType } from "../services/youtube/youtube.dto";
import { EDownloadState, DownloadStateText } from "../services/download/download.dto";

@Component
export default class DownloadItem extends Vue {
    @Prop()
    downloadItem!: IVideoItemWState;

    async download(): Promise<void> {
        const {type, item: {id}, state: {value}} = this.downloadItem;
        this.$emit("clicked", this.downloadItem);
    }

    getStateText(state: EDownloadState): string {
        return DownloadStateText[state];
    }
}
</script>

<style lang="scss">
$cardHeight: 90px;
.download-item {
    .card {
        position: relative;
        cursor: pointer;
        .video-title {
            position: absolute;
            width: 100%;
            height: $cardHeight;
            display: flex;
            color: white;
            font-weight: bold;
            background-color: rgba(5, 5, 5, 0.4);
            overflow: hidden;
            user-select: none;
        }
        .options {
            position: absolute;
            width: 100%;
            height: $cardHeight;
            background-color: rgba(5, 5, 5, 0.5);
            display: flex;
            flex-direction: column;

            .top {
                flex: 1;
            }

            .bottom {
                padding: 3px;
                align-self: flex-end;
            }
        }
        img {
            object-fit: cover;
            height: $cardHeight;
        }
        &:hover {
            -webkit-box-shadow: 1px 2px 19px 2px rgba(255, 255, 255, 0.3);
            -moz-box-shadow: 1px 2px 19px 2px rgba(255, 255, 255, 0.3);
            box-shadow: 1px 2px 19px 2px rgba(255, 255, 255, 0.3);
        }
    }
}
</style>