<script setup>
// import HomeTweets from '../components/HomeTweets.vue'
import FeedsTweets from '../components/FeedsTweets.vue';
import SideBar from '../components/SideBar.vue';
import { RouterView } from "vue-router";
</script>

<template>
  <main class="flex">
    <SideBar />
    <RouterView />
    <FeedsTweets />
  </main>
</template>
