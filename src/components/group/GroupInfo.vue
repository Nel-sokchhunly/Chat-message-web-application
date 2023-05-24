<template>
  <div
    :class="{
      'h-screen w-screen z-[999999] fixed top-0 overflow-scroll transition-transform transform duration-500 flex flex-col items-center bg-white': true,
      'translate-x-0': isShowing,
      'translate-x-full': !isShowing
    }"
  >
    <div class="w-screen md:w-1/2 p-6 space-y-4">
      <div class="flex space-x-4 items-center">
        <button @click="() => close()">
          <img src="/icon/cross.svg" alt="" class="h-4" />
        </button>
        <h1 class="font-bold text-black text-opacity-50">Group Info</h1>
      </div>

      <div class="w-full">
        <FormKit
          type="form"
          :actions="false"
          :classes="{
            message: 'mt-4 text-sm text-red-600'
          }"
          @submit="handleEditAction"
        >
          <!-- group name -->
          <FormKit
            :disabled="viewingState === 'view'"
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
                  'p-2 cursor-pointer': true,
                  'border-t-2': index !== 0,
                  'bg-secondary bg-opacity-50 border-white':
                    viewingState === 'edit'
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
                  <button
                    v-if="
                      viewingState === 'edit' && id !== chatRecord.created_by
                    "
                    type="button"
                    class="mr-2"
                    @click="removeUser(id)"
                  >
                    <img src="/icon/cross.svg" class="h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- search input -->
            <div
              v-if="viewingState === 'edit'"
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
                  :username="chatRecord.expand?.created_by.username"
                  saturation="50"
                ></identicon-svg>
              </div>
              <h1 class="font-medium select-none">
                {{ chatRecord.expand?.created_by.username }}
              </h1>
            </div>
          </div>

          <!-- create group -->
          <div class="mt-5 w-full flex space-x-2">
            <button
              v-if="viewingState === 'edit'"
              type="button"
              @click="close()"
              class="p-4 bg-red-500 text-white flex-1 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              v-if="userStore.authStore.model.id === chatRecord.created_by"
              type="submit"
              class="p-4 bg-secondary flex-1 rounded-lg font-bold"
            >
              {{ viewingState === 'view' ? 'Edit' : 'Save' }}
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount, computed } from 'vue';
import { GroupChatInfo } from '../../types/message';
import Fuse from 'fuse.js';
import useUserStore from '../../store/user';
import { UserInfo } from '../../types/auth';
import { usePocketBaseStore } from '../../store/pocketbase';

const props = defineProps<{
  isShowing: Boolean;
  toggleGroupInfo: Function;
  chatRecord: GroupChatInfo;
}>();

const pb = usePocketBaseStore().pocketbase;
const userStore = useUserStore();

const viewingState = ref<'view' | 'edit'>('view');
const hasClickedSubmit = ref(false);
const searchKeyword = ref('');

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

const resetInitialData = () => {
  viewingState.value = 'view';

  searchKeyword.value = '';
  formValues.groupName = props.chatRecord.name;
  formValues.memberIds = [...props.chatRecord.members]; // remove ref using ...
  formValues.membersObject = {};

  props.chatRecord.expand?.members.forEach((member: UserInfo) => {
    formValues.membersObject[member.id] = { ...member }; // remove ref using ...
  });
};

const close = () => {
  props.toggleGroupInfo();
  resetInitialData();
};

onBeforeMount(() => {
  resetInitialData();
});

const selectUser = (user: any) => {
  if (formValues.memberIds.includes(user.id)) return;

  formValues.memberIds.push(user.id);
  formValues.membersObject[user.id] = user;
};

const removeUser = (id: string) => {
  const index = formValues.memberIds.indexOf(id);
  formValues.memberIds.splice(index, 1);
};

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

const handleEditAction = async () => {
  if (viewingState.value === 'view') {
    viewingState.value = 'edit';
    return;
  }

  hasClickedSubmit.value = false;

  const isGroupNameTheSame = formValues.groupName === props.chatRecord.name;
  const isMemberStillTheSame =
    JSON.stringify(formValues.memberIds) ===
    JSON.stringify(props.chatRecord.members);

  const isNoDataHasChanged = isGroupNameTheSame && isMemberStillTheSame;

  if (isNoDataHasChanged) {
    viewingState.value = 'edit';
    return;
  }

  await pb.collection('group_chat_info').update(props.chatRecord.id, {
    name: formValues.groupName,
    members: formValues.memberIds
  });

  close();
};
</script>
