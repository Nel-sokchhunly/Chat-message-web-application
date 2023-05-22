<template>
  <div>
    <div
      v-for="user in userStore.usersList"
      class="flex items-center justify-between pr-4 border-2 w-full mb-4 rounded-lg"
    >
      <!-- icon -->
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-full">
          <identicon-svg
            class="block"
            :username="user.username"
            saturation="50"
          ></identicon-svg>
        </div>
        <h1>{{ user.username }}</h1>
      </div>

      <!-- add to direct btn -->
      <button @click="directMessage(user.id)">
        <img src="/icon/paper-plane.svg" class="w-6" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getDirectMessage } from '../../helpers/pocketbase';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const router = useRouter();

const directMessage = async (id: string) => {
  try {
    const record = await getDirectMessage(userStore.userModel.id, id);

    router.push({
      path: '/direct/' + record.id
    });
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
};
</script>
