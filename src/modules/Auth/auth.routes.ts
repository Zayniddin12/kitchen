import { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/login",
        name: "login",
        component: () => import("@/modules/Auth/pages/Login.vue"),
        meta: {
            layout: "LoginLayout",
            title: "Войти в аккаунт"
        }
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("@/modules/Auth/pages/ResetPassword.vue"),
        meta: {
            loginNotRequired: true,
            layout: "ResetPasswordLayout",
            title: "Сброс пароля"
        }
    }
] as RouteRecordRaw[];