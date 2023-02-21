import { defineStore } from "pinia";
import { ref } from "vue";

export const useTweetStore = defineStore("tweets", () => {
  const tweets = ref(null);
  const isCommentModalOpen = ref(false);
  const tweetSelected = ref(null);
  const isDeleteModal = ref(false)
  const tweetToBeDeleted = ref(null)

  const getTweets = (allTweets) => {
    console.log(allTweets);
  };

  const openCommentModal = (payload) => {
    tweetSelected.value = payload;
    isCommentModalOpen.value = !isCommentModalOpen.value;
  };

  const openDeleteModal = (payload) => {
    tweetToBeDeleted.value = payload
    isDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    isDeleteModal.value = false
  }

  return {
    tweets,
    getTweets,
    openCommentModal,
    isCommentModalOpen,
    tweetSelected,
    isDeleteModal,
    tweetToBeDeleted,
    openDeleteModal,
    closeDeleteModal
  };
});
