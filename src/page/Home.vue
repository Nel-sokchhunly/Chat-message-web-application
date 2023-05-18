<template>
  <div class="h-full relative">
    <Navbar />

    <div class="h-full">
      <DirectMessage v-if="selected === 1" />
      <GroupMessage v-if="selected === 2" />
      <UserList v-if="selected === 3" />
      <UserProfile v-if="selected === 4" />
    </div>

    <BottomNav
      :selected="selected"
      :options="options"
      :onchange="(id: Number) => selected = id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Navbar from '../layout/Navbar.vue';
import BottomNav from '../layout/BottomNav.vue';

import DirectMessage from './tabs/DirectMessage.vue';
import GroupMessage from './tabs/GroupMessage.vue';
import UserList from './tabs/UserList.vue';
import UserProfile from './tabs/UserProfile.vue';

const selected = ref<any>(1);
const options = [
  {
    id: 1,
    title: 'Direct',
    icon: 'icon/direct-message.svg',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 2,
    icon: 'icon/group-message.svg',
    title: 'Group',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 3,
    icon: 'icon/user-list.svg',
    title: 'Users',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 4,
    icon: 'icon/user.svg',
    title: 'Profile',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  }
];
</script>

<style>
.sm-btn-container-foreground {
  background-color: inherit !important;
  height: inherit !important;
  width: inherit !important;
  box-shadow: none !important;
}

.sm-btn-icon > img {
  height: 32px !important;
  width: 32px !important;
}
</style>
