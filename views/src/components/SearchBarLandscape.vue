<script setup lang="ts">
// const searchVModel = defineModel('search')
const imageSizeVModel = defineModel('imageSize')
</script>

<template>
  <div flex="~ col" my-3 mr-3 border-r-1 border-r-amber pr-3 text-white space-y-1>
    <!-- <div flex-1>
      <input v-model="searchVModel" type="text" placeholder="我是输入框" class="w-full rounded-1 bg-gray-100 bg-gray-300 px-2 py-1 text-gray-600">
    </div> -->

    <div
      cursor-pointer rounded-1 p-1 text-center leading-none
      :class="[imageSizeVModel === 'small' ? 'bg-amber' : 'bg-gray-300']"
      @click="imageSizeVModel = 'small'"
    >
      I
    </div>
    <div
      w-full cursor-pointer rounded-1 p-1 text-center leading-none
      :class="[imageSizeVModel === 'medium' ? 'bg-emerald' : 'bg-gray-300']"
      @click="imageSizeVModel = 'medium'"
    >
      K
    </div>
    <div
      cursor-pointer rounded-1 p-1 text-center leading-none
      :class="[imageSizeVModel === 'large' ? 'bg-fuchsia' : 'bg-gray-300']"
      @click="imageSizeVModel = 'large'"
    >
      UN
    </div>
  </div>
</template>
