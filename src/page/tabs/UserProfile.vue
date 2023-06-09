<template>
  <div class="h-full flex flex-col flex-grow px-4">
    <div>
      <h1 class="text-2xl font-bold">User Profile</h1>
      <div class="mt-5">
        <p class="text-lg font-bold">Name</p>
        <p class="text-lg">{{ userModel.username }}</p>
      </div>
      <div class="mt-5">
        <p class="text-lg font-bold">Email</p>
        <p class="text-lg">{{ userModel.email }}</p>
      </div>
    </div>

    <button
      @click="handleLogout"
      class="mt-5 p-4 bg-red-500 text-white w-full rounded-lg font-bold"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { Logout } from '../../helpers/auth';
import { useGlobalStore } from '../../store';
import useUserStore from '../../store/user';

const globalStore = useGlobalStore();
const userModel = useUserStore().$state.authStore.model;

const handleLogout = () => {
  Logout();

  globalStore.$reset();
};
</script>
