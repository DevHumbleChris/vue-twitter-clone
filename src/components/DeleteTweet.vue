<script setup>
import { computed } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import { useTweetStore } from '@/stores/tweets'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig'
import { toast } from 'vue3-toastify';

const store = useTweetStore()

const isOpen = computed(() => {
    return store.isDeleteModal
})

const tweet = computed(() => {
    return store.tweetToBeDeleted
})

function closeModal() {
    store.closeDeleteModal()
}

const deleteTweet = async () => {
    try {
        await deleteDoc(doc(db, "tweets", tweet.value.id));
        store.closeDeleteModal()
        toast('Tweet Deleted Successfully!', {
            type: 'info',
            theme: 'colored'
        })
    } catch (err) {
        toast(err.message, {
            type: 'error',
            theme: 'colored'
        })
    }
};
</script>

<template>
    <TransitionRoot appear :show="isOpen" as="template">
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
                            <div class="flex space-x-3">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                    Are you sure you want to delete this tweet?
                                </DialogTitle>
                            </div>
                            <div class="text-sm text-gray-500">
                                <div>
                                    <p v-if="tweet.tweet" class="my-2">{{ tweet.tweet }}</p>
                                    <div v-if="tweet.image" class="my-2">
                                        <img :src="tweet.image" :alt="tweet.id" class="object-contain rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 flex justify-between">
                                <button type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    @click="closeModal">
                                    No, Thanks!
                                </button>
                                <button @click="deleteTweet" type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                                    Yes, Delete!
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
