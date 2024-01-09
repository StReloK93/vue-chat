<template>
	<main class="relative h-full max-w-[700px] mx-auto">
		<div class="flex flex-col flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<div class="flex flex-col flex-auto flex-shrink-0 rounded bg-slate-200 h-full p-2">
				<div class="py-4 px-6 bg-slate-100 flex justify-between items-center">
					<span>
						{{ user?.login }}
					</span>
					<button @click="exit()">
						Logout
					</button>
				</div>
				<div class="flex flex-col h-full overflow-x-auto mb-4">
					<div class="flex flex-col h-full">
						<div class="flex flex-col">
							<div v-for="message in messages" ref="messagesList" :class="{ 'self-end': message.user.id == user?.id }" class="p-3 rounded-lg w-3/4">
								<div v-if="message.user.id != user?.id" class="flex flex-col items-start relative">
									<p class="text-sm text-gray-400">{{ message.user.login }}</p>
									<div class="relative text-sm bg-white pt-2 pb-1 px-2 shadow rounded">
										<div class="whitespace-pre-wrap">{{ message.text }}</div>
										<div class="text-xs text-gray-400 text-right">
											{{ moment(message.date).format('HH:mm') }}
										</div>
									</div>
								</div>
								<div v-else class="flex items-end justify-start flex-col relative">
									<!--  -->
									<p class="text-sm text-gray-400">{{ message.user.login }}</p>
									<div class="relative text-sm bg-indigo-50 pt-2 pb-1 px-2 shadow rounded">
										<div class="whitespace-pre-wrap">{{ message.text }}</div>
										<span class="text-xs text-gray-400">
											{{ moment(message.date).format('HH:mm') }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<form @submit.prevent="writeMessage()" class="flex flex-row items-start py-4 rounded bg-white w-full px-4">
					<div class="flex-grow">
						<div class="w-full relative">
							<textarea @keydown.enter.prevent="handel" ref="messageInput" type="text" v-model="message"
								class="flex w-full border focus:outline-none focus:border-indigo-300 py-2 px-3 max-h-24 h-20 min-h-11">
							</textarea>
							<button @click="emojiOpen = true"   type="button" class="absolute top-2 right-3  text-xl">
								<i class="fa-regular fa-face-smile"></i>
							</button>
							<Transition name="slide-fade">
								<EmojiPicker v-show="emojiOpen" :native="true" @select="onSelectEmoji"
									@mouseleave="emojiOpen = false" class="absolute -top-[330px] right-0"
									:hide-search="true" :hide-group-names="true" :display-recent="true"
									:disable-skin-tones="true" :disable-sticky-group-names="true" />
							</Transition>
						</div>
					</div>
					<div class="ml-4">
						<button type="submit"
							:disabled="messageContain"
							class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded text-white px-4 py-1 flex-shrink-0 disabled:bg-gray-300">
							<span>Send</span>
							<span class="ml-2">
								<svg class="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor"
									viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
								</svg>
							</span>
						</button>
					</div>
				</form>
			</div>
		</div>
		<section v-if="user == null" class="absolute inset-0 bg-black/30 flex justify-center items-center">
			<form @submit.prevent="loginToChat" class="bg-white shadow p-4 w-80 rounded">
				<h1 class="text-gray-500 text-center text-xl">Nickname(login) tanlang</h1>
				<div class="my-4">
					<input type="text" ref="loginInput" class="border px-2 py-1.5 w-full outline-none" required>
				</div>
				<button class="w-full bg-stone-200 shadow-inner py-1.5">Kirish</button>
			</form>
		</section>
	</main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'
import EmojiPicker from 'vue3-emoji-picker'
import useChat from '@/modules/SocketChat'
const emojiOpen = ref(false)
const messageInput = ref()
const messagesList = ref([])
const loginInput = ref()

const { user, message, messages, writeMessage, loginToChat, handel , messageContain} = useChat(messagesList, loginInput)

function onSelectEmoji(emoji: any) {
	message.value += emoji.i
	messageInput.value.focus()
}

function exit() {
	sessionStorage.removeItem('user')
	user.value = null
}
</script>