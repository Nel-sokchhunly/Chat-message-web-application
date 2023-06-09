<template>
  <div
    v-if="!(record && userStore.authStore.model)"
    class="h-screen flex justify-center items-center"
  >
    <Loading />
  </div>
  <div v-else class="w-screen">
    <div class="relative flex flex-col flex-grow justify-center items-center">
      <ChatNavbar
        :username="record.name"
        isGroup
        :group-id="record.id"
        :on-pressed="toggleGroupInfo"
      />
      <div
        class="fixed bottom-0 h-screen w-screen md:w-1/2 py-20 overflow-clip"
      >
        <ChatMessages
          :chat-type="record.type"
          :sender-user="userStore.authStore.model"
          :group-member-obj="record.expand?.members"
          :messages="(sortedMessages as MessageObject[])"
        />
      </div>
      <ChatInput :onSendChat="onSendChat" />
    </div>

    <!-- <CreateGroup v-if="isToggleGroupInfo" /> -->
    <GroupInfo
      :is-showing="isToggleGroupInfo"
      :toggleGroupInfo="toggleGroupInfo"
      :chat-record="record"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { usePocketBaseStore } from '../store/pocketbase';

import useUserStore from '../store/user';
import { GroupChatInfo, MessageObject } from '../types/message';

import Loading from '../components/Loading.vue';
import ChatNavbar from '../components/chat/ChatNavbar.vue';
import ChatInput from '../components/chat/ChatInput.vue';
import ChatMessages from '../components/chat/ChatMessages.vue';
import GroupInfo from '../components/group/GroupInfo.vue';

const route = useRoute();
const pb = usePocketBaseStore().pocketbase;
const userStore = useUserStore();

const record = ref<GroupChatInfo>();

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

  let unseen_message: any = {
    ...record.value.unseen_message
  };
  Object.keys(record.value.unseen_message).forEach((id) => {
    if (id === userStore.authStore.model.id) return;

    const amount = unseen_message[id];

    unseen_message[id] = amount + 1;
  });

  await pb.collection('group_chat_info').update(chatId, {
    messages_object: {
      message_list: sendMessage
    },
    unseen_message
  });
};

onMounted(async () => {
  const data = await pb.collection('group_chat_info').getFullList({
    filter: `id~'${chatId}'`,
    expand: 'members,created_by'
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
    .collection('group_chat_info')
    .subscribe(chatId, async function (e: any) {
      const isMembersChange =
        JSON.stringify(record.value?.members) ===
        JSON.stringify(e.record.members);

      record.value = { ...record.value, ...e.record };

      if (isMembersChange) {
        // fetch expands field
        const data = await pb.collection('group_chat_info').getFullList({
          filter: `id~'${chatId}'`,
          expand: 'members,created_by'
        });

        if (!record.value?.expand) return;

        record.value.expand = { ...data[0].expand };
      }

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
});

onBeforeUnmount(async () => {
  try {
    await pb
      .collection('group_chat_info')
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

    await pb.collection('group_chat_info').update(chatId, {
      unseen_message: updatedUnseenMessage
    });
  } catch (err) {
    console.log('====================================');
    console.log('error when unmount');
    console.log('====================================');
  }
});

// view group chat info
const isToggleGroupInfo = ref(false);

const toggleGroupInfo = () =>
  (isToggleGroupInfo.value = !isToggleGroupInfo.value);
</script>
