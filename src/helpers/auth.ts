import { usePocketBaseStore } from '../store/pocketbase';
import { LoginForm } from '../types/auth';

function init() {
  const pocketbaseStore = usePocketBaseStore();

  return {
    pb: pocketbaseStore.pocketbase
  };
}

export async function Login({ email, password }: LoginForm) {
  const { pb } = init();

  try {
    await pb.collection('users').authWithPassword(email, password);
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
}

export function Logout() {
  const { pb } = init();

  pb.authStore.clear();
}
