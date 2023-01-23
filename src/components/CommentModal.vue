<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useTweetStore } from '@/stores/tweets'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import { auth, db, storage } from '../firebaseConfig'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from '@firebase/firestore'
import { getDownloadURL, uploadString } from '@firebase/storage'
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { format } from 'timeago.js'

const tweetReply = ref('')
const selectedFile = ref(null)

const user = computed(() => {
    return auth.currentUser
})

const store = useTweetStore()

const isModal = computed(() => {
    return store.isCommentModalOpen
})

const tweet = ref(null)
watchEffect(() => {
    tweet.value = store?.tweetSelected
})

function closeModal() {
    store.openCommentModal()
}

const commentOnPost = async () => {
    const docRef = await addDoc(
        collection(db, "tweets", tweet?.value.id, "comments"),
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
    const imageRef = ref(storage, `tweets/${tweet?.value.id}/comments/${docRef.id}/images`);
    if (selectedFile.value) {
        await uploadString(imageRef, selectedFile.value, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "tweets", docRef.id), {
                image: downloadURL,
            });
        });
    }
    tweetReply.value = ''
    selectedFile.value = null
    store.openCommentModal()
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

const timeAgo = ref('')
watchEffect(() => {
    const tweetTime = format(tweet?.value.timestamp?.toDate())
    timeAgo.value = tweetTime
})
</script>

<template>
    <TransitionRoot appear :show="isModal" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3"
                                class="text-lg font-medium leading-6 text-gray-900 absolute bg-[#1ca0f2] rounded-full top-3 right-3 cursor-pointer" @click="store.openCommentModal"
                                >
                                <XMarkIcon class="w-6 text-white" />
                            </DialogTitle>
                            <div class="flex gap-x-3 relative my-2">
                                <span class="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
                                <img :src="tweet?.user?.photoURL" :alt="tweet?.user?.name"
                                    class="h-11 w-11 rounded-full" />
                                <div>
                                    <div class="inline-block group">
                                        <div class="flex items-center space-x-2 justify-between">
                                            <h4 class="font-bold text-[15px] sm:text-base">
                                                {{ tweet?.user?.name }}
                                            </h4>
                                            <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                                            <span class="text-[10px] sm:text-base">
                                                {{ timeAgo }}
                                            </span>
                                        </div>
                                        <div>
                                            <p class="text-gray-600 my-2">{{ tweet?.tweet }}</p>
                                            <div v-if="tweet.image" class="my-2">
                                                <img :src="tweet?.image" :alt="tweet?.id"
                                                    class="object-contain rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex mt-4 space-x-3 w-full">
                                <img :src="user?.photoURL" :alt="user?.displayName" class="h-11 w-11 rounded-full" />
                                <form @submit.prevent="commentOnPost" class="flex-grow">
                                    <textarea placeholder="Reply tweet..." rows="2" v-model="tweetReply"
                                        class="outline-none tracking-wide min-h-[80px] bg-transparent w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></textarea>
                                    <div v-if="selectedFile" class="relative my-2">
                                        <div class="w-8 h-8 left-1 cursor-pointer" @click="selectedFile = null">
                                            <XMarkIcon class="text-black h-5" />
                                        </div>
                                        <img v-if="selectedFile" :src="selectedFile" :alt="user.displayName"
                                            class="rounded-2xl max-h-80 object-contain mb-2" />
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex items-center" @click="pickFile">
                                              <label for="commentImageFile" class="cursor-pointer">
                                                <PhotoIcon class="w-8 text-[#1ca0f2]" />
                                              </label>
                                              <input type="file" id="commentImageFile" hidden @change="commentAddImageToPost" />
                                            </div>
                                        </div>
                                        <button class="bg-[#1ca0f2] text-white p-2 my-2 rounded-2xl" type="submit">
                                            Tweet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

</template>
