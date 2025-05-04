<template>
	<main class="relative h-full max-w-[700px] mx-auto">
		<div class="flex flex-row flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<div class="bg-slate-200 mr-1 rounded overflow-hidden">
				<button v-for="user in users" @click="activeChat = user.ipAddress" class="block w-full" :class="{'bg-white' : activeChat == user.ipAddress}">
					<main class="flex items-center gap-2 justify-between capitalize  p-1.5">
						{{ user.ipAddress }}
						<span :class="[user.online ? 'bg-teal-500' : 'bg-gray-400']"
							class="w-2 h-2 inline-block  rounded-full"></span>
					</main>
				</button>
			</div>
			<div class="flex flex-col flex-auto flex-shrink-0 rounded bg-slate-200 h-full p-1.5">
				<div class="py-4 px-6 bg-slate-100 flex justify-between items-center">
					<span> {{ activeChat }} </span>
				</div>
				<div class="flex-grow relative">
					<div class="flex flex-col overflow-x-auto absolute inset-0">
						<MessageVue v-for="message in messages" ref="messagesList"
							:my-message="message.from.ipAddress == user?.ipAddress" :message="message" />
					</div>
				</div>
				<form @submit.prevent="writeMessage()" class="flex flex-row items-start py-4 rounded bg-white w-full px-4">
					<div class="flex-grow">
						<div class="w-full relative">
							<textarea @keydown.enter="handel" @keydown.="" ref="messageInput" type="text" v-model="message"
								class="flex w-full border focus:outline-none focus:border-indigo-300 py-2 pl-3 pr-10 max-h-24 h-20 min-h-11">
							</textarea>
							<button @click="emojiOpen = !emojiOpen" type="button" :class="{ 'text-blue-600': emojiOpen }"
								class="absolute top-2 right-3  text-xl">
								<i class="fa-regular fa-face-smile"></i>
							</button>
							<Transition name="slide-fade">
								<EmojiPicker v-show="emojiOpen" :native="true" @select="onSelectEmoji"
									@mouseleave="emojiOpen = false" class="absolute -top-[330px] sm:right-0" :hide-search="true"
									:hide-group-names="true" :display-recent="true" :disable-skin-tones="true"
									:disable-sticky-group-names="true" />
							</Transition>
						</div>
					</div>
					<div class="ml-4">
						<button type="submit" :disabled="messageContain"
							class="flex items-center justify-center h-12 w-12  bg-indigo-500 shadow hover:bg-indigo-600 rounded-full text-white px-4 py-1 flex-shrink-0 disabled:bg-gray-300">
							<span>
								<i class="fa-solid fa-paper-plane-top"></i>
							</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import MessageVue from '@/components/chat/Message.vue'
import EmojiPicker from 'vue3-emoji-picker'
import useChat from '@/modules/SocketChat'
const emojiOpen = ref(false)
const messageInput = ref()
const messagesList = ref([])

const { user, users, message, messages, writeMessage, handel, messageContain, activeChat } = useChat(messagesList)


function onSelectEmoji(emoji: any) {
	message.value += emoji.i
	messageInput.value.focus()
}


</script>