<template>
   <div class="mr-1 rounded overflow-hidden w-96">
      <h3 class="p-5 pb-2 uppercase font-semibold text-sm">
         All messages
      </h3>
      <button 
         v-for="menu in menuUsers"
         @click="emit('selectChat',menu.user.ipAddress)"
         class="flex w-full leading-none px-5 py-1 items-center" :class="{ 'bg-white': activeChat == menu.user.ipAddress }"
      >
         <section :class="[colors[Math.floor(Math.random() * colors.length)]]" class="w-12 h-12 min-w-12  text-center content-center text-white rounded-full mr-3 relative">
            <i :class="[icons[Math.floor(Math.random() * icons.length)]]"></i>
            <span v-if="menu.user.online" class="w-3 h-3 bg-teal-600 bg-teal-5 inline-block rounded-full absolute right-0 bottom-0 border"></span>
         </section>
         <section class="flex-grow">
            <main class="flex items-center gap-x-2 justify-between capitalize mb-px font-semibold">
               {{ menu.user.ipAddress }}
            </main>
            <div class="text-left flex items-center">
               <aside class="flex-grow flex items-center">
                  <!-- <i v-if="user?.ipAddress == menu.messages.at(-1)?.from"
                     class="fa-solid fa-user text-sky-900 text-sm mr-1.5"></i> -->
                  <p class="line-clamp-1 text-gray-400 text-sm">
                     {{ menu.messages.at(-1)?.text }}
                  </p>
               </aside>
               <div class="min-w-7 text-right">
                  <span style="font-family: monospace;" class="w-5 h-5 text-[11px]  text-center content-center bg-teal-600 text-white inline-block rounded-full"
                     v-if="menu.issetNewMessage.length">
                     +{{ menu.issetNewMessage.length }}
                  </span>
               </div>
            </div>
         </section>
      </button>
   </div>
</template>

<script setup lang="ts">
import type { IUser } from 'global';
import { Message } from 'global/helpers';
const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
const icons = ['fa-solid fa-apple-whole', 'fa-solid fa-share-nodes', 'fa-solid fa-comet', 'fa-solid fa-user-secret', 'fa-solid fa-hat-cowboy']


const emit = defineEmits(['selectChat'])
interface IMenuUsers {
   user: IUser;
   messages: Message[];
   issetNewMessage: Message[];
}
const props = defineProps<{
   menuUsers: IMenuUsers[]
   activeChat: string | null,
   user: IUser
}>()
</script>