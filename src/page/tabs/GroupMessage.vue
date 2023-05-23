<template>
  <!-- <div class="h-full" v-if="!userStore.isFetchingFinished">
      <Loading />
    </div> -->
  <!-- <CreateGroup /> -->

  <div class="px-4 h-screen w-full flex flex-col overflow-scroll pb-56">
    <!-- create new group -->
    <div
      @click="showCreateGroupPage"
      class="my-4 bg-secondary bg-opacity-60 p-2 text-primary font-bold w-full rounded-lg flex items-center space-x-4 px-4 cursor-pointer"
    >
      <img
        src="/icon/create-group.svg"
        alt=""
        class="h-4 transform rotate-45"
      />
      <h1>create new group</h1>
    </div>

    <!-- group section -->
    <div>
      <!-- unseen section -->
      <div class="text-sm text-black text-opacity-50 mb-4">Unseen messages</div>
      <!-- <div
          v-for="chat in userStore.allDirectMessageUser.unseen"
          :key="chat.id"
        >
          <button
            @click="handleOpenDirectMessage(chat.chatId)"
            class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
          >
            <div class="w-12 h-12 rounded-full">
              <identicon-svg
                class="block"
                :username="chat.memberObj.username"
                saturation="50"
              ></identicon-svg>
            </div>
            <h1>{{ chat.memberObj.username }}</h1>
            <div class="flex-1"></div>
            <h1
              v-if="chat.unseen && chat.unseen > 0"
              class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
            >
              {{ chat.unseen }}
            </h1>
          </button>
        </div> -->
      <!-- seen section -->
      <div class="text-sm text-black text-opacity-50 mb-4">messages</div>

      <!-- <div v-for="chat in userStore.allDirectMessageUser.seen" :key="chat.id">
  <button
    @click="handleOpenDirectMessage(chat.chatId)"
    class="flex flex-grow items-center border-2 w-full mb-4 rounded-lg"
  >
    <div class="w-12 h-12 rounded-full">
      <identicon-svg
        class="block"
        :username="chat.memberObj.username"
        saturation="50"
      ></identicon-svg>
    </div>
    <h1>{{ chat.memberObj.username }}</h1>
    <div class="flex-1"></div>
    <h1
      v-if="chat.unseen && chat.unseen > 0"
      class="text-white bg-red-600 rounded-lg h-6 w-6 flex justify-center items-center px-1 mr-4"
    >
      {{ chat.unseen }}
    </h1>
  </button>
</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../store';

const globalStore = useGlobalStore();

const showCreateGroupPage = () => {
  globalStore.$state.isShowingCreateGroup = true;
};
</script>
