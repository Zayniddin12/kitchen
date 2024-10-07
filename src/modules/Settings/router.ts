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
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-type-document",
    name: "reference-type-document",
    component: () => import("@/modules/Settings/components/Reference/TypeDocument.vue"),
    meta: {
      title: "Типы документов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Документы",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Типы документов",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-vid-document",
    name: "reference-vid-document",
    component: () => import("@/modules/Settings/components/Reference/VidDocument.vue"),
    meta: {
      title: "Виды документов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Виды документов",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Типы документов",
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
      title: "Логи",
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
