<template>
    <div class="toasts" aria-live="polite" aria-atomic="true">
        <div v-for="(toast, index) in toasts" :key="toast.id" class="toast-container">
            <div class="toast" :class="toast.id" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="mr-auto">{{toast.title}}</strong>
                    <button @click="close(toast, index)" type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div @click="clickBody(toast)" v-if="toast.img" class="toast-body" v-bind:style="{
                    backgroundImage: 'url(' + toast.img + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }">
                    <div class="text">
                        <div class="text-container">
                            {{toast.message}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IToast } from "./../services/util/Toast.dto";
import $ from "jquery";
import { v4 } from "uuid";

@Component
export default class Toasts extends Vue {

    toasts: IToast[] = [];

    close(toast: IToast, index: number): void {
        this.toasts.splice(index, 1);
    }

    addToast(toast: IToast) {
        toast.id = v4();
        this.toasts.push(toast);
        const currentIndex = this.toasts.length - 1;
        setTimeout(() => {
            const $toast = $(`.${toast.id}`);
            $toast.toast({ delay: 6000 });
            $toast.toast("show");
            $toast.on("hide.bs.toast", () => this.close(toast, currentIndex));
        }, 0);
    }

    mounted() {
    }

    clickBody(toast: IToast) {
        this.$emit("clickToast", toast);
    }

}
</script>

<style lang="scss">
$cardHeight: 60px;
.toasts {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 3;
    .toast-container {
        .toast {
            max-width: 200px;
            background-color: rgba(71, 71, 71, 0.3) !important;
            color: white;
            .toast-header {
                background-color: rgba(17, 17, 17, 0.3) !important;
            }
            .toast-body {
                cursor: pointer;
                .text {
                    user-select: none;
                    overflow: hidden;
                }
                img {
                    object-fit: cover;
                    height: $cardHeight;
                }
            }
        }
        padding: 10px;
        position: relative;
        bottom: 0;
        right: 0;
    }
}
</style>