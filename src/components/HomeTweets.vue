<script setup>
import TweetsUser from './TweetsUser.vue'
import TweetBox from './TweetBox.vue'
</script>

<template>
  <section class="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4">
    <header class="text-xl my-3 p-2">Home</header>
    <TweetBox />
    <TweetsUser />
  </section>
</template>
