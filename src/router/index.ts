import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: '',
      meta: { authRequired: false },
      children: [
        { path: '', component: import('../views/Login.vue')},
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      meta: { authRequired: false },
      component: import('../components/errors/404.vue'),
    },
  ],
});

export default router;
