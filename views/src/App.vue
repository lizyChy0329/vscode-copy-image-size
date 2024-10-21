<script setup lang="ts">
import { computed, ref } from 'vue'
import List from './components/List.vue'

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
</script>

<template>
  <div v-if="vscodePostData" space-y-4>
    <div my-3 flex px-2 space-x-2>
      <div flex-1>
        <input v-model="search" type="text" placeholder="我是输入框" class="w-full rounded-1 bg-gray-100 bg-gray-300 px-2 py-1 text-gray-600">
      </div>
      <div flex shrink-0 items-center text-white space-x-1>
        <div flex items-center justify-center rounded-1 bg-amber p-1 leading-none>
          I
        </div>
        <div flex items-center justify-center rounded-1 bg-emerald p-1 leading-none>
          K
        </div>
        <div flex items-center justify-center rounded-1 bg-fuchsia p-1 leading-none>
          UN
        </div>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <div border-b-2 border-amber border-solid pb-2 class="text-base sm:text-lg">
      {{ vscodePostData.currentAssetsPath }} ({{ vscodePostData.imagesData.length }})
    </div>

    <List :data="imagesDataFilter" />
  </div>
</template>
