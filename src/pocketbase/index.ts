import PocketBase from 'pocketbase';
import useUserStore from '../store/user';
import { usePocketBaseStore } from '../store/pocketbase';

export default async function initPocketBase() {
  const userStore = useUserStore();
  const pocketbaseStore = usePocketBaseStore();

  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

  pocketbaseStore.$patch({
    pocketbase: pb
  });

  userStore.$state.authStore = pb.authStore;

  pb.authStore.onChange(async () => {
    userStore.$state.authStore = pb.authStore;
  });

  return { pb, isLoggedIn: pb.authStore.isValid };
}

export function initPbClient() {
  const pocketbaseStore = usePocketBaseStore();

  return {
    pb: pocketbaseStore.pocketbase
  };
}
