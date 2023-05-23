<template>
  <div
    class="fixed top-0 h-fit w-screen flex flex-col justify-center items-center mb-2 z-90"
  >
    <div
      class="h-20 w-screen md:w-1/2 p-2 px-4 pt-4 flex items-center justify-between"
    >
      <div class="flex space-x-4 items-center">
        <div class="w-12 h-12 rounded-lg border-2">
          <identicon-svg
            class="block"
            :username="userStore.userModel.username"
            saturation="50"
          ></identicon-svg>
        </div>
        <div>{{ userStore.userModel.username }}</div>
      </div>

      <button
        class="bg-secondary bg-opacity-40 rounded-full p-2 px-4 text-primary font-bold flex space-x-2 items-center"
        @click="
          () => {
            onchange(4); // 4 is the id for profile component
          }
        "
      >
        <img src="/icon/user.svg" alt="profile" class="h-4" />
        <span class="hidden md:block">Profile</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/user';

defineProps({
  onchange: {
    type: Function,
    required: true
  }
});

const userStore = useUserStore();
</script>
