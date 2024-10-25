<script setup lang="ts">
import { computed, ref } from 'vue'
import List from './components/List.vue'
import SearchBar from './SearchBar.vue'

// const { window, workspace } = acquireVsCodeApi()

const vscodePostData = ref()

const search = ref('')
const imagesDataFilter = computed(() => (vscodePostData.value.imagesData as ImagesData).filter(imageData => imageData.basename.includes(search.value)))

window.addEventListener('message', (e) => {
  const receiveData = e.data

  if (receiveData.type === 'initImages' || receiveData.type === 'updateImages') {
    vscodePostData.value = receiveData.data
    console.log('🚀 ~ window.addEventListener ~ receiveData.data:', receiveData.data)
  }
})

const imageSize = ref<PineConeImageSize>('medium')
</script>

<template>
  <div v-if="vscodePostData" space-y-4>
    <SearchBar v-model:search="search" v-model:image-size="imageSize" />

    <!-- Breadcrumbs -->
    <div border-b-2 border-amber border-solid pb-2 class="text-base sm:text-lg">
      {{ vscodePostData.currentAssetsPath }} ({{ vscodePostData.imagesData.length }})
    </div>

    <List :data="imagesDataFilter" :size="imageSize" />
  </div>
</template>
