<template>
  <div class="h-full w-full overflow-scroll px-4 pt-20 flex flex-col-reverse">
    <div v-for="(chat, index) in props.messages" class="mb-1">
      <div
        v-if="checkIfMessageSameDate(index)"
        class="w-full text-sm text-center text-black text-opacity-50 my-4"
      >
        {{ new Date(chat.created).toDateString() }}
      </div>

      <!-- other message pill-->
      <div class="flex w-full" v-if="props.userId !== chat.sender">
        <div class="bg-primary bg-opacity-25 p-1 px-2 rounded-lg">
          <div>{{ chat.text }}</div>
          <div class="text-xs mr-4">
            {{
              new Date(chat.created).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }}
          </div>
        </div>
        <div class="flex-1" />
      </div>

      <!-- our message pill -->
      <div class="flex w-full" v-if="props.userId === chat.sender">
        <div class="flex-1" />
        <div class="text-right bg-secondary bg-opacity-25 p-1 px-2 rounded-lg">
          <div>{{ chat.text }}</div>
          <div class="text-xs text-black ml-4">
            {{
              new Date(chat.created).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageObject } from '../../types/message';

const props = defineProps<{
  messages: MessageObject[];
  userId: string;
}>();

function checkIfMessageSameDate(index: number): Boolean {
  const currentMessage = props.messages[index];
  const previousMessage = props.messages[index + 1];

  if (!previousMessage) {
    return true;
  }

  const currentMessageDate = new Date(currentMessage.created).toDateString();
  const previousMessageDate = new Date(previousMessage.created).toDateString();

  if (currentMessageDate !== previousMessageDate) {
    return true;
  }

  return false;
}
</script>
