import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";

export default [
    {
        path: "/kitchen/:department_id(\\d+)/:part_id(\\d+)",
        name: "Kitchen",
        meta: {
            title: "Кухня",
            breadcrumb: []
        },
        children: [
            {
                path: "",
                name: "KitchenIndex",
                component: () => import("@/modules/Kitchen/pages/Index.vue"),
                beforeEnter: (to, from, next) => {
                    const kitchenStore = useKitchenStore();

                    kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);


                    if (!kitchenStore.part) return next({ name: "notFound" });

                    to.meta.breadcrumb = [
                        {
                            label: "Кухня"
                        },
                        {
                            label: kitchenStore.part.name
                        },
                        {
                            label: kitchenStore.part.department_name,
                            isActionable: true
                        }
                    ];

                    next();
                }
            },
            {
                path: ":kitchen_id(\\d+)",
                name: "KitchenShow",
                redirect: { name: "KitchenShowIndex" },
                children: [
                    {
                        path: "",
                        name: "KitchenShowIndex",
                        component: () => import("@/modules/Kitchen/pages/KitchenShow.vue"),
                        beforeEnter: (to, from, next) => {
                            const kitchenStore = useKitchenStore();

                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                            if (!kitchenStore.part) return next({ name: "notFound" });

                            to.meta.breadcrumb = [
                                {
                                    label: "Кухня"
                                },
                                {
                                    label: kitchenStore.part.name
                                },
                                {
                                    label: kitchenStore.part.department_name
                                },
                                {
                                    label: "Лагерь",
                                    isActionable: true
                                }
                            ];

                            next();
                        }
                    },
                    {
                        path: ":child_id(\\d+)",
                        name: "KitchenShowChild",
                        redirect: { name: "KitchenShowChildIndex" },
                        children: [
                            {
                                path: "",
                                name: "KitchenShowChildIndex",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/Index.vue"),
                                beforeEnter: (to, from, next) => {
                                    const kitchenStore = useKitchenStore();

                                    kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                    if (!kitchenStore.part) return next({ name: "notFound" });

                                    to.meta.breadcrumb = [
                                        {
                                            label: "Кухня"
                                        },
                                        {
                                            label: kitchenStore.part.name
                                        },
                                        {
                                            label: kitchenStore.part.department_name
                                        },
                                        {
                                            label: "Лагерь"
                                        },
                                        {
                                            label: "Паҳлавон",
                                            isActionable: true
                                        }
                                    ];

                                    next();
                                }
                            },
                            {
                                path: "menu",
                                name: "KitchenMealPlan",
                                redirect: { name: "KitchenMealPlanIndex" },
                                children: [
                                    {
                                        path: "",
                                        name: "KitchenMealPlanIndex",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/Index.vue"),
                                        beforeEnter: (to, from, next) => {
                                            const kitchenStore = useKitchenStore();

                                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                            if (!kitchenStore.part) return next({ name: "notFound" });

                                            to.meta.breadcrumb = [
                                                {
                                                    label: "Кухня"
                                                },
                                                {
                                                    label: kitchenStore.part.name
                                                },
                                                {
                                                    label: kitchenStore.part.department_name
                                                },
                                                {
                                                    label: "Лагерь"
                                                },
                                                {
                                                    label: "Паҳлавон"
                                                },
                                                {
                                                    label: "Меню",
                                                    isActionable: true
                                                }
                                            ];

                                            next();
                                        }
                                    },
                                    {
                                        path: "create",
                                        name: "KitchenMealPlanCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/Create.vue"),
                                        beforeEnter: (to, from, next) => {
                                            const kitchenStore = useKitchenStore();

                                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                            if (!kitchenStore.part) return next({ name: "notFound" });

                                            to.meta.breadcrumb = [
                                                {
                                                    label: "Кухня"
                                                },
                                                {
                                                    label: kitchenStore.part.name
                                                },
                                                {
                                                    label: kitchenStore.part.department_name
                                                },
                                                {
                                                    label: "Лагерь"
                                                },
                                                {
                                                    label: "Паҳлавон"
                                                },
                                                {
                                                    label: "Меню"
                                                },
                                                {
                                                    label: "Добавить",
                                                    isActionable: true
                                                }
                                            ];

                                            next();
                                        }
                                    },
                                    {
                                        path: "edit",
                                        name: "KitchenMealPlanEdit",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/Edit.vue"),
                                        beforeEnter: (to, from, next) => {
                                            const kitchenStore = useKitchenStore();

                                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                            if (!kitchenStore.part) return next({ name: "notFound" });

                                            to.meta.breadcrumb = [
                                                {
                                                    label: "Кухня"
                                                },
                                                {
                                                    label: kitchenStore.part.name
                                                },
                                                {
                                                    label: kitchenStore.part.department_name
                                                },
                                                {
                                                    label: "Лагерь"
                                                },
                                                {
                                                    label: "Паҳлавон"
                                                },
                                                {
                                                    label: "Меню"
                                                },
                                                {
                                                    label: "Редактировать",
                                                    isActionable: true
                                                }
                                            ];

                                            next();
                                        }
                                    },
                                    {
                                        path: "sell-create",
                                        name: "KitchenMealPlanSellCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/pages/SellCreate.vue"),
                                        beforeEnter: (to, from, next) => {
                                            const kitchenStore = useKitchenStore();

                                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                            if (!kitchenStore.part) return next({ name: "notFound" });
                                            to.meta.title = "Продать";

                                            to.meta.breadcrumb = [
                                                {
                                                    label: "Кухня"
                                                },
                                                {
                                                    label: kitchenStore.part.name
                                                },
                                                {
                                                    label: kitchenStore.part.department_name
                                                },
                                                {
                                                    label: "Лагерь"
                                                },
                                                {
                                                    label: "Паҳлавон"
                                                },
                                                {
                                                    label: "Меню"
                                                },
                                                {
                                                    label: "Продать",
                                                    isActionable: true
                                                }
                                            ];

                                            next();
                                        }
                                    },

                                    {
                                        path: "cooking-dish-create",
                                        name: "KitchenMealPlanCookingDishCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/pages/CookingDishCreate.vue"),
                                        beforeEnter: (to, from, next) => {
                                            const kitchenStore = useKitchenStore();

                                            kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                            if (!kitchenStore.part) return next({ name: "notFound" });
                                            to.meta.title = "Приготовление блюда";

                                            to.meta.breadcrumb = [
                                                {
                                                    label: "Кухня"
                                                },
                                                {
                                                    label: kitchenStore.part.name
                                                },
                                                {
                                                    label: kitchenStore.part.department_name
                                                },
                                                {
                                                    label: "Лагерь"
                                                },
                                                {
                                                    label: "Паҳлавон"
                                                },
                                                {
                                                    label: "Меню"
                                                },
                                                {
                                                    label: "Приготовление блюда",
                                                    isActionable: true
                                                }
                                            ];

                                            next();
                                        }
                                    }

                                ]
                            },
                            {
                                path: "ration",
                                name: "KitchenRation",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/KitchenRation.vue"),
                                beforeEnter: (to, from, next) => {
                                    const kitchenStore = useKitchenStore();

                                    kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                    if (!kitchenStore.part) return next({ name: "notFound" });

                                    to.meta.breadcrumb = [
                                        {
                                            label: "Кухня"
                                        },
                                        {
                                            label: kitchenStore.part.name
                                        },
                                        {
                                            label: kitchenStore.part.department_name
                                        },
                                        {
                                            label: "Лагерь"
                                        },
                                        {
                                            label: "Паҳлавон"
                                        },
                                        {
                                            label: "Рационы",
                                            isActionable: true
                                        }
                                    ];

                                    next();
                                }
                            },
                            {
                                path: "calculator",
                                name: "KitchenCalculator",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/KitchenCalculator.vue"),
                                beforeEnter: (to, from, next) => {
                                    const kitchenStore = useKitchenStore();

                                    kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

                                    if (!kitchenStore.part) return next({ name: "notFound" });

                                    to.meta.breadcrumb = [
                                        {
                                            label: "Кухня"
                                        },
                                        {
                                            label: kitchenStore.part.name
                                        },
                                        {
                                            label: kitchenStore.part.department_name
                                        },
                                        {
                                            label: "Лагерь"
                                        },
                                        {
                                            label: "Паҳлавон"
                                        },
                                        {
                                            label: "Калькулятор",
                                            isActionable: true
                                        }
                                    ];

                                    next();
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];