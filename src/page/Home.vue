<template>
  <div>Homepage</div>
  <img src="https://ui-avatars.com/api/?name=sokchunly+nel" />
  <button @click="handleLogout" class="bg-red-100 p-2 rounded">Logout</button>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Logout } from '../helpers/auth';
import { useUserStore } from '../store/user';

// const router = useRouter();

const userStore = useUserStore();

onMounted(() => {
  console.log('====================================');
  console.log(userStore.authStore.model);
  console.log('====================================');
});

function handleLogout() {
  Logout();
  // router.push({ name: 'auth' });
}
</script>
