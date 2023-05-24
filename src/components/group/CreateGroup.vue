<template>
  <div
    :class="{
      'h-screen w-screen z-[999999] fixed top-0 bg-white overflow-scroll transition-transform transform duration-500 flex flex-col items-center': true,
      'translate-x-0': globalStore.isShowingCreateGroup,
      '-translate-x-full': !globalStore.isShowingCreateGroup
    }"
  >
    <div class="w-screen md:w-1/2 p-6 space-y-4">
      <!-- navbar -->
      <div class="flex space-x-4 items-center">
        <button @click="cancelCreateGroup">
          <img src="/icon/cross.svg" alt="" class="h-4" />
        </button>
        <h1 class="font-bold text-black text-opacity-50">
          Create group message
        </h1>
      </div>

      <!-- body section -->
      <div class="w-full">
        <FormKit
          v-if="globalStore.isShowingCreateGroup"
          type="form"
          :actions="false"
          @submit="handleCreateGroup"
          :classes="{
            message: 'mt-4 text-sm text-red-600'
          }"
        >
          <!-- group name -->
          <FormKit
            type="text"
            label="Group name"
            placeholder="Group name"
            validation="required"
            name="Group name"
            validation-visibility="submit"
            v-model="formValues.groupName"
            :classes="{
              outer:
                'mb-5 w-full transition-all duration-500 outline-secondary',
              label: 'block mb-1 font-bold text-sm',
              inner:
                'w-full border border-2 border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-secondary',
              input:
                'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 focus:outline-none',
              help: 'text-sm text-gray-500',
              message: 'text-sm text-red-600'
            }"
          />

          <!-- select members -->
          <section class="w-full space-y-4">
            <div>
              <h1 class="w-full mb-1 font-bold text-sm">Members</h1>
              <!-- errors message -->
              <h1
                v-if="hasClickedSubmit && formValues.memberIds.length < 2"
                class="text-sm text-red-600"
              >
                Members has to be at least 2 users
              </h1>
            </div>

            <!-- selected users -->
            <div
              v-if="formValues.memberIds.length > 0"
              class="w-full rounded-lg border-2"
            >
              <div
                v-for="(id, index) in formValues.memberIds"
                :class="{
                  'p-2 hover:bg-secondary hover:bg-opacity-50 cursor-pointer bg-secondary bg-opacity-50 border-white': true,
                  'border-t-2': index !== 0
                }"
              >
                <div
                  v-if="formValues.membersObject[id]"
                  class="flex items-center"
                >
                  <div class="w-8 h-8 rounded-full">
                    <identicon-svg
                      class="block"
                      :username="formValues.membersObject[id].username"
                      saturation="50"
                    ></identicon-svg>
                  </div>
                  <h1 class="font-medium select-none">
                    {{ formValues.membersObject[id].username }}
                  </h1>
                  <div class="flex-1"></div>
                  <button type="button" class="mr-2" @click="removeUser(id)">
                    <img src="/icon/cross.svg" class="h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- search input -->
            <div
              class="w-full p-2 border-2 rounded-lg flex flex-grow items-center space-x-2 focus-within:border-secondary transition-colors"
            >
              <img src="/icon/search.svg" alt="search icon" class="h-4" />
              <input
                type="text"
                class="w-full focus:outline-none"
                placeholder="username"
                v-model="searchKeyword"
              />
            </div>

            <!-- search result list down -->
            <div
              v-if="searchKeyword !== ''"
              class="max-h-[300px] w-full border-collapse border-2 rounded-lg overflow-scroll"
              id="selected-user"
            >
              <template v-for="(user, index) in filteredUserList">
                <div
                  v-if="filteredUserList.length > 0 && user"
                  @click="selectUser(user)"
                  class="w-full flex items-center"
                  :class="{
                    'p-2 hover:bg-secondary hover:bg-opacity-50 cursor-pointer': true,
                    'border-b-2': index !== filteredUserList.length - 1
                  }"
                >
                  <div class="w-8 h-8 rounded-full">
                    <identicon-svg
                      class="block"
                      :username="user.username"
                      saturation="50"
                    ></identicon-svg>
                  </div>
                  <h1 class="font-medium select-none">{{ user.username }}</h1>
                  <div class="flex-1"></div>
                  <img
                    src="icon/cross.svg"
                    alt=""
                    class="mr-2 transform rotate-45 h-4"
                  />
                </div>
              </template>
              <!-- no result -->
              <div
                v-if="filteredUserList.length === 0"
                class="p-2 text-center font-semibold text-black text-opacity-50"
              >
                No User Found!!!
              </div>
            </div>
          </section>

          <!-- created by  -->
          <div class="mt-5 w-full flex items-center space-x-4">
            <h1 class="block font-bold text-sm">Admin:</h1>
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full">
                <identicon-svg
                  class="block"
                  :username="userStore.authStore.model.username"
                  saturation="50"
                ></identicon-svg>
              </div>
              <h1 class="font-medium select-none">
                {{ userStore.authStore.model.username }}
              </h1>
            </div>
          </div>

          <!-- create group -->
          <button
            type="submit"
            class="mt-5 p-4 bg-secondary w-full rounded-lg font-bold"
          >
            Create
          </button>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// this component does not unmount due to slide transition
