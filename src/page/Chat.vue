<template>
  <div
    v-if="record"
    class="relative flex flex-col flex-grow justify-center items-center"
  >
    <ChatNavbar :username="oppositeUser?.username" />
    <div class="fixed bottom-0 h-screen w-screen md:w-1/2 py-20 overflow-clip">
      <ChatMessages
        :userId="userStore.userModel.id"
        :messages="sortedMessages as MessageObject[]"
      />
    </div>
    <ChatInput :onSendChat="onSendChat" />
  </div>
  <div v-else class="h-screen flex justify-center items-center">
    <Loading />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { usePocketBaseStore } from '../store/pocketbase';

import { useUserStore } from '../store/user';
import { DirectChatInfo, MessageObject } from '../types/message';
import { UserInfo } from '../types/auth';

import Loading from '../components/Loading.vue';
import ChatNavbar from '../components/chat/ChatNavbar.vue';
import ChatInput from '../components/chat/ChatInput.vue';
import ChatMessages from '../components/chat/ChatMessages.vue';

const route = useRoute();
const pb = usePocketBaseStore().pocketbase;
const userStore = useUserStore();

const record = ref<DirectChatInfo>();
const oppositeUser = ref<UserInfo>();

const sortedMessages = ref<MessageObject[]>();

const chatId = route.params.id;

const onSendChat = async (text: string) => {
  if (!record.value) return;
  const sendMessage = [
    ...record.value.messages_object.message_list,
    {
      text: text,
      sender: userStore.userModel.id,
      created: new Date().toISOString()
    }
  ];

  await pb.collection('direct_chat_info').update(chatId, {
    messages_object: {
      message_list: sendMessage
    }
  });
};

onMounted(async () => {
  const data = await pb.collection('direct_chat_info').getFullList({
    filter: `id~'${chatId}'`,
    expand: 'members'
  });

  record.value = data[0];

  sortedMessages.value = data[0].messages_object.message_list.sort(function (
    a: any,
    b: any
  ) {
    var keyA = new Date(a.created),
      keyB = new Date(b.created);
    // Compare the 2 dates
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });

  await pb.collection('direct_chat_info').subscribe(chatId, (e: any) => {
    record.value = e.record;

    sortedMessages.value = e.record.messages_object.message_list.sort(function (
      a: any,
      b: any
    ) {
      var keyA = new Date(a.created),
        keyB = new Date(b.created);
      // Compare the 2 dates
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
  });

  oppositeUser.value = data[0].expand.members.find(
    (user: UserInfo) => user.id !== userStore.userModel.id
  );
});

onBeforeUnmount(
  async () => await pb.collection('direct_chat_info').unsubscribe(chatId)
);
</script>
