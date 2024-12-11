import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/Auth/pages/Login.vue"),
    meta: {
      layout: "LoginLayout",
      title: "auth.login",
      isTranslate: true,
      isAuth: true,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/modules/Auth/pages/ResetPassword.vue"),
    meta: {
      layout: "LoginLayout",
      title: "Сброс пароля",
    },
  },
  {
    path: "/income-password",
    name: "income-password",
    component: () => import("@/modules/Auth/pages/IncomePassword.vue"),
    meta: {
      layout: "LoginLayout",
    },
  },
  {
    path: "/new-password",
    name: "new-password",
    component: () => import("@/modules/Auth/pages/Password.vue"),
    meta: {
      layout: "LoginLayout",
    },
  },
  {
    path: "/verify-oneid",
    name: "verify-oneid",
    component: () => import("@/modules/Auth/pages/VerifyOneId.vue"),
    meta: {
      layout: "LoginLayout",
    },
  },
] as RouteRecordRaw[];