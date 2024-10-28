<!-- eslint-disable ts/ban-ts-comment -->
<script setup lang="ts">
import type { ImageListData } from '../schema.ts'
import type { PineConeImageSize } from '../types'
import { computed, defineProps } from 'vue'
import { imageListMock } from '../schema.ts'

const { data = imageListMock, size = 'medium' } = defineProps<{
  data?: ImageListData
  size?: PineConeImageSize
}>()

// const gridRepeatMode = computed(() => {
//   switch (size) {
//     case 'small':
//       return 'grid-cols-[repeat(auto-fit,minmax(60px,1fr))]'
//     case 'medium':
//       return 'grid-cols-[repeat(auto-fit,minmax(80px,1fr))]'
//     case 'large':
//       return 'grid-cols-[repeat(auto-fit,minmax(120px,1fr))]'

//     default:
//       return ''
//   }
// })
const gridRepeatMode = computed(() => {
  switch (size) {
    case 'small':
      return 'size-60px'
    case 'medium':
      return 'size-80px'
    case 'large':
      return 'size-100px'

    default:
      return ''
  }
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="path of data" :key="path.basename" :data-vscode-context="JSON.stringify({ webviewSection: 'imgItem', preventDefaultContextMenuItems: true, selectedUri: path.imageFileUri })"
    >
      <!-- image -->
      <div relative aspect-ratio-square cursor-pointer overflow-hidden rounded-1 bg-gray-300 class="max-w-30 min-w-16 hover:(ring-3 ring-amber)" :class="gridRepeatMode">
        <img :src="path.imageVsCodePath" class="size-full object-contain" :alt="path.basename">

        <span absolute bottom-0 right-0 rounded-tl-1 px-1 py-0 class="bg-gray-700/70 text-white leading-tight">{{ path.extname }}</span>
      </div>
      <!-- title -->
      <div w-full py-1>
        <span class="line-clamp-1 break-all text-center text-sm">{{ path.basename }}</span>
      </div>
    </div>
  </div>
</template>
