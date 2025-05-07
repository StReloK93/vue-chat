<template>
	<div :class="{ 'self-end': myMessage }" class="p-3 rounded-lg max-w-[75%]">
		<div :class="[myMessage ? 'items-end justify-start' : 'items-start']" class="flex flex-col relative ">
			<p class="text-sm text-gray-400">{{ message.from }}</p>
			<div ref="messageref" :class="[myMessage ? 'bg-indigo-50' : 'bg-white']"
				class="relative text-sm  pt-2 pb-1 px-2 shadow rounded max-w-full  min-w-20">
				<div class="wrapword">{{ message.text }}</div>
				<div :class="[myMessage ? 'flex-row-reverse' : '']" class="text-xs text-stone-400 flex items-center justify-between">
					{{ moment(message.date).format('HH:mm') }}
					<span v-if="message.to" :class="[ipAddresses.includes(message.to) ? 'text-sky-400' : 'text-gray-400']">
						<i :class="{'left-1.5': !myMessage}" class="fa-solid fa-check relative"></i>
						<i :class="{'-left-1.5': myMessage}" class="fa-solid fa-check relative"></i>
					</span>
					<span v-if="message.toChannel" :class="[ipAddresses.filter((user) => user != message.from).length > 0 ? 'text-sky-400' : 'text-gray-400']">
						<i :class="{'left-1.5': !myMessage}" class="fa-solid fa-check relative"></i>
						<i :class="{'-left-1.5': myMessage}" class="fa-solid fa-check relative"></i>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Message } from 'global/helpers';
import moment from 'moment'
const props = defineProps<{
	myMessage: boolean
	message: Message
	user: IUser
}>()
import { useIntersectionObserver } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import type { IUser } from 'global';

const emit = defineEmits(['visible'])
const messageref = useTemplateRef<HTMLDivElement>('messageref')

const ipAddresses = computed(() => {
	return props.message.viewusers.map((user) => user.ipAddress)
})

useIntersectionObserver(
	messageref,
	([entry]) => {
		if (entry.intersectionRatio == 1 && !props.myMessage) {
			emit('visible', props.message)
		}
	},
	{ threshold: 1 }
)
</script>