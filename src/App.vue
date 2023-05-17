<template>
  <div id="app" class="h-screen w-full overflow-hidden">
    <router-view v-if="isLoaded"></router-view>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import initPocketBase from './pocketbase';
import { useUserStore } from './store/user';
import { useRouter } from 'vue-router';

import Loading from './components/Loading.vue';

const router = useRouter();
const userStore = useUserStore();

const isLoaded = ref<Boolean>(false);

onMounted(() => {
  const { isLoggedIn } = initPocketBase();

  if (!isLoggedIn) {
    router.replace({ name: 'auth' });
  } else {
    router.replace({ name: 'home' });
  }

  isLoaded.value = true;
});

userStore.$subscribe(() => {
  if (!userStore.authStore.isValid) {
    router.replace({ name: 'auth' });
  } else {
    if (router.currentRoute.value.fullPath === '/auth') {
      router.replace({ name: 'home' });
    }
  }
});
</script>
