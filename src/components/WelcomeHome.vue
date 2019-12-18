<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <form @submit="search">
                    <div class="form-group">
                        <div class="input-group">
                            <input
                                type="text"
                                class="form-control"
                                id="search"
                                aria-describedby="searchHelp"
                                placeholder="Search for a video o paste it's url"
                                v-model="searchValue"
                            />
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-outline-secondary">
                                    <span v-bind:class="{'d-none': loadingSearch}">Search</span>
                                    <span v-bind:class="{'d-none': !loadingSearch}" class="spinner-border spinner-border-sm"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Axios from "axios";
import { YoutubeService } from "./../services/youtube/youtube.service";

@Component
export default class WelcomeHome extends Vue {

    searchValue = "";
    loadingSearch = false;

    async search (event: Event) {
        this.loadingSearch = true;
        try {
            event.preventDefault();
            const searchResponse = await YoutubeService.search({
                q: this.searchValue,
                maxResults: 10
            });
            console.log(searchResponse);
        } catch (error) {
            alert(error.message);
        } finally {
            this.loadingSearch = false;
        }
    }

    isSearchLoading () {
        return {

        }
    }

    mounted () {
    }

}
</script>

<style lang="scss">
</style>