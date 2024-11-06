import { useDistrictStore } from "@/modules/Monitoring/store/district.store";
import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/monitoring",
    name: "monitoring",
    redirect: { name: "monitoring.remainingGoods" },
    meta: {
      title: "Мониторинг",
    },
    children: [
      {
        path: "remaining-goods",
        name: "monitoring.remainingGoods",
        redirect: { name: "monitoring.remainingGoods.index" },
        children: [
          {
            path: "",
            name: "monitoring.remainingGoods.index",
            component: () => import("@/modules/Monitoring/pages/remaining-goods/RemainingGoods.vue"),
            meta: {
              title: "Остатка товаров",
            },
          },
          {
            path: "district/:id(\\d+)",
            name: "monitoring.remainingGoods.district",
            component: () => import("@/modules/Monitoring/pages/remaining-goods/District.vue"),
          },
        ],
      },
      {
        path: "kitchen-report",
        name: "monitoring.kitchenReport",
        component: () => import("@/modules/Monitoring/pages/KitchenReport.vue"),
        meta: {
          title: "Отчет о кухне",
        },
      },
    ],
  },
] as RouteRecordRaw[];
