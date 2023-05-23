<template>
  <div class="h-full" v-if="!globalStore.isFetchingFinished">
    <Loading />
  </div>

  <div v-else class="px-4 h-screen w-full flex flex-col overflow-scroll pb-56">
    <div>
      <!-- unseen section -->
      <div
        v-if="userStore.allDirectMessageUser.unseen.length > 0"
        class="text-sm text-black text-opacity-50 mb-4"
      >
        Unseen messages
      </div>
      <div v-for="chat in userStore.allDirectMessageUser.unseen" :key="chat.id">
        <button
          @click="handleOpenDirectMessage(chat.chatId)"
          class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
        >
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="chat.memberObj.username"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ chat.memberObj.username }}</h1>
          <div class="flex-1"></div>
          <h1
            v-if="chat.unseen && chat.unseen > 0"
            class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
          >
            {{ chat.unseen }}
          </h1>
        </button>
      </div>
    </div>

    <!-- seen section -->
    <div
      v-if="userStore.allDirectMessageUser.seen.length > 0"
      class="text-sm text-black text-opacity-50 mb-4"
    >
      messages
    </div>

    <div v-for="chat in userStore.allDirectMessageUser.seen" :key="chat.id">
      <button
        @click="handleOpenDirectMessage(chat.chatId)"
        class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
      >
        <div class="w-12 h-12 rounded-full">
          <identicon-svg
            class="block"
            :username="chat.memberObj.username"
            saturation="50"
          ></identicon-svg>
        </div>
        <h1>{{ chat.memberObj.username }}</h1>
        <div class="flex-1"></div>
        <h1
          v-if="chat.unseen && chat.unseen > 0"
          class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
        >
          {{ chat.unseen }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Loading from '../../components/Loading.vue';

import { useUserStore } from '../../store/user';
import { usePocketBaseStore } from '../../store/pocketbase';
import { getAllDirectMessage } from '../../helpers/pocketbase';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../../store';

const router = useRouter();
const userStore = useUserStore();
const globalStore = useGlobalStore();

const pb = usePocketBaseStore().pocketbase;

const handleOpenDirectMessage = (chatId: string) => {
  router.push({
    path: '/direct/' + chatId
  });
};

onMounted(async () => {
  if (!globalStore.isFetchingFinished) return;
  const directMessage = await getAllDirectMessage(pb);

  userStore.$state.directMessage = directMessage;
});
</script>
