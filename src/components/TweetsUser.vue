<script setup>
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore"
import { ChatBubbleOvalLeftIcon, HeartIcon, ArrowUpTrayIcon, ArrowsUpDownIcon } from "@heroicons/vue/20/solid"
import { computed } from 'vue'
import { db } from "../firebaseConfig";

const tweets = computed(() => {
    const q = query(collection(db, 'tweets'), orderBy('timestamp'))
    const tweets = []
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(doc => {
            tweets.push({...doc.data(), id: doc.id})
        })
    })
    return tweets
})

console.log(tweets.value)
</script>

<template>
    <div>
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
    </div>
</template>
