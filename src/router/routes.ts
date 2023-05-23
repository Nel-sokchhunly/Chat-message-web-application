import Login from '../page/auth/Login.vue';
import Home from '../page/Home.vue';
import Chat from '../page/Chat.vue';
import ChatGroup from '../page/ChatGroup.vue';

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
  },
  {
    name: 'direct',
    path: '/direct/:id',
    component: Chat
  },
  {
    name: 'group',
    path: '/group/:id',
    component: ChatGroup
  }
];
