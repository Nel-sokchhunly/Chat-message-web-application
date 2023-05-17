import PocketBase from 'pocketbase';
import { useUserStore } from '../store/user';
import { usePocketBaseStore } from '../store/pocketbase';
import { useRouter } from 'vue-router';

export default function initPocketBase() {
  const userStore = useUserStore();
  const pocketbaseStore = usePocketBaseStore();

  const pb = new PocketBase('http://127.0.0.1:8090');

  pocketbaseStore.$patch({
    pocketbase: pb
  });

  pb.authStore.onChange(() => {
    userStore.$state.authStore = pb.authStore;
  });

  return { pb, isLoggedIn: pb.authStore.isValid };
}
