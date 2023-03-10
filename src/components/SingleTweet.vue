<script setup>
import { computed, watchEffect, ref } from 'vue'
import {
    ChatBubbleOvalLeftIcon,
    HeartIcon,
    ArrowsUpDownIcon,
} from "@heroicons/vue/24/outline";
import {
    HeartIcon as HeartIconFilled,
    ArrowsUpDownIcon as ArrowsUpDownIconFilled,
    TrashIcon,
} from "@heroicons/vue/20/solid";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from '@firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { format } from 'timeago.js'
import { useTweetStore } from '@/stores/tweets'

const props = defineProps({
    tweet: Object
})

const store = useTweetStore()

const user = computed(() => {
    return auth.currentUser
})

const tweet = computed(() => {
    return props.tweet
})

const comments = ref([])
watchEffect(() => {
    const unsub = onSnapshot(collection(db, "tweets", tweet?.value.id, "comments"), (querySnapshot) => {
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
    const unsub = onSnapshot(collection(db, "tweets", tweet?.value.id, "likes"), (querySnapshot) => {
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
    const unsub = onSnapshot(collection(db, "tweets", tweet?.value.id, "retweets"), (querySnapshot) => {
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

const tagName = ref('')
watchEffect(() => {
    const newTagName = tweet.value.user.name.split(" ").join("-").toLowerCase()
    tagName.value = newTagName
})

const likePost = async () => {
    if (liked.value) {
        await deleteDoc(doc(db, "tweets", tweet.value.id, "likes", user.value.uid));
    } else {
        await setDoc(doc(db, "tweets", tweet.value.id, "likes", user.value.uid), {
            id: tweet.value.user.uid,
            name: tweet.value.user.name,
        });
    }
};

const retweetPost = async () => {
    if (isRetweeted.value) {
      await deleteDoc(doc(db, "tweets", tweet.value.id, "retweets", user.value.uid));
    } else {
      await setDoc(doc(db, "tweets", tweet.value.id, "retweets", user.value.uid), {
        id: tweet.value.user.uid,
        name: tweet.value.user.name,
      });
    }
  };

const commentPost = () => {
    store.openCommentModal(tweet.value)
}

const timeAgo = ref('')
watchEffect(() => {
    const tweetTime = format(tweet?.value.timestamp?.toDate())
    timeAgo.value = tweetTime
})

const deleteModal = () => {
    store.openDeleteModal(tweet.value)
}

</script>

<template>
    <div class="border border-gray-300 p-2">
        <router-link :to="`/tweet/@${tagName}/${tweet.id}`">
            <div class="flex space-x-2">
                <img :src="tweet?.user?.photoURL" :lt="tweet?.user?.name"
                    class="w-16 h-16 border border-gray-200 rounded-full" />
                <div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-bold text-[15px] sm:text-base">
                                {{ tweet?.user.name }}
                            </h4>
                            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                            <p>{{ timeAgo }}</p>
                        </div>
                        <h5 class="text-[15px] sm:text-base">
                            @<span class="text-[#1ca0f2]">{{tagName}}</span>
                        </h5>
                    </div>
                    <p class="text-gray-600 my-2">{{ tweet?.tweet }}</p>
                    <div v-if="tweet?.image">
                        <div class="my-2">
                            <img :src="tweet?.image" :alt="tweet?.id" class="object-contain rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
        <div class="flex justify-evenly m-2">
            <div class="flex items-center space-x-1 cursor-pointer" @click="commentPost">
                <ChatBubbleOvalLeftIcon class="w-6 h-6 text-[#1ca0f2]" />
                <p v-if="comments.length > 0">
                    {{ comments?.length }}
                </p>
            </div>
            <div class="flex items-center space-x-1 cursor-pointer" @click="likePost">
                <HeartIconFilled v-if="liked" class="text-[#f60100] w-6" />
                <HeartIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
                <p v-if="likes.length > 0">{{ likes.length }}</p>
            </div>
            <TrashIcon @click="deleteModal" v-if="tweet?.user?.uid === user?.uid" class="text-[#f60100] w-6 cursor-pointer" />
            <div class="flex items-center space-x-1 cursor-pointer" @click="retweetPost">
                <ArrowsUpDownIconFilled v-if="isRetweeted" class="w-6 h-6 text-green-700" />
                <ArrowsUpDownIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
                <p v-if="retweets.length > 0">{{ retweets?.length }}</p>
            </div>
        </div>
    </div>
</template>
