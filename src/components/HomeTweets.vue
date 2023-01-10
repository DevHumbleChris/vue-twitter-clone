<script setup>
import TweetsUser from './TweetsUser.vue'
import TweetBox from './TweetBox.vue'
</script>

<template>
  <section class="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4 p-2">
    <header class="text-xl my-3">Home</header>
    <TweetBox />
    <TweetsUser />
  </section>
</template>
