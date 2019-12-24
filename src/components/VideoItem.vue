<template>
    <div v-if="videoItem" class="video-item">
        <div class="card">
            <div class="video-title" @click="options">
                {{videoItem.title}}
            </div>
            <div class="options" v-bind:class="{'d-none': !optionsState}">
                <div class="btn-group">
                    <button class="btn btn-outline-warning" @click="download('mp3')">Audio</button>
                    <button class="btn btn-outline-warning" @click="download('mp4')">Video</button>
                    <button class="btn btn-outline-danger" @click="options"><i class="fa fa-times"></i></button>
                </div>
            </div>
            <img class="card-img-top" v-bind:src="videoItem.thumbnailUrl" alt="thumbnail url"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IVideoItem } from "../../../freefolk-download/src/youtube/youtube.service";
import { EDownloadType } from "../services/youtube/youtube.dto";

@Component
export default class VideoItem extends Vue {
    @Prop()
    videoItem!: IVideoItem;

    optionsState = false;

    options() {
        this.optionsState = !this.optionsState;
    }

    download(type: EDownloadType) {
        this.$emit("download", type);
        this.optionsState = false;
    }

    mounted() {
    }
}
</script>

<style lang="scss">
    .video-item {
        .card {
            position: relative;
            cursor: pointer;
            .video-title {
                position: absolute;
                width: 100%;
                height: 130px;
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
                height: 130px;
                background-color: rgba(5, 5, 5, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img {
                object-fit: cover;
                height: 130px;
            }
            &:hover {
                -webkit-box-shadow: 1px 2px 19px 2px rgba(255,255,255,0.3);
                -moz-box-shadow: 1px 2px 19px 2px rgba(255,255,255,0.3);
                box-shadow: 1px 2px 19px 2px rgba(255,255,255,0.3);
            }
        }
    }
</style>