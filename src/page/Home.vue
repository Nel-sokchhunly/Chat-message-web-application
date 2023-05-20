<template>
  <div class="flex-1 relative flex justify-center">
    <Navbar />

    <div class="w-screen md:w-1/2 fixed top-20 p-4">
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
import { onBeforeMount } from 'vue';
import { usePocketBaseStore } from '../store/pocketbase';
import { useUserStore } from '../store/user';
import { getAllDirectMessage } from '../helpers/pocketbase';
import { onMounted } from 'vue';
import { askNotificationPermission } from '../helpers/notification';

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

const pb = usePocketBaseStore();
const userStore = useUserStore();

// const directMessageLocalStorage = ref<DirectChatInfo[]>();

onBeforeMount(async () => {
  // get all users list
  const users = await pb.pocketbase.collection('users').getFullList({
    filter: `id!='${pb.pocketbase.authStore.model?.id}'`
  });

  const userList: any = [];
  users.forEach((user: any) => {
    userList.push({
      ...user
    });
  });

  userStore.$state.usersList = userList;

  // get all direct message
  const directMessage = await getAllDirectMessage(pb.pocketbase);

  userStore.$state.directMessage = directMessage;

  userStore.$state.isFetchingFinished = true;

  // subscribe to all direct message
  await pb.pocketbase
    .collection('direct_chat_info')
    .subscribe('*', (e: any) => {
      if (e.record.members.includes(userStore.userModel.id)) {
        // userStore.$state.directMessage[e.record.id] = e.record;
        userStore.$state.directMessage.forEach((direct, index) => {
          if (direct.id === e.record.id) {
            userStore.$state.directMessage[index] = e.record;

            const currentUnseen =
              direct.unseen_message[userStore.userModel.id] ?? 0;
            const newRecordUnseen =
              e.record.unseen_message[userStore.userModel.id] ?? 0;

            // check if unseen is the same
            if (currentUnseen < newRecordUnseen) {
              let audio = new Audio('/sound/notification-sound.mp3');
              audio.play();
            }
          }
        });
      }
    });
});

onMounted(() => {
  askNotificationPermission();
});
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
