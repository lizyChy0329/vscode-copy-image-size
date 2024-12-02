<script setup lang="ts">
const searchVModel = defineModel('search')
const imageSizeVModel = defineModel('imageSize')
</script>

<template>
  <div my-3 flex space-x-2>
    <div flex-1>
      <input v-model="searchVModel" type="text" placeholder="ikun search" class="w-full rounded-1 bg-gray-100 bg-gray-300 px-2 py-1 text-gray-600">
    </div>

    <div flex shrink-0 items-center text-white space-x-1>
      <div
        flex cursor-pointer items-center justify-center rounded-1 p-1 leading-none
        :class="[imageSizeVModel === 'small' ? 'bg-amber' : 'bg-gray-300']"
        @click="imageSizeVModel = 'small'"
      >
        I
      </div>
      <div
        flex cursor-pointer items-center justify-center rounded-1 bg-emerald p-1 leading-none
        :class="[imageSizeVModel === 'medium' ? 'bg-emerald' : 'bg-gray-300']"
        @click="imageSizeVModel = 'medium'"
      >
        K
      </div>
      <div
        flex cursor-pointer items-center justify-center rounded-1 p-1 leading-none
        :class="[imageSizeVModel === 'large' ? 'bg-fuchsia' : 'bg-gray-300']"
        @click="imageSizeVModel = 'large'"
      >
        UN
      </div>
    </div>
  </div>
</template>
