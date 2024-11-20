import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/modules/Home/pages/Home.vue"),
    meta: {
      title: 'Главная',
      uniqueKeys: {
        home: true
      }
    },
  },
] as RouteRecordRaw[];
