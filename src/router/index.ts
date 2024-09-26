import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import home from "@/modules/Home/router";
import Inbox from '@/modules/Document/OfficeNotice/Inbox/router'

const routes: Array<RouteRecordRaw> = [
  ...home,
  ...Inbox,

  {
    path: "/",
    redirect: () => {
      return { name: "home" };
    },
  },

  {
    path: "/login",
    name: "login",
    component: import("../views/Login.vue"),
    meta: { layout: "LoginLayout" },

  },
  {
    path: "/:pathMatch(.*)*",
    component: import("../components/errors/404.vue"),
    meta: { layout: "ErrorLayout" },
  },

];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes,
});

router.afterEach((to) => {
  const DEFAULT_TITLE = 'KITCHEN'
  document.title = to.meta.title || DEFAULT_TITLE;
})

export default router;
