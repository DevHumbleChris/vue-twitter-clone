<script setup>
import { auth } from "@/firebaseConfig";
import { computed, ref } from "vue";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, uploadString } from "@firebase/storage";
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
    const imageRef = ref(storage, `tweets/${docRef.id}/images`);
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
    <!-- <div class="flex space-x-2">
        <img :src="user.photoURL" alt="user-logo" class="w-16 h-16 border border-gray-200 rounded-full" />
        <form @submit.prevent="handleSubmit">
            <textarea id="about" name="tweet" rows="3" v-model="tweet"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="What's Happening?"></textarea>
            <div class="my-3 sm:flex justify-between">
                <div class="flex space-x-2 sm:w-[20rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#1ca0f2" class="w-8">
                        <path
                            d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z" />
                    </svg>
                    <GifIcon class="text-[#1ca0f2] w-8" />
                    <ListBulletIcon class="text-[#1ca0f2] w-8" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#1ca0f2" class="w-8">
                        <path
                            d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm194.8 170.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5 22.4 26.9 55.2 42.2 90.2 42.2s67.8-15.4 90.2-42.2c13.4-16.2 38.1 4.2 24.6 20.5z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#1ca0f2" class="w-8">
                        <path
                            d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z" />
                    </svg>
                    <MapPinIcon class="text-[#1ca0f2] w-8" />
                </div>
                <div>
                    <button type="submit" :disabled="!tweet"
                        class="bg-[#1ca0f2] text-white p-3 w-full my-2 rounded-2xl">Tweet</button>
                </div>
            </div>
        </form>
    </div> -->
    <div class="flex mt-4 space-x-3 w-full">
        <img :src="user.photoURL" alt="" class="h-11 w-11 rounded-full" />
        <form @submit.prevent={handleSubmit} className="flex-grow">
          <textarea
            rows="2"
            v-model="tweet"
            placeholder="What's Happening?"
            class="outline-none tracking-wide min-h-[80px] bg-transparent w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
          <div v-if="selectedFile" class="relative my-2">
            <div
              class="w-8 h-8 left-1 cursor-pointer"
              @click="selectedFile = null"
            >
              <XMarkIcon class="text-black h-5" />
            </div>
            <img
              src={selectedFile}
              alt=""
              class="rounded-2xl max-h-80 object-contain mb-2"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                class="flex items-center cursor-pointer"
              >
              <!-- onClick={() => filePickerRef.current.click()} -->
                <PhotoIcon class="w-8 text-[#1ca0f2]" />
                <input
                  type="file"
                  hidden
                  @change="addImageToPost"
                />
                <!-- onChange={addImageToPost}
                  ref={filePickerRef} -->
              </div>
            </div>
            <button
              class="bg-[#1ca0f2] text-white p-2 my-2 rounded-2xl"
              disabled={!tweet}
              type="submit"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
</template>
