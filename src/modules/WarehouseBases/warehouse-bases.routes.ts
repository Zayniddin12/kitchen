import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/warehouse/:district_id(\\d+)/:product_id(\\d+)",
        name: "warehouse",
        component: () => import("@/modules/WarehouseBases/pages/Index.vue"),
        meta: {
            title: "Базы складов"
        }
    }
] as RouteRecordRaw[];