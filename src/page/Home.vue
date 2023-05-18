<template>
  <div class="h-full relative">
    <Navbar />

    <div class="h-full">
      <DirectMessage v-if="selected === 1" />
      <GroupMessage v-if="selected === 2" />
      <UserProfile v-if="selected === 3" />
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
import UserProfile from './tabs/UserProfile.vue';

const selected = ref<any>(1);
const options = [
  {
    id: 1,
    title: 'Direct',
    icon: 'icon/direct-message.svg',
    color: 'bg-secondary'
  },
  {
    id: 2,
    icon: 'icon/group-message.svg',
    title: 'Group',
    color: 'bg-secondary'
  },
  {
    id: 3,
    icon: 'icon/user.svg',
    title: 'Profile',
    color: 'bg-secondary'
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
