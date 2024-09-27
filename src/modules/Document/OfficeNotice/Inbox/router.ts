export default [
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/modules/Document/OfficeNotice/Inbox/views/Inbox.vue"),
    meta: {
      title: 'Входящие',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: true,
        },
        {
          label: "Служебные записки",
          isActionable: true,
        },
        {
          label: "Входящие",
          isActionable: true,
        },
      ],

    },
  },
];
