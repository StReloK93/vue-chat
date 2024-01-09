<template>
	<main class="relative h-full max-w-[700px] mx-auto">
		<div class="flex flex-col flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<div class="flex flex-col flex-auto flex-shrink-0 rounded bg-slate-200 h-full p-1.5">
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
							<MessageVue v-for="message in messages" ref="messagesList" :my-message="message.user.id == user?.id"
								:message="message" />
						</div>
					</div>
				</div>
				<form @submit.prevent="writeMessage()" class="flex flex-row items-start py-4 rounded bg-white w-full px-4">
					<div class="flex-grow">
						<div class="w-full relative">
							<textarea @keydown.enter.prevent="handel" ref="messageInput" type="text" v-model="message"
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
import MessageVue from '@/components/chat/Message.vue'
import { ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import useChat from '@/modules/SocketChat'
const emojiOpen = ref(false)
const messageInput = ref()
const messagesList = ref([])
const loginInput = ref()

const { user, message, messages, writeMessage, loginToChat, handel, messageContain } = useChat(messagesList, loginInput)

function onSelectEmoji(emoji: any) {
	message.value += emoji.i
	messageInput.value.focus()
}

function exit() {
	sessionStorage.removeItem('user')
	user.value = null
}
</script>