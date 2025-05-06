<template>
    <div :class="{ 'self-end': myMessage }" class="p-3 rounded-lg max-w-[75%]">
        <div :class="[myMessage ? 'items-end justify-start' : 'items-start']" class="flex flex-col relative ">
            <p class="text-sm text-gray-400">{{ message.from }}</p>
            <div :class="[myMessage ? 'bg-indigo-50' : 'bg-white']"
                class="relative text-sm  pt-2 pb-1 px-2 shadow rounded max-w-full">
                <div class="wrapword">{{ message.text }}</div>
                <div class="text-xs text-gray-400 text-right">
                    {{ moment(message.date).format('HH:mm') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
const { myMessage, message } = defineProps(['myMessage', 'message'])
</script>