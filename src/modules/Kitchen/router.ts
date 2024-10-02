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
                        component: () => import("@/modules/Kitchen/pages/KitchenChild.vue"),
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
                                },
                                {
                                    label: "Паҳлавон",
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
];