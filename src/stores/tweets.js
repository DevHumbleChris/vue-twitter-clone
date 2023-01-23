import { defineStore } from "pinia";
import { ref } from "vue";

export const useTweetStore = defineStore("tweets", () => {
  const tweets = ref(null);
  const isCommentModalOpen = ref(false);
  const tweetSelected = ref(null);

  const getTweets = (allTweets) => {
    console.log(allTweets);
  };

  const openCommentModal = (payload) => {
    tweetSelected.value = payload;
    isCommentModalOpen.value = !isCommentModalOpen.value;
  };

  return {
    tweets,
    getTweets,
    openCommentModal,
    isCommentModalOpen,
    tweetSelected,
  };
});
