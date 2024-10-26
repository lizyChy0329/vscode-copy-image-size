import type { PineConeImageSize } from './types'
import { ref } from 'vue'

export const isLandscape = ref(false)

function orientation() {
  isLandscape.value = window.innerWidth > window.innerHeight
}

orientation()

window.addEventListener('resize', orientation)

export const search = ref('')
export const imageSize = ref<PineConeImageSize>('medium')
