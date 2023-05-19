<template>
  <div v-for="chat in userStore.allDirectMessageUser" :key="chat.id">
    <button
      @click="handleOpenDirectMessage(chat.chatId)"
      class="flex items-center border-2 w-full mb-4 rounded-lg"
    >
      <div class="w-12 h-12 rounded-full">
        <identicon-svg
          class="block"
          :username="chat.memberObj.username"
          saturation="50"
        ></identicon-svg>
      </div>
      <h1>{{ chat.memberObj.username }}</h1>
    </button>
  </div>
  <div class="h-full" v-if="!userStore.isFetchingFinished">
    <Loading />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Loading from '../../components/Loading.vue';

import { useUserStore } from '../../store/user';
import { usePocketBaseStore } from '../../store/pocketbase';
import { getAllDirectMessage } from '../../helpers/pocketbase';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const pb = usePocketBaseStore().pocketbase;

const handleOpenDirectMessage = (chatId: string) => {
  router.push({
    path: '/direct/' + chatId
  });
};

onMounted(async () => {
  if (!userStore.isFetchingFinished) return;
  const directMessage = await getAllDirectMessage(pb);

  userStore.$state.directMessage = directMessage;
});
</script>
