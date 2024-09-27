import { component } from "vue";

export default [
    {
        path: "/monitoring",
        name: "monitoring",
        redirect: { name: "monitoring.remainingGoods" },
        children: [
            {
                path: "remaining-goods",
                name: "monitoring.remainingGoods",
                redirect: { name: 'monitoring.remainingGoods.index' },
                children: [
                    {
                        path: "",
                        name: "monitoring.remainingGoods.index",
                        component: () => import("@/modules/Monitoring/views/remaining-goods/RemainingGoods.vue"),
                        meta: {
                            breadcrumb: [
                                {
                                    label: "Мониторинг",
                                },
                                {
                                    label: "Остатка товаров",
                                    isActionable: true
                                }
                            ]
                        },
                    },
                    {
                        path: "district/:id(\\d+)",
                        name: "monitoring.remainingGoods.district",
                        component: () => import("@/modules/Monitoring/views/remaining-goods/District.vue"),
                        meta: {
                            breadcrumb: []
                        }
                    }
                ]
            },
            {
                path: "kitchen-report",
                name: "monitoring.kitchenReport",
                component: () => import("@/modules/Monitoring/views/KitchenReport.vue")
            }
        ]
    }
]