import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTweetStore = defineStore('tweets', () => {
    const tweets = ref(null)

    const getTweets = (allTweets) => {
        console.log(allTweets)
    }

    return {
        tweets,
        getTweets
    }
})
