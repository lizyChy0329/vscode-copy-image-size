<script setup lang="ts">
import { ref } from 'vue'
import List from './components/List.vue'

// const { window, workspace } = acquireVsCodeApi()

const vscodePostData = ref()

// function getDocumentWorkspaceFolder(): string | undefined {
//   const fileName = window.activeTextEditor?.document.fileName
//   return workspace.workspaceFolders
//     ?.map(folder => folder.uri.fsPath)
//     .filter(fsPath => fileName?.startsWith(fsPath))[0]
// }

window.addEventListener('message', (e) => {
  const receiveData = e.data

  if (receiveData.type === 'initImages') {
    vscodePostData.value = receiveData.data
  }
  // imagesData.imageVsCodePathList
  console.log('🚀 ~ window.addEventListener ~ receiveData:', receiveData)
})
</script>

<template>
  <div v-if="vscodePostData" space-y-4>
    <!-- {{ getDocumentWorkspaceFolder() }} -->
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
    <div class="border-b-2 border-amber border-solid pb-4 text-lg">
      x/y({{ vscodePostData.imagesData.basenameList.length }})
    </div>

    <List :images-data="vscodePostData.imagesData" />
  </div>
</template>
