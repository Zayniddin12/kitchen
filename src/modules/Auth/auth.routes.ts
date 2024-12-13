import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/Auth/pages/Login.vue"),
    meta: {
      layout: "LoginLayout",
      title: "auth.login.title",
      isTranslate: true,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/modules/Auth/pages/ResetPassword.vue"),
    meta: {
      layout: "LoginLayout",
      title: "auth.resetPassword.title",
      isTranslate: true,
    },
  },
  {
    path: "/verify-oneid",
    name: "verify-oneid",
    component: () => import("@/modules/Auth/pages/VerifyOneId.vue"),
    meta: {
      layout: "LoginLayout",
      title: "auth.login.oneId",
      isTranslate: true,
    },
  },
] as RouteRecordRaw[];