<template>
  <div class="h-20 fixed bottom-0 w-full flex justify-center items-center">
    <FormKit
      type="form"
      submit-label="Signup"
      :actions="false"
      @submit="handleSendChat"
      class="flex"
      :classes="{
        message: 'mt-4 text-sm text-red-600'
      }"
    >
      <div
        class="w-screen md:w-1/2 p-4 flex flex-grow-1 justify-center items-center space-x-4"
      >
        <div
          class="w-full border-2 border-black rounded-full px-2 flex items-center relative"
        >
          <!-- emoji picker -->
          <button type="button" @click="toggleEmojiPicket" class="h-8 w-8 ml-1">
            <img src="/icon/smile.svg" />
          </button>
          <div
            :class="
              isShowEmojiPicker
                ? 'absolute bottom-full mb-4 block'
                : 'absolute bottom-full mb-4 invisible'
            "
          >
            <EmojiPicker :native="true" @select="onSelectEmoji" />
          </div>

          <!-- text input -->
          <FormKit
            type="text"
            v-model="textMessage"
            placeholder="enter your message"
            autocomplete="off"
            :classes="{
              outer: 'w-full h-12 bg-transparent',
              inner: 'max-w-md overflow-hidden focus-within:border-blue-500',
              input:
                'focus:outline-none w-full h-12 px-4 text-base text-black placeholder-gray-400 bg-transparent'
            }"
            autofocus
          />

          <!-- send button -->
          <button type="submit" class="h-6 w-6 mr-2">
            <img src="/icon/send-direct.svg" />
          </button>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormKit } from '@formkit/vue';

import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const props = defineProps({
  onSendChat: {
    type: Function,
    required: true
  }
});

const textMessage = ref<string>('');

const isShowEmojiPicker = ref<boolean>(false);

const toggleEmojiPicket = () =>
  (isShowEmojiPicker.value = !isShowEmojiPicker.value);

const handleSendChat = () => {
  if (textMessage.value?.trim().replace(' ', '')) {
    props.onSendChat(textMessage.value);
    textMessage.value = '';
  }
};

const onSelectEmoji = (emoji: any) => {
  textMessage.value += emoji.i;
};
</script>
