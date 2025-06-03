<template>
	<main v-if="user" @dragover.prevent="onDragOverDecorator" class="relative h-full">
		<div class="flex flex-row h-full overflow-x-hidden antialiased text-gray-800">
			<ChatUsers :menu-users="users" :user="user" :active-chat="activeChat" @select-chat="selectChat" />
			<SendFileComponent :image-preview="bufferFiles" @clear="bufferFiles = []" @sendFile="sendFiles" />
			<div :class="{ 'translate-x-full': activeChat == null }"
				class="flex flex-col h-full sm:max-w-[992px] sm:translate-x-0 w-full sm:static fixed bg-white z-50 sm:transition-none transition-all">
				<div class="h-14 px-2 flex justify-between items-center uppercase font-semibold text-sm">
					<button v-if="activeChat" @click="activeChat = null"
						class="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-50">
						<i class="fa-solid fa-arrow-left"></i>
					</button>
					{{ activeChat }}
					<span class="opacity-0 w-10">Bumin</span>
				</div>
				<main ref="dropzoneRef" @paste.prevent="onPasteDecorator" @dragover.prevent @drop="onPasteDecorator"
					tabindex="0"
					class="focus-within:border-stone-300 border flex-grow lg:bg-[length:50%] md:bg-[length:60%] sm:bg-[length:50%] relative bg-[length:100%] shadow-inner bg-[url('/back.jpg')] overflow-hidden sm:rounded-t-2xl">
					<Transition>
						<section v-if="isHovering"
							class="bg-black/20 content-center text-center absolute inset-0 z-[1000] text-zinc-500 text-6xl">
							<span class="relative">
								<i class="fa-solid fa-files"></i>
							</span>
						</section>
					</Transition>
					<aside class="h-full flex flex-col sm:px-7 px-3 sm:py-2 py-2">
						<MessagesList ref="messagesParent" @chat-scroll="onScrollChat">
							<template v-slot:indecator>
								<button v-if="newMessages(messages, user.ipAddress) > 0"
									class="absolute bottom-2 right-0 z-[100] w-12 h-12 rounded-full bg-teal-200 text-teal-600">
									<span
										class="absolute -right-px -top-2 w-5 h-5 text-white content-center text-xs rounded-full bg-teal-500">
										{{ newMessages(messages, user.ipAddress) }}
									</span>
									<i class="fa-solid fa-chevron-down"></i>
								</button>
							</template>
							<MessageVue v-for="(message, index) in messages" ref="messagesList"
								:oldMessage="messages[index - 1]" :nextMessage="messages[index + 1]" :user="user"
								:message="message" :messagesParent="messagesParent?.airnet" @visible="onVisibleMessage"
								:key="index" />
						</MessagesList>
						<MessageInput v-if="activeChat" @file-pasted="onPaste" @submit="writeMessage()" @typing="typing"
							@submit-enter="handel" :messageContain="message.trim() == ''" v-model="message" />
					</aside>
				</main>
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import { newMessages } from '../modules/scrollToEnd'
import SendFileComponent from '@/components/SendFileComponent.vue'
import { type Message } from 'global/helpers'
import ChatUsers from '@/components/chat/ChatUsers.vue'
import MessagesList from '@/components/MessagesList.vue'
import MessageVue from '@/components/chat/Message.vue'
import useChat from '@/modules/SocketChat'
import MessageInput from '@/components/chat/MessageInput.vue'
import DropFile from '@/modules/DropFile'
import { type Ref, ref, computed, watch } from 'vue'
const { messagesList, user, users, message, writeMessage, handel, activeChat, onScrollChat, selectChat, onVisibleMessage, typing, sendFileMessage } = useChat()
const { handleDrop, onPaste, onDragOver, isHovering, bufferFiles, dropzoneRef } = DropFile()
const messagesParent: Ref<any> = ref(null)

function onPasteDecorator(event: ClipboardEvent | DragEvent) {
	if (activeChat.value) {
		if (event instanceof ClipboardEvent) onPaste(event)
		if (event instanceof DragEvent) handleDrop(event)
	}
}

function onDragOverDecorator(event: DragEvent) {
	if (activeChat.value) onDragOver(event)
}

function sendFiles() {
	sendFileMessage('image', bufferFiles.value)
	bufferFiles.value = []
}

const messages = computed(() => users.value?.find((cuser) => cuser.ipAddress == activeChat.value)?.messages ?? [])

const oldTitle = document.title
const intervalId: Ref<number | undefined> = ref(undefined)
watch(() => users.value, (current) => {
	const yes = current.some((menu) => newMessages(menu.messages, user.value?.ipAddress))
	if (yes) {
		var gar = 0
		clearInterval(intervalId.value)
		intervalId.value = setInterval(() => {
			if (gar % 2 == 0) document.title = "New Message"
			else document.title = oldTitle

			gar++

		}, 600);
	}
	else {
		if (intervalId.value) clearInterval(intervalId.value)
		document.title = oldTitle
	}
}, { deep: true })
</script>