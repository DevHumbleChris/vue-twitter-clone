<script setup>
import SideBar from '@/components/Sidebar.vue'
import HomeTweets from '@/components/HomeTweets.vue'
import FeedsTweets from '@/components/FeedsTweets.vue';
</script>

<template>
  <main class="grid grid-cols-6 sm:grid-cols-8 gap-2 space-x-2">
    <SideBar />
    <HomeTweets />
    <FeedsTweets />
  </main>
</template>
