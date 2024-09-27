
export default [
    {
        path: "/monitoring",
        name: "monitoring",
        redirect: { name: "monitoring.remainingGoods" },
        children: [
            {
                path: "remaining-goods",
                name: "monitoring.remainingGoods",
                component: () => import("@/modules/Monitoring/views/RemainingGoods.vue"),
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
                }
            },
            {
                path: "kitchen-report",
                name: "monitoring.kitchenReport",
                component: () => import("@/modules/Monitoring/views/KitchenReport.vue")
            }
        ]
    }
]