<template>
	<main class="relative h-full">
		<div class="flex flex-col flex-auto h-full overflow-x-hidden antialiased text-gray-800">
			<div class="flex flex-col flex-auto flex-shrink-0 rounded bg-gray-100 h-full p-2">
				<div class="py-4 px-6 bg-slate-300 flex justify-between items-center">
					<span>
						{{ user?.login }}
					</span>
					<button @click="exit()">
						Logout
					</button>
				</div>
				<div class="flex flex-col h-full overflow-x-auto mb-4">
					<div class="flex flex-col h-full">
						<div class="grid grid-cols-12 gap-y-2">
							<div v-for="message in messages" class="col-start-1 col-end-13 p-3 rounded-lg">
								<div v-if="message.user.id != user?.id" class="flex flex-col items-start">
									<p class="text-sm text-gray-400">{{ message.user.login }}</p>
									<div class="relative text-sm bg-white py-2 px-4 shadow rounded">
										<div>{{ message.text }}</div>
									</div>
								</div>
								<div v-else class="flex items-end justify-start flex-col">
									<p class="text-sm text-gray-400">{{ message.user.login }}</p>
									<div class="relative text-sm bg-indigo-100 py-2 px-4 shadow rounded">
										<div>{{ message.text }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<form @submit.prevent="getMessage()" class="flex flex-row items-center h-16 rounded bg-white w-full px-4">
					<div class="flex-grow">
						<div class="relative w-full">
							<input type="text" v-model="message"
								class="flex w-full border rounded focus:outline-none focus:border-indigo-300 pl-4 h-10" />
						</div>
					</div>
					<div class="ml-4">
						<button type="submit"
							class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded text-white px-4 py-1 flex-shrink-0">
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

import { io } from 'socket.io-client'
import { ref } from 'vue'
const socket = io('http://localhost:3000')
const sessionUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null
const user: any = ref(sessionUser)
const loginInput = ref()
const message = ref("")
const messages: any = ref([])


if (user.value) {

	console.log('as');
	
	socket.emit('connectId', user.value.id)
}
// Отправка сообщения на сервер
socket.on('connectId', (selected) => {
	if (selected == null) {
		sessionStorage.removeItem('user')
		user.value = null
	}
	else user.value = selected
	
})

function getMessage() {
	socket.emit('message', message.value)
	message.value = ""
}

// Принятие сообщения от сервера
socket.on('message', (message) => {
	console.log(message, 'text for mess')
	
	messages.value.push(message)
})


function loginToChat() {
	socket.emit('login', { login: loginInput.value.value })
}


socket.on('login', (data) => {
	console.log('Siz chatga ulandiz sizni malumotlariz:', data)
	sessionStorage.setItem('user', JSON.stringify(data))
	user.value = data
	console.log(user.value)
})


function exit() {
	sessionStorage.removeItem('user')
	user.value = null
}
</script>