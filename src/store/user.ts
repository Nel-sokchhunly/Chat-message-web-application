import { defineStore } from 'pinia';
import { DirectChatInfo, GroupChatInfo } from '../types/message';
import { UserInfo } from '../types/auth';

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    authStore: null,
    usersList: [],
    directMessage: [],
    groupMessage: []
  }),
  getters: {
    userModel: (state) => state.authStore.model,
    allDirectMessageUser: (state) => {
      const selfId = state.authStore.model.id;
      const directMessages: any = {
        unseen: [],
        seen: []
      };

      state.directMessage.forEach((chat) => {
        const memberId = chat.members.filter((id) => id !== selfId)[0]; // opposite user

        const memberObj = state.usersList.find((user) => user.id === memberId); // opposite user object

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
    },
    allGroupMessage: (state) => {
      const selfId = state.authStore.model.id;

      const groupMessage: {
        unseen: GroupChatInfo[];
        seen: GroupChatInfo[];
      } = {
        unseen: [],
        seen: []
      };

      state.groupMessage.forEach((chat) => {
        let unseenAmount = chat.unseen_message[selfId] ?? 0;

        if (unseenAmount > 0) {
          groupMessage.unseen.push(chat);
        } else {
          groupMessage.seen.push(chat);
        }
      });

      return groupMessage;
    }
  }
});

interface UserStoreState {
  authStore: any;
  usersList: UserInfo[];
  directMessage: DirectChatInfo[];
  groupMessage: GroupChatInfo[];
}