import { reactive, ref } from 'vue';

import Fuse from 'fuse.js';

import { useGlobalStore } from '../../store';
import useUserStore from '../../store/user';
import { computed } from '@vue/reactivity';
import { GroupChatInfo } from '../../types/message';
import { createGroupChat } from '../../helpers/pocketbase';

const globalStore = useGlobalStore();
const userStore = useUserStore();

interface formValues {
  groupName: string;
  memberIds: string[];
  membersObject: any;
}

const formValues: formValues = reactive({
  groupName: '',
  memberIds: [],
  membersObject: {}
});

const hasClickedSubmit = ref(false);

const selectUser = (user: any) => {
  if (formValues.memberIds.includes(user.id)) return;

  formValues.memberIds.push(user.id);
  formValues.membersObject[user.id] = user;
};

const removeUser = (id: string) => {
  const index = formValues.memberIds.indexOf(id);
  formValues.memberIds.splice(index, 1);
};

const searchKeyword = ref('');

const filteredUserList: any = computed(() => {
  const fuse = new Fuse(userStore.usersList, {
    includeScore: true,
    threshold: 0.4,
    keys: ['username']
  });

  if (searchKeyword.value === '') return [];

  const result = fuse.search(searchKeyword.value);

  const filter = result
    .map((item) => {
      const isHasNotSelected = !formValues.memberIds.includes(item.item.id);

      if (isHasNotSelected) {
        return item.item;
      }
    })
    .filter((item) => item);

  return filter;
});

const handleCreateGroup = async () => {
  hasClickedSubmit.value = true;

  if (formValues.memberIds.length < 2) return;

  // includes self_id
  formValues.memberIds.push(userStore.authStore.model.id);

  // unseen_message
  let unseen_message = Object();
  formValues.memberIds.map((id) => {
    unseen_message[id] = 0;
  });

  // formData
  const formData: GroupChatInfo = {
    name: formValues.groupName,
    members: formValues.memberIds,
    created_by: userStore.authStore.model.id,
    messages_object: {
      message_list: []
    },
    unseen_message,
    type: 'group'
  };

  await createGroupChat(formData);

  cancelCreateGroup(); // close and reset state
};

const cancelCreateGroup = () => {
  globalStore.$state.isShowingCreateGroup = false;

  // treat section below as unMounted

  formValues.groupName = '';
  formValues.memberIds = [];
  searchKeyword.value = '';
  hasClickedSubmit.value = false;
};
</script>

<style>
.formkit-form {
  width: inherit !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#select-user::-webkit-scrollbar {
  display: block;
}
</style>
