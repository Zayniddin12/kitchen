import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/home",
    name: "home",
    component: () => import("@/modules/Home/views/Home.vue"),
    meta: {
      title: 'Главная',
    },
  },
] as RouteRecordRaw[];
