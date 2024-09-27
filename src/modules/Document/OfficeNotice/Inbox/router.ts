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
  {
    path: "/inbox/:id",
    name: "inbox-id",
    component: () => import("@/modules/Document/OfficeNotice/Inbox/views/View.vue"),
    meta: {
      title: 'Просмотр',
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
          isActionable: false,
          to: 'inbox',
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },
];
