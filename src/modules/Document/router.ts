export default [
  // Входящие
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/modules/Document/pages/Inbox/Inbox.vue"),
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
    component: () => import("@/modules/Document/pages/Inbox/View.vue"),
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

  // Исходящие
  {
    path: "/outgoing",
    name: "outgoing",
    component: () => import("@/modules/Document/pages/Outgoing/Index.vue"),
    meta: {
      title: 'Исходящие',
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
          label: "Исходящие",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/outgoing/:id",
    name: "outgoing-id",
    component: () => import("@/modules/Document/pages/Outgoing/View.vue"),
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
          label: "Исходящие",
          isActionable: false,
          to: 'outgoing',
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },

  // Черновики
  {
    path: "/drafts",
    name: "drafts",
    component: () => import("@/modules/Document/pages/Drafts/Index.vue"),
    meta: {
      title: 'Черновики',
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
          label: "Черновики",
          isActionable: true,
        },
      ],

    },
  },

  //acts
  {
    path: "/acts",
    name: "acts",
    component: () => import("@/modules/Document/pages/Acts/Index.vue"),
    meta: {
      title: 'Акты',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Акты",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/acts/:id",
    name: "acts-id",
    component: () => import("@/modules/Document/pages/Acts/View.vue"),
    meta: {
      title: 'Просмотр',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Акты",
          isActionable: false,
          to: 'acts',
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },
];
