export default [
  {
    path: "/personal-database",
    name: "personal-database",
    component: () => import("@/modules/Users/pages/PersonnelDatabase/Index.vue"),
    meta: {
      title: 'База кадров',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: true,
        },
        {
          label: "База кадров",
          isActionable: false,
        },
      ],

    },
  },

  {
    path: "/visitors",
    name: "visitors",
    component: () => import("@/modules/Users/pages/Visitors/Index.vue"),
    meta: {
      title: 'Посетители',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: true,
        },
        {
          label: "Посетители",
          isActionable: false,
        },
      ],

    },
  },
];
