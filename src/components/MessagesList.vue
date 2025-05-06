<template>
   <div class="flex-grow relative">
      <div class="flex flex-col overflow-x-auto absolute inset-0" @scroll="emit('chatScroll', $event)">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['chatScroll'])
</script>