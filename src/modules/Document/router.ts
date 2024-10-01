export default [
  // -------------------------Служебные записки-------------------------------
  // Входящие
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/Inbox.vue"),
    meta: {
      title: "Входящие",
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
    component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
    meta: {
      title: "Просмотр",
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
          to: "inbox",
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
    component: () => import("@/modules/Document/pages/OfficeNotes/Outgoing/Index.vue"),
    meta: {
      title: "Исходящие",
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
    component: () => import("@/modules/Document/pages/OfficeNotes/Outgoing/View.vue"),
    meta: {
      title: "Просмотр",
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
          to: "outgoing",
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
    component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
    meta: {
      title: "Черновики",
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
  // -------------------------Служебные записки-------------------------------


  // -------------------------Запросы-------------------------------
  // Полученные
  {
    path: "/received",
    name: "received",
    component: () => import("@/modules/Document/pages/Requests/Received/Index.vue"),
    meta: {
      title: "Полученные",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Запросы",
          isActionable: false,
        },
        {
          label: "Полученные",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/received/:id",
    name: "received-id",
    component: () => import("@/modules/Document/pages/Requests/Received/View.vue"),
    meta: {
      title: "Просмотр",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Запросы",
          isActionable: false,
        },
        {
          label: "Полученные",
          isActionable: false,
          to: "received",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },

  // Отправленные
  {
    path: "/sent",
    name: "sent",
    component: () => import("@/modules/Document/pages/Requests/Sent/Index.vue"),
    meta: {
      title: "Отправленные",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Запросы",
          isActionable: false,
        },
        {
          label: "Отправленные",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/sent/:id",
    name: "sent-id",
    component: () => import("@/modules/Document/pages/Requests/Sent/View.vue"),
    meta: {
      title: "Просмотр",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Запросы",
          isActionable: false,
        },
        {
          label: "Отправленные",
          isActionable: false,
          to: "sent",
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
    path: "/draft",
    name: "draft",
    component: () => import("@/modules/Document/pages/Requests/Drafts/Index.vue"),
    meta: {
      title: "Черновики",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Запросы",
          isActionable: false,
        },
        {
          label: "Черновики",
          isActionable: true,
        },
      ],

    },
  },


  // Накладные
  // Входящие
  {
    path: "/invoice-inbox",
    name: "invoice-inbox",
    component: () => import("@/modules/Document/pages/Invoices/InvoiceInbox/Index.vue"),
    meta: {
      title: "Входящие",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Накладные",
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
    path: "/invoice-inbox/:id",
    name: "invoice-inbox-id",
    component: () => import("@/modules/Document/pages/Invoices/InvoiceInbox/View.vue"),
    meta: {
      title: "Просмотр",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Накладные",
          isActionable: false,
        },
        {
          label: "Входящие",
          isActionable: false,
          to: 'invoice-inbox'
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
    path: "/invoice-outgoing",
    name: "invoice-outgoing",
    component: () => import("@/modules/Document/pages/Invoices/InvoiceOutgoing/Index.vue"),
    meta: {
      title: "Исходящие",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Накладные",
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
    path: "/invoice-outgoing/:id",
    name: "invoice-outgoing-id",
    component: () => import("@/modules/Document/pages/Invoices/InvoiceOutgoing/View.vue"),
    meta: {
      title: "Исходящие",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Накладные",
          isActionable: false,
        },
        {
          label: "Исходящие",
          isActionable: false,
          to: 'invoice-outgoing'
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },
  // -------------------------Запросы-------------------------------

  //acts
  {
    path: "/acts",
    name: "acts",
    component: () => import("@/modules/Document/pages/Acts/Index.vue"),
    meta: {
      title: "Акты",
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
      title: "Просмотр",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Акты",
          isActionable: false,
          to: "acts",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },

  // Contracts
  {
    path: "/contracts",
    name: "contracts",
    component: () => import("@/modules/Document/pages/Contracts/Index.vue"),
    meta: {
      title: "Контракты",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Документы",
          isActionable: false,
        },
        {
          label: "Контракты",
          isActionable: true,
        },
      ],
    },
  },
];
