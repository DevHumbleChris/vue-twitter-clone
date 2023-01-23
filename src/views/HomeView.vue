<script setup>
import HomeTweets from '../components/HomeTweets.vue'
import FeedsTweets from '../components/FeedsTweets.vue';
import SideBar from '../components/SideBar.vue';
</script>

<template>
  <main class="flex">
    <SideBar />
    <HomeTweets />
    <FeedsTweets />
  </main>
</template>
