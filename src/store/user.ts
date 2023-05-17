import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({ authStore: null })
});

interface UserStoreState {
  authStore: any;
}
