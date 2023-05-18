<template>
  <div class="p-2 px-4 pt-4 sticky top-0 left-0">
    <div class="flex space-x-4 items-center">
      <div class="w-12 h-12 rounded-full">
        <identicon-svg
          class="block"
          :username="userStore.userModel.username"
          saturation="50"
        ></identicon-svg>
      </div>
      <div>{{ userStore.userModel.username }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/user';

const userStore = useUserStore();
</script>
