<script setup lang="ts">
import { imageSize, isLandscape } from '../state'
import List from './List.vue'
import SearchBar from './SearchBar.vue'
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
      <div v-if="!isLandscape" border-b-4 border-b-amber px-2>
        \assets\pinecone\dotcatCollection
      </div>
      <List :size="imageSize" />
    </div>
  </div>
</template>
