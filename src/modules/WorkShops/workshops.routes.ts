import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/workshop/:district_id(\\d+)/:workshop_id(\\d+)",
    name: "workshop",
    component: () => import("@/modules/WorkShops/pages/Index.vue"),
    meta: {
      title: "Цеха",
    },
  },
  {
    path: "/workshop-packaging/:district_id(\\d+)/:factory_id(\\d+)",
    name: "workshop-packaging",
    component: () => import("@/modules/WorkShops/pages/factory.vue"),
    meta: {
      title: "Переработка продукта",
    },
  },
] as RouteRecordRaw[];