import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('default', {
  state: (): GlobalStore => ({
    isShowingCreateGroup: false,
    isShowNotificationPermission: true,
    isNotificationSoundAllowed: false,
    isFetchingFinished: false
  })
});

type GlobalStore = {
  isShowingCreateGroup: boolean;
  isShowNotificationPermission: boolean;
  isNotificationSoundAllowed: boolean;
  isFetchingFinished: boolean;
};
