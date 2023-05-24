<template>
  <div
    v-if="!(record && oppositeUser && userStore.authStore.model)"
    class="h-screen flex justify-center items-center"
  >
    <Loading />
  </div>
  <div
    v-else
    class="relative flex flex-col flex-grow justify-center items-center"
  >
    <ChatNavbar :username="oppositeUser?.username" />
    <div class="fixed bottom-0 h-screen w-screen md:w-1/2 py-20 overflow-clip">
      <ChatMessages
        :chat-type="record.type"
        :sender-user="userStore.authStore.model"
        :receiver-user="(oppositeUser as UserInfo)"
        :messages="(sortedMessages as MessageObject[])"
      />
    </div>
    <ChatInput :onSendChat="onSendChat" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { usePocketBaseStore } from '../store/pocketbase';

import useUserStore from '../store/user';
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
      username: userStore.authStore.model.username,
      sender: userStore.authStore.model.id,
      created: new Date().toISOString()
    }
  ];

  let unseen_message: any = {};
  if (record.value.unseen_message) {
    const receiverId = oppositeUser.value?.id as string;
    let unseenAmount = record.value.unseen_message[receiverId] ?? 0;

    unseen_message = {
      ...record.value.unseen_message
    };

    unseen_message[receiverId] = unseenAmount += 1;
  }

  await pb.collection('direct_chat_info').update(chatId, {
    messages_object: {
      message_list: sendMessage
    },
    unseen_message
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

  await pb
    .collection('direct_chat_info')
    .subscribe(chatId, (e: any) => {
      record.value = e.record;

      sortedMessages.value = e.record.messages_object.message_list.sort(
        function (a: any, b: any) {
          var keyA = new Date(a.created),
            keyB = new Date(b.created);
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        }
      );
    })
    .catch(() => console.log('Error in Chat.vue'));

  oppositeUser.value = data[0].expand.members.find(
    (user: UserInfo) => user.id !== userStore.authStore.model.id
  );
});

onBeforeUnmount(async () => {
  try {
    await pb
      .collection('direct_chat_info')
      .unsubscribe()
      .catch(() => {
        console.log('====================================');
        console.log('error unsubscribe', chatId);
        console.log('====================================');
      });

    if (!record.value) return;

    const userId = userStore.authStore.model.id;
    const updatedUnseenMessage = { ...record.value.unseen_message };

    updatedUnseenMessage[userId] = 0;

    await pb.collection('direct_chat_info').update(chatId, {
      unseen_message: updatedUnseenMessage
    });
  } catch (err) {
    console.log('====================================');
    console.log('error when unmount');
    console.log('====================================');
  }
});
</script>
