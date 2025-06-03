<template>
  <section style="height: 100dvh;">
    <RouterView />
  </section>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

const preventDefault = (e: Event) => e.preventDefault()
onMounted(() => {
  window.addEventListener('dragover', preventDefault)
  window.addEventListener('drop', preventDefault)
})

onUnmounted(() => {
  window.removeEventListener('dragover', preventDefault)
  window.removeEventListener('drop', preventDefault)
})
</script>