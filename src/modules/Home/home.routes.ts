import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/modules/Home/pages/Home.vue"),
    meta: {
      title: 'navigation.home',
      isTranslate: true,
      uniqueKeys: {
        home: true
      }
    },
  },
] as RouteRecordRaw[];
