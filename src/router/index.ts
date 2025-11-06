import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import VideoCall from '../components/VideoCall.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/chamada/:id', name: 'Chamada', component: VideoCall },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
