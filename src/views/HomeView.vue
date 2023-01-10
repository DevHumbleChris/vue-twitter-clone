<script setup>
import SideBar from '../components/TwitterSidebar.vue'
import HomeTweets from '../components/HomeTweets.vue'
import FeedsTweets from '../components/FeedsTweets.vue';
</script>

<template>
  <main class="flex">
    <SideBar />
    <HomeTweets />
    <FeedsTweets />
  </main>
</template>
