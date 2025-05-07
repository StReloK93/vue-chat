<template>
	<main v-if="user" class="relative h-full">
		<div class="flex flex-row flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<ChatUsers :menu-users="menuUsers" :user="user" :active-chat="activeChat" @select-chat="selectChat"/>
			<div class="flex flex-col flex-auto flex-shrink-0 h-full">
				<div class="py-6 px-2 flex justify-between items-center capitalize">
					{{ activeChat }}
				</div>
				<main style="background-size: 50%;" class="flex-grow flex flex-col bg-slate-200 bg-[url('/back.jpg')] rounded-t-2xl px-7 py-3 w-[992px]">
					<MessagesList @chat-scroll="onScrollChat">
						<MessageVue
							v-for="(message, index) in activeChatMessages" ref="messagesList"
							:oldMessage="activeChatMessages[index - 1]"
							:nextMessage="activeChatMessages[index + 1]"
							:user="user"
							:message="message"
							@visible="onVisibleMessage"
						/>
					</MessagesList>
					<MessageInput 
						@submit="writeMessage()" 
						@submit-enter="handel" 
						:messageContain="message.trim() == ''"
						v-model="message"
					/>
				</main>
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import ChatUsers from '@/components/chat/ChatUsers.vue'
import MessagesList from '@/components/MessagesList.vue'
import MessageVue from '@/components/chat/Message.vue'
import useChat from '@/modules/SocketChat'
import MessageInput from '@/components/chat/MessageInput.vue'
import { watch, type Ref, ref } from 'vue'
const { messagesList, user, menuUsers, message, activeChatMessages, writeMessage, handel, activeChat, onScrollChat, selectChat, onVisibleMessage } = useChat()

const oldTitle = document.title
const intervalId: Ref<number | undefined> = ref(undefined)
watch(() => menuUsers.value, (current) => {
	const yes = current.some((menu) => menu.issetNewMessage.length > 0)
	if (yes) {
		var gar = 0
		clearInterval(intervalId.value)
		intervalId.value = setInterval(() => {
			if (gar % 2 == 0) document.title = "New Message"
			else document.title = oldTitle

			gar++

		}, 1000);
	}
	else {
		if (intervalId.value) clearInterval(intervalId.value)
		document.title = oldTitle
	}
})
</script>