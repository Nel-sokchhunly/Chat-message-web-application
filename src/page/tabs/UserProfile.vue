<template>
  <div class="h-full px-4">
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

const globalStore = useGlobalStore();

const handleLogout = () => {
  Logout();

  globalStore.$reset();
};
</script>
