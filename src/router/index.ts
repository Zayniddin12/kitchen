import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import home from "@/modules/Home/router";
import Inbox from '@/modules/Document/router';
import Monitoring from "@/modules/Monitoring/router";
import Settings from "@/modules/Settings/router";

const routes: Array<RouteRecordRaw> = [
  ...home,
  ...Inbox,
  ...Monitoring,
  ...Settings,
  {
    path: "/",
    redirect: () => {
      return { name: "home" };
    },
  },

  {
    path: "/login",
    name: "login",
    component: import("@/views/Login.vue"),
    meta: { layout: "LoginLayout" },

  },
  {
    path: "/test",
    component: () => import("@/views/Test.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: import("@/components/errors/404.vue"),
    meta: { layout: "ErrorLayout" },
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to: any) => {
  const DEFAULT_TITLE = 'KITCHEN'
  document.title = to.meta.title || DEFAULT_TITLE;
})

export default router;
