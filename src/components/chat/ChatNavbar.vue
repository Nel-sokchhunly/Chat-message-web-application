<template>
  <div
    class="fixed top-0 h-fit w-screen flex justify-center items-center bg-white z-10"
  >
    <div
      class="w-screen md:w-1/2 h-20 p-2 px-4 pt-4 flex items-center space-x-6"
    >
      <button class="h-8 w-8" @click="goBack">
        <img src="/icon/back-arrow.svg" />
      </button>
      <div class="flex space-x-4 items-center">
        <div class="w-12 h-12 rounded-lg border-2">
          <identicon-svg
            class="block"
            :username="isGroup ? groupId : username"
            saturation="50"
          ></identicon-svg>
        </div>
        <div>{{ username }}</div>
      </div>
      <div class="flex-1"></div>

      <button
        v-if="isGroup"
        class="bg-secondary bg-opacity-40 rounded-full p-2 px-4 text-primary font-bold flex space-x-2 items-center"
        @click="toggleChatInfo"
      >
        <img src="/icon/info.svg" alt="profile" class="h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const { username, isGroup, groupId, onPressed } = defineProps({
  username: String,
  isGroup: Boolean,
  groupId: String,
  onPressed: Function
});

const router = useRouter();

const goBack = () => {
  router.push({ name: 'home' });
};

const toggleChatInfo = () => {
  if (isGroup && onPressed) onPressed();
};
</script>
