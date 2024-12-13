import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/role",
    name: "role",
    redirect: { name: "role-list" },
    meta: {
      title: "role.name",
      isTranslate: true,
    },
    children: [
      {
        path: "list",
        name: "role-list",
        component: () => import("@/modules/Settings/components/Reference/Role/pages/RoleList.vue"),
        meta: {
          title: "role.name",
          isTranslate: true,
        },
      },
    ],
  },
] as RouteRecordRaw[];