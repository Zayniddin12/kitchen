import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/login",
        name: "login",
        component: () => import("@/modules/Auth/pages/Login.vue"),
        meta: {layout: "LoginLayout"},
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("@/modules/Auth/pages/ResetPassword.vue"),
        meta: {loginNotRequired: true, layout: "ResetPasswordLayout"},
    },
    {
        path: "/income-password",
        name: "income-password",
        component: () => import("@/modules/Auth/pages/IncomePassword.vue"),
        meta: {loginNotRequired: true, layout: "IncomePasswordLayout"},
    },
    {
        path: "/new-password",
        name: "new-password",
        component: () => import("@/modules/Auth/pages/Password.vue"),
        meta: {loginNotRequired: true, layout: "PasswordLayout"},
    },
] as  RouteRecordRaw[]