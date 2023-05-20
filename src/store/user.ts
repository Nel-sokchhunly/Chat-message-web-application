import { defineStore } from 'pinia';
import { DirectChatInfo } from '../types/message';
import { UserInfo } from '../types/auth';

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    authStore: null,
    usersList: [],
    directMessage: [],
    isFetchingFinished: false,
    isNotificationSoundAllowed: false
  }),
  getters: {
    userModel: (state) => state.authStore.model,
    allDirectMessageUser: (state) => {
      const selfId = state.authStore.model.id;
      const directMessages: any = {
        unseen: [],
        seen: []
      };

      if (state.directMessage.length === 0) return [];

      state.directMessage.forEach((chat) => {
        const memberId = chat.members.filter((id) => id !== selfId)[0];

        const memberObj = state.usersList.find((user) => user.id === memberId);

        let unseenAmount = chat.unseen_message[selfId] ?? 0;

        const data = {
          chatId: chat.id,
          memberId,
          memberObj,
          unseen: unseenAmount
        };

        if (unseenAmount > 0) {
          directMessages.unseen.push(data);
        } else {
          directMessages.seen.push(data);
        }
      });

      return directMessages;
    }
  }
});

interface UserStoreState {
  authStore: any;
  usersList: UserInfo[];
  directMessage: DirectChatInfo[];
  isFetchingFinished: boolean;
  isNotificationSoundAllowed: boolean;
}
