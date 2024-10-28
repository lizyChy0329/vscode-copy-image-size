<script setup lang="ts">
import type { ImagesData } from './types'
import { computed, ref } from 'vue'
import List from './components/List.vue'
import SearchBar from './components/SearchBar.vue'
import { imageSize, isLandscape } from './state'

// const { window, workspace } = acquireVsCodeApi()

const vscodePostData = ref()

const search = ref('')
const imagesDataFilter = computed(() => (vscodePostData.value?.imagesData as ImagesData)?.filter(imageData => imageData.basename.includes(search.value)))

window.addEventListener('message', (e) => {
  const receiveData = e.data

  if (receiveData.type === 'initImages' || receiveData.type === 'updateImages') {
    vscodePostData.value = receiveData.data
  }
})
</script>

<template>
  <div
    flex="~" space-y-4 :class="{
      'flex-row': isLandscape,
      'flex-col': !isLandscape,
    }"
  >
    <SearchBar />

    <div w-full space-y-2>
      <div v-if="!isLandscape && vscodePostData" border-b-2 border-amber border-solid pb-2 class="text-base sm:text-lg">
        {{ vscodePostData.currentAssetsPath }} ({{ vscodePostData.imagesData.length }})
      </div>
      <List :data="imagesDataFilter" :size="imageSize" />
    </div>
  </div>
</template>
