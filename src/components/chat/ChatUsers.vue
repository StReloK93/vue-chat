<template>
   <div class="mr-1 rounded overflow-hidden w-full sm:w-72 bg-white h-full">
      <h3 class="h-14 px-6 uppercase font-semibold text-sm content-center">
         All messages
      </h3>
      <button v-for="currentUser in props.menuUsers" @click="emit('selectChat', currentUser.ipAddress)"
         class="flex w-full leading-none px-5 py-1.5 items-center rounded-r-2xl"
         :class="{ 'bg-gray-100': props.activeChat == currentUser.ipAddress }">
         <section :class="[currentUser.color]"
            class="w-12 h-12 min-w-12  text-center content-center text-white rounded-full mr-3 relative">
            <i :class="[currentUser.icon]"></i>
            <span v-if="currentUser.online"
               class="w-3 h-3 bg-teal-600 bg-teal-5 inline-block rounded-full absolute right-0 bottom-0 border"></span>
         </section>
         <section class="flex-grow">
            <main class="flex items-center justify-between">
               <span class="capitalize mb-px font-semibold">
                  {{ currentUser.ipAddress }}
               </span>
               <span v-if="currentUser.messages.at(-1)" class="text-[11px] text-zinc-500">
                  {{ moment(currentUser.messages.at(-1)?.date).format('HH:mm') }}
               </span>
            </main>
            <div class="text-left flex items-center">
               <aside class="flex-grow flex items-center">
                  <p class="line-clamp-1 text-gray-400 text-sm">
                     {{ currentUser.messages.at(-1)?.text }}
                  </p>
               </aside>
               <div v-if="user?.ipAddress != currentUser.messages.at(-1)?.from" class="min-w-7 text-right text-white">
                  <span v-if="newMessages(currentUser)"
                     class="w-5 font-mono h-5 text-xs text-center content-center bg-teal-600 inline-block rounded-full">
                     {{ newMessages(currentUser) }}
                  </span>
               </div>
               <div v-else>
                  <span  :class="[myMessageIsReading(currentUser.messages.at(-1)) ? 'text-sky-400' : 'text-gray-400']" class="text-xs inline-flex">
                     <i class="fa-solid fa-check relative -right-1.5"></i>
                     <i class="fa-solid fa-check relative"></i>
                  </span>
               </div>
            </div>
         </section>
      </button>
   </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { IUser } from 'global';
import type { Message } from 'global/helpers';
const emit = defineEmits(['selectChat'])
const props = defineProps<{
   menuUsers: IUser[] | undefined
   activeChat: string | null,
   user: IUser
}>()

const newMessages = (currentUser: IUser) => {
   const newMessages = currentUser.messages.filter(
      (message) =>
         message.from != props.user.ipAddress &&
         !message.viewusers.map((viewedUser) => viewedUser.ipAddress)
            .includes(props.user.ipAddress)
   )
   return newMessages.length
}



function myMessageIsReading(message: Message | undefined): boolean {
   if(message){
      return message.viewusers.length > 0 ? true : false
   }
   return false
}
</script>