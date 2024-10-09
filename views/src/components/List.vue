<!-- eslint-disable ts/ban-ts-comment -->
<script setup lang="ts">
import { ref } from 'vue'

const vscode = acquireVsCodeApi()
console.log(vscode)

const list = ref([])
const imagesData = ref()

window.addEventListener('message', (e) => {
  const receiveData = e.data

  if (receiveData.type === 'initImages') {
    imagesData.value = receiveData.data
    list.value = receiveData.data.imagesData.imageVsCodePathList
  }
  console.log('🚀 ~ window.addEventListener ~ receiveData:', receiveData)
})
</script>

<template>
  <div my-3 flex px-2 space-x-2>
    <div flex-1>
      <input type="text" placeholder="我是输入框" class="w-full rounded-1 bg-gray-100 bg-gray-300 px-2 py-1 text-gray-600">
    </div>
    <div flex shrink-0 items-center space-x-1>
      <div flex items-center justify-center rounded-1 bg-amber p-1 leading-none>
        D
      </div>
      <div flex items-center justify-center rounded-1 bg-emerald p-1 leading-none>
        S
      </div>
      <div flex items-center justify-center rounded-1 bg-fuchsia p-1 leading-none>
        B
      </div>
    </div>
  </div>

  <!-- Breadcrumbs -->
  <div class="border-b-4 border-amber border-solid pb-4">
    {{ imagesData }}
  </div>

  <!-- image dock -->
  <div grid grid-cols-2 justify-items-center gap-4 px-2 class="md:grid-cols-4 sm:grid-cols-3">
    <div v-for="imgItem of list" :key="imgItem" size-full flex flex-col items-center>
      <div aspect-ratio-square flex-1 cursor-pointer overflow-hidden rounded-1 bg-gray-300 class="hover:(ring-3 ring-amber)">
        <img :src="imgItem" class="size-full object-contain">
      </div>
      <div w-full py-1>
        <span class="line-clamp-1 break-all text-sm">{{ imgItem }}</span>
      </div>
    </div>
  </div>
</template>
