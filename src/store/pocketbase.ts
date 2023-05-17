import { defineStore } from 'pinia';

export const usePocketBaseStore = defineStore('PocketBase', {
  state: (): any => ({ pocketbase: null })
});
