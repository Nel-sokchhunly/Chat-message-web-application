import { initPbClient } from '../pocketbase';
import { LoginForm, SignupForm } from '../types/auth';

export async function Login({ email, password }: LoginForm) {
  const { pb } = initPbClient();

  try {
    await pb.collection('users').authWithPassword(email, password);

    return {
      isSuccess: true
    };
  } catch (err) {
    return err;
  }
}

export async function Signup(formData: SignupForm) {
  try {
    const { pb } = initPbClient();

    await pb.collection('users').create(formData);
    const data = await pb
      .collection('users')
      .authWithPassword(formData.email, formData.password);

    await pb.collection('user_message_info').create({
      username: data.record.username,
      existing_chat: {},
      belong_to: data.record.id
    });

    return {
      isSuccess: true
    };
  } catch (err) {
    return err;
  }
}

export function Logout() {
  const { pb } = initPbClient();

  localStorage.removeItem('direct_message');

  pb.authStore.clear();
}
