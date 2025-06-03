<template>
   <main v-if="props.imagePreview.length"
      class="absolute inset-0 flex items-center justify-center z-[100] bg-black/30">
      <aside @click.stop class="bg-white/90 w-[450px] max-w-[90%] max-h-[90%] flex flex-col rounded-md border p-2">
         <header class="mb-2 text-right">
            <button @click="$emit('clear')" class="w-8 h-8 hover:bg-gray-200 rounded-full">
               <i class="fa-solid fa-xmark"></i>
            </button>
         </header>
         <div class="grid grid-cols-2 grid-rows-[repeat(200px,200px)] gap-2 overflow-y-auto ">
            <img v-for="image in props.imagePreview" :src="image" :class="[
               { 'col-span-2 w-full': props.imagePreview.length == 1 },
               { 'max-h-80': props.imagePreview.length > 1 },
            ]" class="rounded h-full object-cover" />
         </div>
         <footer class="mt-2 text-right">
            <button @click="$emit('sendFile')" class="h-8 hover:bg-zinc-700 rounded px-3 uppercase bg-zinc-900 text-white">
               Send files
            </button>
         </footer>
      </aside>
   </main>
</template>

<script setup lang="ts">
const props = defineProps(['imagePreview'])
</script>