<script setup>
import { auth } from "@/firebaseConfig";
import { computed, ref } from "vue";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, uploadString, ref as storageRef } from "@firebase/storage";
import { XMarkIcon, PhotoIcon } from "@heroicons/vue/24/outline";

const tweet = ref('')
const selectedFile = ref(null)

const user = computed(() => {
  return auth.currentUser;
});

const handleSubmit = async () => {
  const docRef = await addDoc(collection(db, "tweets"), {
    tweet: tweet.value,
    user: {
      uid: user.value.uid,
      name: user.value.displayName,
      photoURL: user.value.photoURL
    },
    timestamp: serverTimestamp()
  })
  const imageRef = storageRef(storage, `tweets/${docRef.id}/images`);
  if (selectedFile.value) {
    await uploadString(imageRef, selectedFile.value, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "tweets", docRef.id), {
        image: downloadURL,
      });
    });
  }
  tweet.value = ''
  selectedFile.value = ''
}


const addImageToPost = (e) => {
  const reader = new FileReader();
  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
  }
  reader.onload = (readerEvent) => {
    selectedFile.value = readerEvent.target.result;
  };
};
</script>

<template>
  <div class="flex mt-4 space-x-3 w-full p-2">
    <img :src="user.photoURL" alt="" class="h-11 w-11 rounded-full" />
    <form @submit.prevent="handleSubmit" class="flex-grow">
      <textarea rows="2" v-model="tweet" placeholder="What's Happening?"
        class="outline-none tracking-wide min-h-[80px] bg-transparent w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      <div v-if="selectedFile" class="relative my-2">
        <div class="w-8 h-8 left-1 cursor-pointer" @click="selectedFile = null">
          <XMarkIcon class="text-black h-5" />
        </div>
        <img v-if="selectedFile" :src="selectedFile" alt="" class="rounded-2xl max-h-80 object-contain mb-2" />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="flex items-center" @click="pickFile">
            <label for="imageFile" class="cursor-pointer">
              <PhotoIcon class="w-8 text-[#1ca0f2]" />
            </label>
            <input type="file" id="imageFile" hidden @change="addImageToPost" />
          </div>
        </div>
        <button class="bg-[#1ca0f2] text-white p-2 my-2 rounded-2xl" type="submit">
          Tweet
        </button>
      </div>
    </form>
  </div>
</template>
