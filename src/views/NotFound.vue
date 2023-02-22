<script setup>
import SvgError404 from '@/components/SvgError404.vue'
</script>

<template>
    <div class="text-center justify-center my-6 space-y-3">
        <SvgError404 />
        <div class=" tracking-widest space-y-2">
            <p class="text-[#32475c] text-6xl">
                <span>4 0 4</span>
            </p>
            <p class="text-[#40b27f] text-xl">
                Sorry, We couldn't find what you are looking for!
            </p>
        </div>
        <router-link to="/home">
            <button class="text-white text-xl bg-[#32475c] p-3 rounded-md hover:shadow-md my-2">
                Go back
            </button>
        </router-link>
    </div>
</template>
