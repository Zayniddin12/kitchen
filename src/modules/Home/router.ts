export default [
  {
    path: "/home",
    name: "home",
    component: () => import("@/modules/Home/views/Home.vue"),
    meta: {
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
