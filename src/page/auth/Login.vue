<template>
  <div>login</div>

  <button @click="handleLogin" class="bg-green-100 p-2 rounded">Login</button>
  <button @click="handleLogout" class="bg-red-100 p-2 rounded">Logout</button>
</template>

<script setup lang="ts">
import { Login, Logout } from '../../helpers/auth';

const handleLogin = async () => {
  await Login({
    email: 'sokchhunlynel@gmail.com',
    password: '123456789'
  });
};

const handleLogout = async () => {
  Logout();
};
</script>
