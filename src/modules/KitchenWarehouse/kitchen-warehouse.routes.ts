import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/kitchen-warehouse/:id(\\d+)",
        name: "kitchen-warehouse-title-id",
        component: () => import("@/modules/KitchenWarehouse/pages/index.vue"),
        meta: {
            title: "Склад кухни"
        }
    },
    {
        path: "/kitchen-warehouse/:id(\\d+)/:id3(\\d+)",
        name: "kitchen-warehouse-id-id3",
        component: () => import("@/modules/KitchenWarehouse/pages/kitchen.vue"),
        meta: {
            title: "Склад кухни"
        }
    },
    {
        path: "/kitchen-warehouse/:id(\\d+)/:id3(\\d+)/:id4(\\d+)",
        name: "kitchen-warehouse-id-id3-id4",
        component: () => import("@/modules/KitchenWarehouse/pages/kitchenDetail.vue"),
        meta: {
            title: "Склад кухни"
        }
    }
] as RouteRecordRaw[];
