<!-- eslint-disable ts/ban-ts-comment -->
<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  data: ImagesData
}>()
</script>

<template>
  <div grid grid-cols-2 min-w-38 justify-items-center gap-4 px-2 class="md:grid-cols-4 sm:grid-cols-3">
    <div
      v-for="path of props.data" :key="path.basename" :data-vscode-context="JSON.stringify({ webviewSection: 'imgItem', preventDefaultContextMenuItems: false, selectedUri: path.imageFileUri })" size-full flex flex-col items-center
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
