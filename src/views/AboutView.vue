<template>
	<main class="relative h-full max-w-[700px] mx-auto">
		<div class="flex flex-row flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<div class="bg-slate-200 mr-1 rounded overflow-hidden w-64">
				<button v-for="menu in menuUsers" @click="selectChat(menu.user.ipAddress)"
					class="block w-full leading-none px-2 py-1" :class="{ 'bg-white': activeChat == menu.user.ipAddress }">
					<main class="flex items-center gap-x-2 justify-between capitalize text-xl">
						{{ menu.user.ipAddress }}
						<span :class="[menu.user.online ? 'bg-teal-500' : '']"
							class="w-2 h-2 inline-block rounded-full"></span>
					</main>
					<div class="text-left flex items-center">
						<aside class="w-3/4">
							<i v-if="user.ipAddress == menu.messages.at(-1)?.from" class="fa-solid fa-user text-sky-900 text-sm"></i>
							{{ menu.messages.at(-1)?.text }}
						</aside>
						<div class="flex-grow text-right">
							<span class="w-5 h-5 text-xs text-center content-center bg-green-500 inline-block rounded-full" v-if="menu.issetNewMessage">
								{{ menu.issetNewMessage.length }}
							</span>
						</div>
					</div>
				</button>
			</div>
			<div class="flex flex-col flex-auto flex-shrink-0 rounded bg-slate-200 h-full p-1.5">

				<div class="py-4 px-6 bg-slate-100 flex justify-between items-center">
					{{ activeChat }}
				</div>

				<MessagesList @chat-scroll="onScrollChat">
					<MessageVue v-for="message in activeChatMessages" ref="messagesList"
						:my-message="message.from == user?.ipAddress" :message="message" />
				</MessagesList>
				<MessageInput @submit="writeMessage()" @submit-enter="handel" :messageContain="message.trim() == ''"
					v-model="message" />
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import MessagesList from '@/components/MessagesList.vue'
import MessageVue from '@/components/chat/Message.vue'
import useChat from '@/modules/SocketChat'
import MessageInput from '@/components/chat/MessageInput.vue'
const { messagesList, user, menuUsers, message, activeChatMessages, writeMessage, handel, activeChat, onScrollChat, selectChat } = useChat()
</script>