<template>
  <div>Homepage</div>
  <button @click="handleLogout" class="bg-red-100 p-2 rounded">Logout</button>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
import { Logout } from '../helpers/auth';

// const router = useRouter();

function handleLogout() {
  Logout();
  // router.push({ name: 'auth' });
}
</script>
