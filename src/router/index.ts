import Login from '../page/auth/Login.vue';
import Home from '../page/Home.vue';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/auth',
    component: Login
  }
];

export default routes;
