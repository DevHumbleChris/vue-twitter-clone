<script setup>
import { ArrowsUpDownIcon, ChatBubbleOvalLeftIcon, HeartIcon, PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { watchEffect, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from '@firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { HeartIcon as HeartIconFilled, ArrowsUpDownIcon as ArrowsUpDownIconFilled } from '@heroicons/vue/20/solid';
import { format } from 'timeago.js';
import { getDownloadURL, uploadString, ref as storageRef } from '@firebase/storage';

const user = computed(() => {
  return auth.currentUser
})

const route = useRoute()
const tweetReply = ref('')
const selectedFile = ref(null)

const tweetID = computed(() => {
  return route?.params?.tweetID
})
const tagName = computed(() => {
  return route?.params?.tagName
})
const tweet = ref(null)

watchEffect(() => {
  const unsub = onSnapshot(doc(db, "tweets", tweetID.value), (doc) => {
    tweet.value = { ...doc.data(), id: doc.id }
  });
  return () => unsub()
})

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

const timeAgo = computed(() => {
  let tweetTime = ''
  if (tweet.value) {
    tweetTime = format(tweet?.value.timestamp?.toDate())
  }
  return tweetTime
})

const commentOnPost = async () => {
    const docRef = await addDoc(
        collection(db, "tweets", tweetID.value, "comments"),
        {
            comment: tweetReply.value,
            user: {
                uid: user.value.uid,
                name: user.value.displayName,
                photoURL: user.value.photoURL,
            },
            timestamp: serverTimestamp(),
        }
    );
    const imageRef = storageRef(storage, `tweets/${tweetID.value}/comments/${docRef.id}/images`);
    if (selectedFile.value) {
      await uploadString(imageRef, selectedFile.value, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "tweets", tweetID.value, "comments", docRef.id), {
          image: downloadURL,
        });
      });
    }
    tweetReply.value = ''
    selectedFile.value = null
}


const commentAddImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
        selectedFile.value = readerEvent.target.result;
    };
};

const timeOfUpdate = (time) => {
  let updateTime = ''
  updateTime = format(time?.toDate())
  return updateTime
}
</script>

<template>
  <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4">
    <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
      <h1>Tweet</h1>
    </div>
    <div class="border-b border-gray-300">
      <div class="p-3">
        <div>
          <div class="flex space-x-2">
            <img :src="tweet?.user?.photoURL" :alt="tagName" className="h-11 w-11 rounded-full" />
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="font-bold text-[15px] sm:text-base">
                  {{ tweet?.user.name }}
                </h4>
                <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                <div>{{ timeAgo }}</div>
              </div>
              <h5 class="text-[15px] sm:text-base">
                <span class="text-[#1ca0f2]">{{ tagName }}</span>
              </h5>
            </div>
          </div>
          <p class="text-gray-600 my-2">{{ tweet?.tweet }}</p>
          <div v-if="tweet?.image" class="my-2">
            <img :src="tweet?.image" :alt="tagName" class="object-contain rounded-xl" />
          </div>
        </div>
        <div class="text-[15px] my-2 sm:text-base flex items-center justify-between">
          <div class="flex space-x-2">
            <p>{{ comments.length }}</p>
            <p>Comments</p>
          </div>
          <div class="flex space-x-2">
            <p>{{ likes.length }}</p>
            <p>Likes</p>
          </div>
          <div class="flex space-x-2">
            <p>{{ retweets.length }}</p>
            <p>Retweets</p>
          </div>
        </div>
        <div class="flex my-3 justify-between w-full">
          <div class="flex items-center space-x-1">
            <ChatBubbleOvalLeftIcon class="w-6 h-6 text-[#1ca0f2]" />
          </div>
          <div class="flex items-center space-x-1 cursor-pointer">
            <HeartIconFilled v-if="liked" class="text-[#f60100] w-6" />
            <HeartIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
          </div>
          <div class="flex items-center space-x-1 cursor-pointer">
            <ArrowsUpDownIconFilled v-if="isRetweeted" class="w-6 h-6 text-green-700" />
            <ArrowsUpDownIcon v-else class="w-6 h-6 text-[#1ca0f2]" />
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-300 p-2">
      <div class="flex mt-4 space-x-3 w-full">
        <img :src="user?.photoURL" :alt="user?.displayName" class="h-11 w-11 rounded-full" />
        <form @submit.prevent="commentOnPost" class="flex-grow">
          <textarea :placeholder="'Replying to ' + tagName" rows="2" v-model="tweetReply"
            class="outline-none tracking-wide min-h-[80px] bg-transparent w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          <div v-if="selectedFile" class="relative my-2">
            <div class="w-8 h-8 left-1 cursor-pointer">
              <XMarkIcon @click="selectedFile = null" class="text-black h-5" />
            </div>
            <img :src="selectedFile" :alt="user?.displayName" class="rounded-2xl max-h-80 object-contain mb-2" />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center" @click="pickFile">
              <label for="commentImageFile" class="cursor-pointer">
                <PhotoIcon class="w-8 text-[#1ca0f2]" />
              </label>
              <input type="file" id="commentImageFile" hidden @change="commentAddImageToPost" />
            </div>
            <button class="bg-[#1ca0f2] text-white p-2 my-2 rounded-2xl" type="submit">
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="p-3">
      <div class="relative">
        <div v-for="comment in comments" :key="comment.id" class="flex space-x-2 my-4 border-b border-gray-300">
          <img :src="comment?.user?.photoURL" :alt="comment?.user?.displayName" class="h-11 w-11 rounded-full" />
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="font-bold text-[15px] sm:text-base">
                {{ comment?.user.name }}
              </h4>
              <div class="w-2 h-2 rounded-full bg-gray-400"></div>
              <div>{{ timeOfUpdate(comment?.timestamp)}}</div>
            </div>
            <h5 class="text-[15px] sm:text-base">
              Replying to
              <span class="text-[#1ca0f2] mx-2">{{ tagName }}</span>
            </h5>
            <p class="text-gray-600 my-2">{{ comment?.comment }}</p>
            <div v-if="comment?.image" className="my-2">
              <img :src="comment?.image" :alt="comment?.id" class="object-contain rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
