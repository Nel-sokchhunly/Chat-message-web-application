<template>
  <div class="fixed top-4 h-screen w-full px-4 md:w-1/2 py-20 overflow-clip">
    <!-- search  -->
    <div
      class="mb-4 p-2 border-2 rounded-lg flex flex-grow items-center space-x-2 focus-within:border-secondary transition-colors"
    >
      <img src="/icon/search.svg" alt="search icon" class="h-4" />
      <input
        type="text"
        class="w-full focus:outline-none"
        placeholder="username"
        v-model="searchKeyword"
      />
    </div>

    <!-- users rendering -->
    <p class="w-full mb-2 text-black text-opacity-50 text-sm">Users</p>
    <div class="h-full w-full flex flex-col overflow-scroll pb-40">
      <div
        v-for="user in filteredUserList"
        class="flex items-center justify-between pr-4 border-2 w-full mb-4 rounded-lg"
      >
        <!-- icon -->
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="user.username"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ user.username }}</h1>
        </div>

        <!-- add to direct btn -->
        <button @click="directMessage(user.id)">
          <img src="/icon/paper-plane.svg" class="w-6" />
        </button>
      </div>
      <div
        v-for="user in filteredUserList"
        class="flex items-center justify-between pr-4 border-2 w-full mb-4 rounded-lg"
      >
        <!-- icon -->
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="user.username"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ user.username }}</h1>
        </div>

        <!-- add to direct btn -->
        <button @click="directMessage(user.id)">
          <img src="/icon/paper-plane.svg" class="w-6" />
        </button>
      </div>
      <div
        v-for="user in filteredUserList"
        class="flex items-center justify-between pr-4 border-2 w-full mb-4 rounded-lg"
      >
        <!-- icon -->
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full">
            <identicon-svg
              class="block"
              :username="user.username"
              saturation="50"
            ></identicon-svg>
          </div>
          <h1>{{ user.username }}</h1>
        </div>

        <!-- add to direct btn -->
        <button @click="directMessage(user.id)">
          <img src="/icon/paper-plane.svg" class="w-6" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getDirectMessage } from '../../helpers/pocketbase';
import { useUserStore } from '../../store/user';
import { computed, ref } from '@vue/reactivity';
import Fuse from 'fuse.js';

const userStore = useUserStore();
const router = useRouter();

const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['username']
};

const searchKeyword = ref<string>('');

const filteredUserList = computed(() => {
  if (searchKeyword.value !== '') {
    const fuse = new Fuse(userStore.usersList, fuseOptions);

    const result = fuse.search(searchKeyword.value);

    return result.map((item) => item.item);
  }

  return userStore.usersList;
});

const directMessage = async (id: string) => {
  try {
    const record = await getDirectMessage(userStore.userModel.id, id);

    router.push({
      path: '/direct/' + record.id
    });
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
};
</script>
