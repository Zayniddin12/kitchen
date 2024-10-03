export default [
  {
    path: "/reference",
    name: "reference",
    component: () => import("@/modules/Settings/pages/Reference/index.vue"),
    meta: {
      title: "Справочники",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Главная",
          isActionable: true,
        },
        {
          label: "Справочники",
          isActionable: true,
        },
      ],

    },
  },

  {
    path: "/directory",
    name: "directory",
    component: () => import("@/modules/Settings/pages/Derictory/index.vue"),
    meta: {
      title: "Главная",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Главная",
          isActionable: true,
        },
      ],

    },
  },

  {
    path: "/personnel",
    name: "personnel",
    component: () => import("@/modules/Settings/pages/Personnel/index.vue"),
    meta: {
      title: "Главная",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Главная",
          isActionable: true,
        },
      ],

    },
  },
];
