<!-- eslint-disable ts/ban-ts-comment -->
<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  data: ImagesData
}>()

// console.log(props)

// const testImages: ImagesData = [
//   {
//     basename: '1.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '2.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '2.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '3.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '4.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '5.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '6.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '7.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '8.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '9.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
//   {
//     basename: '10.png',
//     extname: '.png',
//     imageFileUri: 'file:///C:/Users/Administrator/Desktop/1.png',
//     imageVsCodePath: 'https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16',
//   },
// ]
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(54px,1fr))] justify-items-center gap-3">
    <div
      v-for="path of props.data" :key="path.basename" :data-vscode-context="JSON.stringify({ webviewSection: 'imgItem', preventDefaultContextMenuItems: true, selectedUri: path.imageFileUri })" size-full flex flex-col items-center
    >
      <div relative aspect-ratio-square flex-1 cursor-pointer overflow-hidden rounded-1 bg-gray-300 class="max-w-30 min-w-16 hover:(ring-3 ring-amber)">
        <img :src="path.imageVsCodePath" class="size-full rounded-1 object-contain" :alt="path.basename">

        <span absolute bottom-0 right-0 rounded-tl-1 px-1 py-0 class="bg-gray-700/70 text-white leading-tight">{{ path.extname }}</span>
      </div>
      <div w-full py-1>
        <span class="line-clamp-1 break-all text-center text-sm">{{ path.basename }}</span>
      </div>
    </div>
  </div>
</template>
