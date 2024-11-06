import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/kitchen/:department_id(\\d+)/:part_name",
        name: "Kitchen",
        meta: {
            title: "Кухня"
        },
        children: [
            {
                path: "",
                name: "KitchenIndex",
                component: () => import("@/modules/Kitchen/pages/Index.vue")
            },
            {
                path: ":kitchen_id(\\d+)",
                name: "KitchenShow",
                redirect: { name: "KitchenShowIndex" },
                children: [
                    {
                        path: "",
                        name: "KitchenShowIndex",
                        component: () => import("@/modules/Kitchen/pages/KitchenShow.vue")
                    },
                    {
                        path: ":child_id(\\d+)",
                        name: "KitchenShowChild",
                        redirect: { name: "KitchenShowChildIndex" },
                        children: [
                            {
                                path: "",
                                name: "KitchenShowChildIndex",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/Index.vue")
                            },
                            {
                                path: "menu",
                                name: "KitchenMenu",
                                redirect: { name: "KitchenMenuIndex" },
                                children: [
                                    {
                                        path: "",
                                        name: "KitchenMenuIndex",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/Index.vue")
                                    },
                                    {
                                        path: ":id(\\d+)",
                                        name: "KitchenMenuShow",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/Show.vue")
                                    },
                                    {
                                        path: "create",
                                        name: "KitchenMenuCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/CreateOrEdit.vue"),
                                        meta: {
                                            title: "Добавить меню",
                                            breadcrumbItemTitle: "Добавить"
                                        }
                                    },
                                    {
                                        path: "edit",
                                        name: "KitchenMenuEdit",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/CreateOrEdit.vue"),
                                        meta: {
                                            title: "Редактировать",
                                            breadcrumbItemTitle: "Редактировать"
                                        }
                                    },
                                    {
                                        path: "sell-create",
                                        name: "KitchenMenuSellCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/pages/SellCreate.vue")
                                    },

                                    {
                                        path: "cooking-dish-create",
                                        name: "KitchenMenuCookingDishCreate",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/menu/pages/CookingDishCreate.vue")
                                    }

                                ]
                            },
                            {
                                path: "dishes",
                                name: "KitchenDishes",
                                redirect: { name: "KitchenDishesIndex" },
                                children: [
                                    {
                                        path: "",
                                        name: "KitchenDishesIndex",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/dishes/Index.vue")
                                    },
                                    {
                                        path: ":product_id(\\d+)",
                                        name: "KitchenDishesProductShow",
                                        component: () => import("@/modules/Kitchen/pages/kitchen-child/dishes/ProductShow.vue")
                                    }
                                ]
                            },
                            {
                                path: "ration",
                                name: "KitchenRation",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/KitchenRation.vue")
                            },
                            {
                                path: "calculator",
                                name: "KitchenCalculator",
                                component: () => import("@/modules/Kitchen/pages/kitchen-child/KitchenCalculator.vue"),
                                meta: {
                                    title: "Калькулятор"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
] as RouteRecordRaw[];