<template>
	<div :class="[
		{ 'self-end': myMessage },
		props.oldMessage?.from != message.from ? 'py-2' : 'pb-1',
		props.nextMessage?.from != message.from ? '' : 'pb-1',
	]" class="rounded-lg max-w-[82%]">
		<div :class="[myMessage ? 'items-end justify-start' : 'items-start']" class="flex flex-col relative ">
			<p class="text-sm text-gray-600" v-if="props.oldMessage?.from != message.from">{{ message.from }}</p>
			<div ref="messageref" :class="[myMessage ? 'bg-sky-50/90' : 'bg-white/90']"
				class="relative border border-zinc-200 text-sm  pt-2 pb-1 px-2 shadow rounded max-w-full  min-w-20">
				<div class="wrapword" v-if="message.type == 'text'">{{ message.text }}</div>
				<div class="wrapword grid gap-2 grid-cols-2 w-96" v-if="message.type == 'image'">
					<template v-for="(file, index) in message.files">
						<img :src="file" :class="{'col-span-2': (message.files?.length|| 0)%2 == 1 && index == 0}" class="w-full bg-white h-72 object-cover">
					</template>
				</div>
				<div :class="[myMessage ? 'flex-row-reverse' : '']"
					class="text-xs text-gray-400 flex items-center justify-between">
					{{ moment(message.date).format('HH:mm') }}
					<span v-if="message.to" :class="[ipAddresses.includes(message.to) ? 'text-sky-400' : 'text-gray-400']">
						<i :class="{ 'left-1.5': !myMessage }" class="fa-solid fa-check relative"></i>
						<i :class="{ '-left-1.5': myMessage }" class="fa-solid fa-check relative"></i>
					</span>
					<span v-if="message.toChannel"
						:class="[ipAddresses.filter((user) => user != message.from).length > 0 ? 'text-sky-400' : 'text-gray-400']">
						<i :class="{ 'left-1.5': !myMessage }" class="fa-solid fa-check relative"></i>
						<i :class="{ '-left-1.5': myMessage }" class="fa-solid fa-check relative"></i>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Message } from 'global/helpers';
import moment from 'moment'
import { useIntersectionObserver } from '@vueuse/core'
import { computed,  onUnmounted, useTemplateRef } from 'vue'
import type { IUser } from 'global';
const props = defineProps<{
	message: Message
	user: IUser,
	oldMessage: Message | undefined
	nextMessage: Message | undefined
	messagesParent: any
}>()


const myMessage = computed(() => props.message.from == props.user?.ipAddress)
const emit = defineEmits(['visible'])
const target = useTemplateRef<HTMLDivElement>('messageref')

const ipAddresses = computed(() => {
	return props.message.viewusers.map((user) => user.ipAddress)
})

const { stop } = useIntersectionObserver(
	target,
	([entry]) => {
		if (entry.isIntersecting && !myMessage.value) {
			emit('visible', props.message)
		}
	},
	{
		root: props.messagesParent,
		threshold: 0.4,
	}

)
onUnmounted(() => stop())
</script>