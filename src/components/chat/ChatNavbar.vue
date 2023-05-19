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
            :username="username"
            saturation="50"
          ></identicon-svg>
        </div>
        <div>{{ username }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps({
  username: String
});

const router = useRouter();

const goBack = () => {
  router.push({ name: 'home' });
};
</script>
