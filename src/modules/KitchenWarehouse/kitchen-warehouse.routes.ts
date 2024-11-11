import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/kitchen-warehouse/:id",
        name: "kitchen-warehouse-title-id",
        component: () => import("@/modules/KitchenWarehouse/views/index.vue"),
        meta: {
            title: "Склад кухни"
        }
    },
    {
        path: "/kitchen-warehouse/:id/:id3",
        name: "kitchen-warehouse-id-id3",
        component: () => import("@/modules/KitchenWarehouse/pages/kitchen.vue"),
        meta: {
            title: "Склад кухни"
        }
    },
    {
        path: "/kitchen-warehouse/:id/:id3/:id4",
        name: "kitchen-warehouse-id-id3-id4",
        component: () => import("@/modules/KitchenWarehouse/pages/kitchenDetail.vue"),
        meta: {
            title: "Склад кухни"
        }
    }
] as RouteRecordRaw[];
