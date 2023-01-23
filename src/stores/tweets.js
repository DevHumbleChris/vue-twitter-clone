import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTweetStore = defineStore('tweets', () => {
    const tweets = ref(null)
    const isCommentModalOpen = false

    const getTweets = (allTweets) => {
        console.log(allTweets)
    }

    const openCommentModal = () => {
        isCommentModalOpen.value = !isCommentModalOpen.value
    }

    return {
        tweets,
        getTweets,
        openCommentModal,
        isCommentModalOpen
    }
})
