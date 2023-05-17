import Login from '../page/auth/Login.vue';
import Home from '../page/Home.vue';

import { useRouter } from 'vue-router';

export const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'auth',
    path: '/auth',
    component: Login
  }
];

export function routerGuard(isLoggedIn: boolean) {
  const router = useRouter();
  router.beforeResolve((to) => {
    if (isLoggedIn && to.name === 'auth') {
      return { name: 'home' };
    }

    if (!isLoggedIn && to.name !== 'auth') {
      return { name: 'auth' };
    }

    return true;
  });
}
