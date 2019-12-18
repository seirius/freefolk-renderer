<template>
    <div class="home">
        <WelcomeHome />
    </div>
</template>

<script>
// @ is an alias to /src
import WelcomeHome from "@/components/WelcomeHome.vue";

export default {
    name: "home",
    components: {
        WelcomeHome
    }
};
</script>

<style lang="scss">
    .home {
        padding-top: 10px;
    }
</style>
