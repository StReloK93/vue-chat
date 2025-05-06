<template>
   <form @submit.prevent="emit('submit')" class="flex flex-row items-start py-4 rounded bg-white w-full px-4">
      <div class="flex-grow">
         <div class="w-full relative">
            <textarea @mouseover="closeEmoji" @keydown.enter="emit('submit-enter', $event)" @click="changer" @keyup="changer"
               @select="changer" ref="textArea" type="text" v-model="message"
               class="flex w-full border focus:outline-none focus:border-indigo-300 py-2 pl-3 pr-10 max-h-24 h-20 min-h-11">
							</textarea>
            <button @mouseover="openEmoji" type="button" :class="{ 'text-blue-600': emojiToggle }"
               class="absolute top-2 right-3  text-xl">
               <i class="fa-regular fa-face-smile"></i>
            </button>
            <Transition name="slide-fade">
               <emoji-picker v-show="emojiToggle" ref="emojiRef" @mouseover="openEmoji" @mouseout="closeEmoji"
                  class="light absolute -top-[420px] sm:right-0" />
            </Transition>
         </div>
      </div>
      <div class="ml-4">
         <button type="submit" :disabled="props.messageContain"
            class="flex items-center justify-center h-12 w-12  bg-indigo-500 shadow hover:bg-indigo-600 rounded-full text-white px-4 py-1 flex-shrink-0 disabled:bg-gray-300">
            <span>
               <i class="fa-solid fa-paper-plane-top"></i>
            </span>
         </button>
      </div>
   </form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
var startPosition = 0
var endPosition = 0
const props = defineProps(['messageContain'])

const emit = defineEmits(['submit', 'submit-enter'])
const message: any = defineModel()
const textArea = ref()
const emojiToggle = ref(false)
const emojiRef = useTemplateRef<HTMLElement>('emojiRef')
onClickOutside(emojiRef, (event) => {
   if (textArea.value == event.target) return
   if (emojiToggle.value) emojiToggle.value = false
})
const timerId: any = ref(null)
function openEmoji() {
   emojiToggle.value = true
   clearTimeout(timerId.value)
}
function closeEmoji() {
   timerId.value = setTimeout(() => {
      emojiToggle.value = false
   }, 500)
}

function changer() {
   startPosition = textArea.value.selectionStart;
   endPosition = textArea.value.selectionEnd;
}

function insertAtCaret(emoji: string) {
   if (startPosition == endPosition) {
      message.value = message.value.slice(0, startPosition) + emoji + message.value.slice(startPosition);
   }
   else {
      message.value = message.value.slice(0, startPosition) + emoji + message.value.slice(endPosition);
   }
   startPosition += emoji.length
   endPosition += emoji.length
}

onMounted(() => {
   if (emojiRef.value) {
      emojiRef.value.addEventListener('emoji-click', (event: any) => {
         insertAtCaret(event.detail.unicode)
      });
   }
})
</script>