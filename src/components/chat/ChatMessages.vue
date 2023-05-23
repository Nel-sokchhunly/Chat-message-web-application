<template>
  <div class="h-full w-full overflow-scroll px-4 pt-20 flex flex-col-reverse">
    <!-- fresh start screen -->
    <div
      v-if="messages.length === 0"
      class="h-full w-full flex justify-center pt-20 text-xl text-black font-bold text-opacity-40"
    >
      No messages
    </div>
    <!-- message -->
    <div
      v-for="(chat, index) in props.messages"
      :class="isNextMessageSameSender(index) ? 'mb-1' : 'mb-4'"
    >
      <div
        v-if="isMessageSameDate(index)"
        class="w-full text-sm text-center text-black text-opacity-50 my-4"
      >
        {{
          new Date(chat.created).toDateString() === new Date().toDateString()
            ? 'Today'
            : new Date(chat.created).toDateString()
        }}
      </div>

      <!-- other message pill-->
      <div v-if="props.senderUser.id !== chat.sender">
        <div class="flex w-full items-end space-x-1">
          <div v-if="chatType === 'group'" class="w-8 h-8">
            <identicon-svg
              class="block"
              :username="chat.username"
              saturation="50"
              v-if="!isNextMessageSameSender(index)"
            ></identicon-svg>
          </div>
          <div
            class="min-w-[50px] md:min-w-[100px] bg-primary bg-opacity-25 p-1 px-2 rounded"
          >
            {{ chat.text }}
          </div>

          <div class="text-xs text-black text-opacity-50 mr-4">
            {{
              new Date(chat.created).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }}
          </div>

          <div class="flex-1" />
        </div>
        <h1
          v-if="!isNextMessageSameSender(index) && chatType === 'group'"
          class="text-xs text-black text-opacity-50 px-1 mt-1"
        >
          {{ chat.username }}
        </h1>
      </div>

      <!-- our message pill -->
      <div v-if="props.senderUser.id === chat.sender">
        <div class="flex w-full items-end space-x-1">
          <div class="flex-1" />
          <div class="text-xs text-black text-opacity-50 ml-4">
            {{
              new Date(chat.created).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }}
          </div>
          <div
            class="min-w-[50px] md:min-w-[100px] text-right bg-secondary bg-opacity-25 p-1 px-2 rounded"
          >
            {{ chat.text }}
          </div>
          <div v-if="chatType === 'group'" class="w-8 h-8">
            <identicon-svg
              class="block"
              :username="props.senderUser.username"
              saturation="50"
              v-if="!isNextMessageSameSender(index)"
            ></identicon-svg>
          </div>
        </div>
        <h1
          v-if="!isNextMessageSameSender(index) && chatType === 'group'"
          class="w-full text-right text-xs text-black text-opacity-50 px-1 mt-1"
        >
          {{ chat.username }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserInfo } from '../../types/auth';
import { MessageObject } from '../../types/message';

const props = defineProps<{
  messages: MessageObject[];
  chatType: 'direct' | 'group';
  senderUser: UserInfo;
  receiverUser?: UserInfo; // if in direct message
  groupMemberObj?: UserInfo[]; // if in group message
}>();

function isMessageSameDate(index: number): Boolean {
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

// function isMessageSameTime(index: number): Boolean {
//   const currentMessage = props.messages[index];
//   const previousMessage = props.messages[index + 1];

//   if (!previousMessage) {
//     return true;
//   }

//   const currentMessageDate = new Date(
//     currentMessage.created
//   ).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit'
//   });
//   const previousMessageDate = new Date(
//     previousMessage.created
//   ).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   if (currentMessageDate !== previousMessageDate) {
//     return true;
//   }

//   return false;
// }

function isNextMessageSameSender(index: number): Boolean {
  const currentMessage = props.messages[index];
  const nextMessage = props.messages[index - 1];

  if (index === 0) {
    // meaning no next message
    return false;
  }

  if (!nextMessage) {
    return true;
  }

  if (currentMessage.sender === nextMessage.sender) {
    return true;
  }

  return false;
}
</script>
