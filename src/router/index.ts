import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import home from "@/modules/Home/router";

const routes: Array<RouteRecordRaw> = [
  ...home,

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

export default router;
