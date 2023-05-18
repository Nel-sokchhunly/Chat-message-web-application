import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({ authStore: null }),
  getters: {
    userModel: (state) => state.authStore.model
  }
});

interface UserStoreState {
  authStore: any;
}
