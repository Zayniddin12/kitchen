import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
// import {isUserLoggedIn} from "./utils";
import home from "@/modules/Home/router";
import Inbox from "@/modules/Document/router";
import Monitoring from "@/modules/Monitoring/router";
import Settings from "@/modules/Settings/router";
import Warehouse from "@/modules/WarehouseBases/router";
import KitchenWarehouse from "@/modules/KitchenWarehouse/router";
import Kitchen from "@/modules/Kitchen/router";
import Users from "@/modules/Users/router";

const routes: RouteRecordRaw[] = [
    ...home,
    ...Inbox,
    ...Monitoring,
    ...Settings,
    ...Warehouse,
    ...KitchenWarehouse,
    ...Kitchen,
    ...Users,

    {
        path: "/",
        name: 'login',
        redirect: () => {
            // if (isUserLoggedIn()) {
            //     return {name: "reset-password"};
            // }
            return {name: "login"};
        },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/Login.vue"),
        meta: {layout: "LoginLayout"},
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("@/views/ResetPassword.vue"),
        meta: {loginNotRequired: true, layout: "ResetPasswordLayout"},
    },
    {
        path: "/income-password",
        name: "income-password",
        component: () => import("@/views/IncomePassword.vue"),
        meta: {loginNotRequired: true, layout: "IncomePasswordLayout"},
    },
    {
        path: "/new-password",
        name: "new-password",
        component: () => import("@/views/Password.vue"),
        meta: {loginNotRequired: true, layout: "PasswordLayout"},
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notFound",
        component: () => import("@/components/errors/404.vue"),
        meta: {layout: "ErrorLayout"},
    }
];


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to: any, _, next) => {
    if (!to.meta.layout) to.meta.layout = "MainLayout";
    next()

    // const isLoggedIn = isUserLoggedIn()
    //
    // if (!isLoggedIn) {
    //     next('/login')
    // } else {
    //     next()
    // }
});


router.afterEach((to: any) => {
    const DEFAULT_TITLE = "KITCHEN";
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
