<!-- eslint-disable ts/ban-ts-comment -->
<script setup lang="ts">
import { defineProps } from 'vue'

const { imagesData } = defineProps<{
  imagesData: {
    imagePathList: string[]
    imageVsCodePathList: string[]
    basenameList: string[]
  }

}>()
// const vscode = acquireVsCodeApi()
// console.log(vscode)
</script>

<template>
  <div grid grid-cols-2 justify-items-center gap-4 px-2 class="md:grid-cols-4 sm:grid-cols-3">
    <div v-for="path, index of imagesData.imageVsCodePathList" :key="path" size-full flex flex-col items-center>
      <div aspect-ratio-square flex-1 cursor-pointer overflow-hidden rounded-1 bg-gray-300 class="hover:(ring-3 ring-amber)">
        <img :src="path" class="size-full object-contain">
      </div>
      <div w-full py-1>
        <span class="line-clamp-1 break-all text-sm">{{ imagesData.basenameList[index] }}</span>
      </div>
    </div>
  </div>
</template>
