<script setup>
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore"
import { onMounted, ref } from 'vue'
import { db } from "../firebaseConfig";
import SingleTweet from './SingleTweet.vue'

const tweets = ref([])
const loadingTweets = ref(true)

onMounted(() => {
    const myTweets = []
    onSnapshot(collection(db, 'tweets'), orderBy('timestamp', 'desc'), (querySnapshot) => {
        querySnapshot.forEach(doc => {
            myTweets.push({...doc.data(), id: doc.id})
        })
    })
    tweets.value = myTweets
    loadingTweets.value = false
})
</script>

<template>
    <!-- <div>
        <div v-if="tweets">
            <div v-for="tweet in tweets" :key="tweet.id" class="border border-gray-300 p-2">
                <div class="flex space-x-2">
                    <img :src="tweet.user.photoURL"
                        alt="user-logo" class="w-16 h-16 border border-gray-200 rounded-full" />
                    <div>
                        <h1>{{ tweet.user.name }}</h1>
                        <p class="text-gray-600 my-2">{{ tweet.tweet}}</p>
                    </div>
                </div>
                <div class="flex justify-evenly m-2">
                    <ChatBubbleOvalLeftIcon class="w-6 h-6 text-[#1ca0f2]" />
                    <HeartIcon class="w-6 h-6 text-[#1ca0f2]" />
                    <ArrowsUpDownIcon class="w-6 h-6 text-[#1ca0f2]" />
                    <ArrowUpTrayIcon class="w-6 h-6 text-[#1ca0f2]" />
                </div>
            </div>
        </div>f
    </div> -->
    <div>
        <div v-if="loadingTweets" className="mx-auto my-12 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="#1ca0f2"
              class="w-12 h-12 mx-auto"
            >
              <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
            </svg>
            <p class="text-center my-2">Loading Tweets...</p>
          </div>
          <div v-else>
            <div v-for="tweet in tweets" :key="tweet.id" tweet="tweet">

                <SingleTweet  />
            </div>
          </div>
        <!-- {!loadingTweets &&
          tweets.map((tweet) => {
            return <Tweet key={tweet.id} tweet={tweet} />;
          })}
        {isModalOpen && <Modal />}
        {deleteModal && <DeleteTweet/>} -->
      </div>
</template>
