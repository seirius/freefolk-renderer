<template>
    <div class="modal" tabindex="-1" role="dialog" ref="modal">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Downloads</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="download-items col-12 col-md-6 col-lg-3" v-for="downloadItem of downloadingList" :key="downloadItem.type + ':' + downloadItem.item.id">
                                <DownloadItem :downloadItem="downloadItem"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import $ from "jquery";
import { ModalOption } from "bootstrap";
import { IVideoItemWState } from "../services/youtube/youtube.dto";
import DownloadItem from "./DownloadItem.vue";

@Component({
    components: {DownloadItem}
})
export default class DownloadList extends Vue {
    @Prop()
    open = false;

    @Prop()
    downloadingList!: IVideoItemWState;

    _open = false;

    @Watch("open")
    watchOpen(newVal: boolean, oldVal: boolean): void {
        this._open = newVal;

        const options: ModalOption = {show: false};
        if (this._open) {
            options.show = true;
        }

        const $modal = $(this.modalElement);
        $modal.modal(options);
    }

    get modalElement(): Element {
        return this.$refs.modal as any;
    }

    mounted() {
        this._open = this.open;
        $(this.modalElement).on("hide.bs.modal", () => this.$emit("close"));
    }
}
</script>

<style lang="scss">
    .modal-dialog, .modal-content {
        height: 95%;
    }
    .modal-body {
        // max-height: calc(100% - 120px);
        overflow-y: auto;

        .download-item {
            margin-top: 5px;
        }
    }
    .modal-header, .modal-body {
        color: white;
    }

    .downloading-row {
        .downloading-cell {
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                height: 100%;
            }
        }
        .cell-title {
            overflow: hidden; 
        }
    }
</style>