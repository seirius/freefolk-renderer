<template>
    <div v-if="videoItem" class="video-item">
        <div class="card">
            <div class="video-title">
                {{videoItem.title}}
            </div>
            <img class="card-img-top" v-bind:src="videoItem.thumbnailUrl" alt="thumbnail url"/>
            <!-- <div class="card-body"> -->
                <!-- <h6 class="card-title">{{videoItem.title}}</h6> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IVideoItem } from "../../../freefolk-download/src/youtube/youtube.service";

@Component
export default class VideoItem extends Vue {
    @Prop()
    videoItem!: IVideoItem;

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