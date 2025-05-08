<template>
	<main v-if="user" class="relative h-full">
		<div class="flex flex-row flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<ChatUsers :menu-users="users" :user="user" :active-chat="activeChat" @select-chat="selectChat"/>
			<div class="flex flex-col flex-auto flex-shrink-0 h-full">
				<div class="py-5 px-2 flex justify-between items-center uppercase font-semibold text-sm">
					{{ activeChat ?? '-' }}
				</div>
				<main style="background-size: 50%;" class="flex-grow bg-slate-200 shadow-inner bg-[url('/back.jpg')] rounded-t-2xl w-[992px]">
					<aside class="h-full flex flex-col px-7 py-3">
						<MessagesList ref="messagesParent" @chat-scroll="onScrollChat">
							<MessageVue
								v-for="(message, index) in messages" ref="messagesList"
								:oldMessage="messages[index - 1]"
								:nextMessage="messages[index + 1]"
								:user="user"
								:message="message"
								:messagesParent="messagesParent?.airnet"
								@visible="onVisibleMessage"
								:key="index"
							/>
						</MessagesList>
						<MessageInput
							v-if="activeChat"
							@submit="writeMessage()" 
							@submit-enter="handel" 
							:messageContain="message.trim() == ''"
							v-model="message"
						/>
					</aside>
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
import { watch, type Ref, ref, computed } from 'vue'
const { messagesList, user, users, message , writeMessage, handel, activeChat, onScrollChat, selectChat, onVisibleMessage } = useChat()

const messagesParent: any = ref(null)
const oldTitle = document.title
const intervalId: Ref<number | undefined> = ref(undefined)



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