<script setup>
import { ArrowsUpDownIcon, ChatBubbleOvalLeftIcon, ChevronLeftIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'
import { watchEffect, ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { collection, doc, onSnapshot } from '@firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { HeartIcon as HeartIconFilled, ArrowsUpDownIcon as ArrowsUpDownIconFilled } from '@heroicons/vue/20/solid';
import { format } from 'timeago.js';

const user = computed(() => {
    return auth.currentUser
})

const route = useRoute()

const tweetID = computed(() => {
    return route?.params?.tweetID
})
const tagName = computed(() => {
    return route?.params?.tagName
})
const tweet = ref(null)
onBeforeMount(() => {
    const unsub = onSnapshot(doc(db, "tweets", tweetID.value), (doc) => {
        tweet.value = { ...doc.data(), id: doc.id }
    });
  return () => unsub()
})
// watchEffect(() => {
//     const unsub = onSnapshot(doc(db, "tweets", tweetID.value), (doc) => {
//         tweet.value = { ...doc.data(), id: doc.id }
//     });
//   return () => unsub()
// })

const comments = ref([])
watchEffect(() => {
    const unsub = onSnapshot(collection(db, "tweets", tweetID.value, "comments"), (querySnapshot) => {
        const myComments = []
        querySnapshot.forEach(doc => {
            myComments?.push({ ...doc.data(), id: doc.id })
        })
        comments.value = myComments
    })
    return () => unsub()
})

const likes = ref([])
watchEffect(() => {
    const unsub = onSnapshot(collection(db, "tweets", tweetID.value, "likes"), (querySnapshot) => {
        const userLikes = []
        querySnapshot.forEach(doc => {
            userLikes?.push({ ...doc.data(), id: doc.id })
        })
        likes.value = userLikes
    })
    return () => unsub()
})

const retweets = ref([])
watchEffect(() => {
    const unsub = onSnapshot(collection(db, "tweets", tweetID.value, "retweets"), (querySnapshot) => {
        let userRetweets = []
        querySnapshot.forEach(doc => {
            userRetweets?.push({ ...doc.data(), id: doc.id })
        })
        retweets.value = userRetweets
    })
    return () => unsub()
})

const liked = ref(null)
watchEffect(() => {
    const isLiked = likes?.value.filter((like) => like?.id === user?.value.uid);
    if (isLiked?.length > 0) {
        liked.value = true
    } else {
        liked.value = false
    }
})

const isRetweeted = ref(null)
watchEffect(() => {
    const isRetweet = retweets?.value.filter((retweet) => retweet?.id === user?.value.uid);
    if (isRetweet?.length > 0) {
        isRetweeted.value = true
    } else {
        isRetweeted.value = false
    }
})

const timeAgo = ref('')
watchEffect(() => {
    const tweetTime = format(tweet?.value.timestamp?.toDate())
    timeAgo.value = tweetTime
})
</script>

<template>
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4">
        <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
            <RouterLink to="/home">
                <ChevronLeftIcon className="w-6" />
            </RouterLink>
            <h1>Tweet</h1>
        </div>
        <div class="border-b border-gray-300">
            <div class="p-3">
              <div>
                <div class="flex space-x-2">
                  <img
                    :src="tweet?.user?.photoURL"
                    :alt="tagName"
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <div class="flex items-center space-x-2">
                      <h4 class="font-bold text-[15px] sm:text-base">
                        {{tweet?.user.name}}
                      </h4>
                      <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div>{{ timeAgo }}</div>
                    </div>
                    <h5 class="text-[15px] sm:text-base">
                      <span class="text-[#1ca0f2]">{{tagName}}</span>
                    </h5>
                  </div>
                </div>
                <p class="text-gray-600 my-2">{{tweet?.tweet}}</p>
                  <div v-if="tweet?.image" class="my-2">
                    <img
                      :src="tweet?.image"
                      :alt="tagName"
                      class="object-contain rounded-xl"
                    />
                  </div>
              </div>
              <div class="text-[15px] my-2 sm:text-base flex items-center justify-between">
                <div class="flex space-x-2">
                  <p>{{comments.length}}</p>
                  <p>Comments</p>
                </div>
                <div class="flex space-x-2">
                  <p>{{likes.length}}</p>
                  <p>Likes</p>
                </div>
                <div class="flex space-x-2">
                  <p>{{retweets.length}}</p>
                  <p>Retweets</p>
                </div>
              </div>
              <div class="flex my-3 justify-between w-full">
                <div class="flex items-center space-x-1">
                  <ChatBubbleOvalLeftIcon class="w-6 h-6 text-[#1ca0f2]" />
                </div>
                <div
                  class="flex items-center space-x-1 cursor-pointer"
                >
                <HeartIconFilled v-if="liked" class="text-[#f60100] w-6" />
                <HeartIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
                </div>
                <div
                  class="flex items-center space-x-1 cursor-pointer"
                >
                <ArrowsUpDownIconFilled v-if="isRetweeted" class="w-6 h-6 text-green-700" />
                <ArrowsUpDownIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
                </div>
              </div>
            </div>
          </div>
    </section>
</template>
