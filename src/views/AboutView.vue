<template>
	<main v-if="user" class="relative h-full">
		<div class="flex flex-row flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<ChatUsers :menu-users="users" :user="user" :active-chat="activeChat" @select-chat="selectChat" />
			<div :class="{ 'translate-x-full': activeChat == null }"
				class="flex flex-col flex-auto flex-shrink-0 h-full sm:max-w-[992px] sm:translate-x-0 w-full sm:static fixed bg-white z-50 sm:transition-none transition-all">
				<div class="h-14 px-2 flex justify-between items-center uppercase font-semibold text-sm">
					<button @click="activeChat = null" class="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-50">
						<i class="fa-solid fa-arrow-left"></i>
					</button>
					{{ activeChat }}
					<span class="opacity-0 w-10">Bumin</span>
				</div>
				<main style="background-size: 50%;"
					class="flex-grow bg-slate-200 shadow-inner bg-[url('/back.jpg')] sm:rounded-t-2xl">
					<aside class="h-full flex flex-col sm:px-7 px-3 sm:py-2 py-2">
						<MessagesList ref="messagesParent" @chat-scroll="onScrollChat">
							<template v-slot:indecator>
								<button v-if="newMessages(messages) > 0" class="absolute bottom-2 right-0 z-[100] w-12 h-12 rounded-full bg-teal-200 text-teal-600">
									<span class="absolute -right-px -top-2 w-5 h-5 text-white content-center text-xs rounded-full bg-teal-500">
										{{ newMessages(messages) }}
									  </span>
									<i class="fa-solid fa-chevron-down"></i>
								</button>
							</template>
							<MessageVue v-for="(message, index) in messages" ref="messagesList"
								:oldMessage="messages[index - 1]" :nextMessage="messages[index + 1]" :user="user"
								:message="message" :messagesParent="messagesParent?.airnet" @visible="onVisibleMessage"
								:key="index" />
						</MessagesList>
						<MessageInput v-if="activeChat" @submit="writeMessage()" @submit-enter="handel"
							:messageContain="message.trim() == ''" v-model="message" />
					</aside>
				</main>
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import type { Message } from 'global/helpers'
import ChatUsers from '@/components/chat/ChatUsers.vue'
import MessagesList from '@/components/MessagesList.vue'
import MessageVue from '@/components/chat/Message.vue'
import useChat from '@/modules/SocketChat'
import MessageInput from '@/components/chat/MessageInput.vue'
import { watch, type Ref, ref, computed } from 'vue'
const { messagesList, user, users, message, writeMessage, handel, activeChat, onScrollChat, selectChat, onVisibleMessage } = useChat()

const messagesParent: any = ref(null)
const oldTitle = document.title
const intervalId: Ref<number | undefined> = ref(undefined)


const newMessages = (messages: Message[]) => {
	const newMessages = messages.filter(
		(message) =>
			message.from != user.value.ipAddress &&
			!message.viewusers.map((viewedUser) => viewedUser.ipAddress)
				.includes(user.value.ipAddress)
	)
	return newMessages.length
}


const messages = computed(() => {
	return users.value?.find((currentUser) => currentUser.ipAddress == activeChat.value)?.messages ?? []
})
// watch(() => menuUsers.value, (current) => {
// 	const yes = current.some((menu) => menu.issetNewMessage.length > 0)
// 	if (yes) {
// 		var gar = 0
// 		clearInterval(intervalId.value)
// 		intervalId.value = setInterval(() => {
// 			if (gar % 2 == 0) document.title = "New Message"
// 			else document.title = oldTitle

// 			gar++

// 		}, 1000);
// 	}
// 	else {
// 		if (intervalId.value) clearInterval(intervalId.value)
// 		document.title = oldTitle
// 	}
// })
</script>