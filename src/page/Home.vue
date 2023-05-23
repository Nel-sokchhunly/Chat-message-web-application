<template>
  <div class="flex-1 relative flex justify-center">
    <Navbar :onchange="(id: Number) => globalStore.currentTab = id" />

    <div class="h-screen w-screen md:w-1/2 fixed top-20 overflow-hidden">
      <DirectMessage v-if="globalStore.currentTab === 1" />
      <GroupMessage v-if="globalStore.currentTab === 2" />
      <UserList v-if="globalStore.currentTab === 3" />
      <UserProfile v-if="globalStore.currentTab === 4" />
    </div>

    <BottomNav
      :selected="globalStore.currentTab"
      :options="options"
      :onchange="(id: Number) =>  globalStore.currentTab = id"
    />

    <!-- ask for sound notification permission -->
    <div
      v-if="globalStore.$state.isShowNotificationPermission"
      class="z-10 fixed bg-white bottom-20 w-fit m-2 text-center rounded-lg overflow-clip"
    >
      <div
        class="bg-secondary bg-opacity-50 flex items-center space-x-2 px-4 py-2"
      >
        <button
          @click="closeAcceptSoundNotification"
          class="flex justify-center"
        >
          <img class="h-5 w-5" src="/icon/cross.svg" alt="" />
        </button>

        <div class="text-xs flex-1 select-none">
          Click accept and keep the tab active to receive notification
        </div>

        <button
          @click="handleAcceptSoundNotification"
          class="flex justify-center"
        >
          <img class="h-5 w-5" src="/icon/check.svg" alt="" />
        </button>
      </div>
    </div>

    <!-- create group page -->
    <CreateGroup />
  </div>
</template>

<script setup lang="ts">
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
import { useGlobalStore } from '../store';
import CreateGroup from '../components/group/CreateGroup.vue';

const pb = usePocketBaseStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();

const options = [
  {
    id: 1,
    title: 'Direct',
    icon: '/icon/direct-message.svg',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 2,
    icon: '/icon/group-message.svg',
    title: 'Group',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 3,
    icon: '/icon/user-list.svg',
    title: 'Users',
    bgColor: 'bg-secondary',
    textColor: 'text-primary'
  }
  // {
  //   id: 4,
  //   icon: '/icon/user.svg',
  //   title: 'Profile',
  //   bgColor: 'bg-secondary',
  //   textColor: 'text-primary'
  // }
];

const closeAcceptSoundNotification = () => {
  globalStore.$state.isShowNotificationPermission = false;
};

const handleAcceptSoundNotification = () => {
  globalStore.$state.isShowNotificationPermission = false;
  globalStore.$state.isNotificationSoundAllowed = true;

  globalStore.$state.audioObject.volume = 0;
  globalStore.$state.audioObject.play();
  globalStore.$state.audioObject.volume = 1;
};

onBeforeMount(async () => {
  // askNotificationPermission();
  globalStore.$state.audioObject = new Audio('/sound/notification-sound.wav');

  // try {
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

  globalStore.$state.isFetchingFinished = true;

  // subscribe to all direct message
  await pb.pocketbase
    .collection('direct_chat_info')
    .subscribe('*', (e: any) => {
      console.log('====================================');
      console.log('subscription called ');
      console.log('====================================');
      if (e.record.members.includes(userStore.userModel.id)) {
        userStore.$state.directMessage[e.record.id] =
          e.record.messages_object.message_list.sort(function (a: any, b: any) {
            var keyA = new Date(a.created),
              keyB = new Date(b.created);
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });

        userStore.$state.directMessage.forEach((direct, index) => {
          if (direct.id === e.record.id) {
            userStore.$state.directMessage[index] = e.record;

            const currentUnseen =
              direct.unseen_message[userStore.userModel.id] ?? 0;
            const newRecordUnseen =
              e.record.unseen_message[userStore.userModel.id] ?? 0;

            // check if unseen is the same
            if (currentUnseen < newRecordUnseen) {
              if (globalStore.isNotificationSoundAllowed) {
                globalStore.audioObject.play();
              }

              // sendNotification('New direct message!!!');
            }
          }
        });
      }
    })
    .catch(() => console.log('Error in Home.vue'));
});

onBeforeMount(() => {
  pb.pocketbase.collection('direct_chat_info').unsubscribe();
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
