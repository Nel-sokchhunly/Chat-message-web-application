<template>
  <!-- <div class="h-full" v-if="!userStore.isFetchingFinished">
      <Loading />
    </div> -->
  <!-- <CreateGroup /> -->

  <div class="px-4 h-screen w-full flex flex-col overflow-scroll pb-56">
    <!-- create new group -->
    <div
      @click="showCreateGroupPage"
      class="my-4 bg-secondary bg-opacity-60 p-2 text-primary font-bold w-full rounded-lg flex items-center space-x-4 px-4 cursor-pointer"
    >
      <img
        src="/icon/create-group.svg"
        alt=""
        class="h-4 transform rotate-45"
      />
      <h1>create new group</h1>
    </div>

    <!-- group section -->
    <div>
      <!-- unseen section -->
      <div
        v-if="userStore.allGroupMessage.unseen.length > 0"
        class="text-sm text-black text-opacity-50 mb-4"
      >
        Unseen messages
      </div>
      <div v-for="chat in userStore.allGroupMessage.unseen" :key="chat.id">
        <button
          class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
          @click="handleOpenGroupMessage(chat.id as string)"
        >
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="chat.id"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ chat.name }}</h1>
          <div class="flex-1"></div>
          <h1
            v-if="chat.unseen_amount && chat.unseen_amount > 0"
            class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
          >
            {{ chat.unseen_amount }}
          </h1>
        </button>
      </div>

      <!-- seen section -->
      <div
        v-if="userStore.allGroupMessage.seen.length > 0"
        class="text-sm text-black text-opacity-50 mb-4"
      >
        messages
      </div>

      <div v-for="chat in userStore.allGroupMessage.seen" :key="chat.id">
        <button
          class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
          @click="handleOpenGroupMessage(chat.id as string)"
        >
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="chat.id"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ chat.name }}</h1>
          <div class="flex-1"></div>
          <h1
            v-if="chat.unseen_amount && chat.unseen_amount > 0"
            class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
          >
            {{ chat.unseen_amount }}
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useGlobalStore } from '../../store';
import { useUserStore } from '../../store/user';
import { getAllGroupMessage } from '../../helpers/pocketbase';
import { usePocketBaseStore } from '../../store/pocketbase';
import { useRouter } from 'vue-router';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const pb = usePocketBaseStore();

const router = useRouter();

const showCreateGroupPage = () => {
  globalStore.$state.isShowingCreateGroup = true;
};

const handleOpenGroupMessage = (chatId: string) => {
  router.push({
    path: '/group/' + chatId
  });
};

onBeforeMount(async () => {
  const groupMessage = await getAllGroupMessage();

  userStore.$state.groupMessage = groupMessage;

  // subscribe to all direct message
  await pb.pocketbase
    .collection('group_chat_info')
    .subscribe('*', (e: any) => {
      console.log('====================================');
      console.log('group subscription called');
      console.log('====================================');
      if (e.record.members.includes(userStore.userModel.id)) {
        userStore.$state.groupMessage.forEach((group, index) => {
          if (group.id === e.record.id) {
            userStore.$state.groupMessage[index] = e.record;

            const currentUnseen =
              group.unseen_message[userStore.userModel.id] ?? 0;
            const newRecordUnseen =
              e.record.unseen_message[userStore.userModel.id] ?? 0;

            // check if unseen is the same
            if (currentUnseen < newRecordUnseen) {
              if (globalStore.$state.isNotificationSoundAllowed) {
                globalStore.audioObject.play();
              }

              // sendNotification('New direct message!!!');
            }
          }
        });
      }
    })
    .catch(() => console.log('Error in GroupChat.vue'));
});
</script>
