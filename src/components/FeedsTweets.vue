<script setup>
import { MagnifyingGlassIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid"
</script>

<template>
    <section class="sticky top-0 h-screen hidden sm:w-[600px] sm:block sm:col-span-2 p-2 border border-gray-200">
        <div class="flex space-x-2 items-center bg-[#eff3f4] rounded-2xl p-3 my-2">
            <MagnifyingGlassIcon class="w-9 h-9 text-gray-600" />
            <input type="text" class="w-full rounded-md border-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-[#eff3f4]" placeholder="Search Twitter" />
        </div>
        <div class="my-4">
            <h1 class="text-xl font-bold">Trends for you</h1>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Sports</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Erling Haaland</p>
                        <p class="text-gray-500">52k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Technology</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>GitHub</p>
                        <p class="text-gray-500">30.2k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Politics</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Andrew Tate</p>
                        <p class="text-gray-500">166k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Sports</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Messi</p>
                        <p class="text-gray-500">234k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Politics</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Congolese</p>
                        <p class="text-gray-500">52k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Technology</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Vue</p>
                        <p class="text-gray-500">522k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Widlife</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Mermaid</p>
                        <p class="text-gray-500">2k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
            <div class="my-2">
                <div class="flex justify-between">
                    <div class="text-sm">
                        <div class="flex space-x-2 items-center text-gray-500">
                            <p>Tourism</p>
                            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Kenya</p>
                        <p class="text-gray-500">1,673 Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon class="w-6 h-6" />
                </div>
            </div>
        </div>
    </section>
</template>
