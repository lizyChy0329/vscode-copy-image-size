<script setup lang="ts">
import { imageSize, isLandscape, search } from '../state'
import SearchBarLandscape from './SearchBarLandscape.vue'
import SearchBarPortrait from './SearchBarPortrait.vue'

if (isLandscape.value) {
  imageSize.value = 'small'
}
else {
  imageSize.value = 'medium'
}
</script>

<template>
  <div>
    <SearchBarLandscape v-if="isLandscape" v-model:search="search" v-model:image-size="imageSize" />
    <SearchBarPortrait v-if="!isLandscape" v-model:search="search" v-model:image-size="imageSize" />
  </div>
</template>
