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
    path: "/workshop/:district_id(\\d+)/:factory_id(\\d+)/:factory_item_id(\\d+)",
    name: "workshop-factory",
    component: () => import("@/modules/WorkShops/pages/factory.vue"),
    meta: {
      title: "Переработка продукта",
    },
  },
] as RouteRecordRaw[];