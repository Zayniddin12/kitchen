import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/position",
    name: "position",
    redirect: { name: "position-list" },
    meta: {
      title: "position.list",
      isTranslate: true,
    },
    children: [
      {
        path: "list",
        name: "position-list",
        component: () => import("@/modules/Settings/components/Reference/Position/pages/PositionList.vue"),
        meta: {
          title: "position.list",
          isTranslate: true,
        },
      },
      {
        path: ":id(\\d+)",
        name: "position-show",
        component: () => import("@/modules/Settings/components/Reference/Position/pages/Position.vue"),
        meta: {
          title: "position.show",
          isTranslate: true,
        },
      },
      {
        path: ":id(\\d+)/edit",
        name: "position-edit",
        component: () => import("@/modules/Settings/components/Reference/Position/pages/PositionCreateOrEdit.vue"),
        meta: {
          title: "position.edit",
          isTranslate: true,
          method: "update",
          breadcrumbItemTitle: "method.edit",
          breadcrumbItemIsTranslate: true,
        },
      },
      {
        path: "create",
        name: "position-create",
        component: () => import("@/modules/Settings/components/Reference/Position/pages/PositionCreateOrEdit.vue"),
        meta: {
          title: "position.create",
          isTranslate: true,
          method: "create",
          breadcrumbItemTitle: "method.add",
          breadcrumbItemIsTranslate: true,
        },
      },
    ],
  },
] as RouteRecordRaw[];