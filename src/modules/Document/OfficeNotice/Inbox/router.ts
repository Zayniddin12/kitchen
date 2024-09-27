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
          isActionable: false,
        },
        {
          label: "Служебные записки",
          isActionable: false,
        },
        {
          label: "Входящие",
          isActionable: true,
        },
      ],

    },
  },
];
