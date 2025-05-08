<template>
   <div ref="airnet" class="flex-grow relative">
      <div class="flex flex-col overflow-x-auto absolute inset-0 hidden-scroll" @scroll="emit('chatScroll', $event)">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['chatScroll'])
const airnet = ref(null)

defineExpose({airnet})
</script>