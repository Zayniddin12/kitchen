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
          to: "reference",
        },
        {
          label: "Документы",
          isActionable: false,
          to: "reference",
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
          to: "reference",
        },
        {
          label: "Виды документов",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы документов",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-regional-directorates",
    name: "reference-regional-directorates",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates.vue"),
    meta: {
      title: "Региональные управления",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Региональные управления",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-regional-directorates-add",
    name: "reference-regional-directorates-add",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Добавить новое региональное управление",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Региональные управления",
          isActionable: false,
          to: "reference-regional-directorates",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-regional-directorates-detail/:id",
    name: "reference-regional-directorates-edit",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Редактировать региональное управление",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Региональные управления",
          isActionable: false,
        },
        {
          label: "Редактировать",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-regional-directorates-view/:id",
    name: "reference-regional-directorates-view",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей региональное управление",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Региональные управления",
          isActionable: false,
        },
        {
          label: "Просмотр",
          isActionable: false,
        },
      ],
    },
  },


  // Combine

  {
    path: "/reference-combine-nutrition",
    name: "reference-combine-nutrition",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition.vue"),
    meta: {
      title: "Комбинаты питания",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Комбинаты питания",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-combine-nutrition-add",
    name: "reference-combine-nutrition-add",
    component: () => import("@/modules/Settings/components/Reference/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Добавить новый комбинат питания",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Комбинаты питания",
          isActionable: false,
          to: "reference-regional-directorates",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-combine-nutrition-detail/:id",
    name: "reference-combine-nutrition-edit",
    component: () => import("@/modules/Settings/components/Reference/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Редактировать комбината",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Комбинаты питания",
          isActionable: false,
        },
        {
          label: "Редактировать",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-combine-nutrition-view/:id",
    name: "reference-combine-nutrition-view",
    component: () => import("@/modules/Settings/components/Reference/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей комбината",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Комбинаты питания",
          isActionable: false,
        },
        {
          label: "Просмотр",
          isActionable: false,
        },
      ],
    },
  },

  // Warehouse bases

  {
    path: "/reference-warehouse-bases",
    name: "reference-warehouse-bases",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBases.vue"),
    meta: {
      title: "Базы складов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Базы складов",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-warehouse-bases-add",
    name: "reference-warehouse-bases-add",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Добавить базу складов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Базы складов",
          isActionable: false,
          to: "reference-warehouse-bases",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-warehouse-bases-detail/:id",
    name: "reference-warehouse-bases-edit",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Редактировать базу складов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Базы складов",
          isActionable: false,
        },
        {
          label: "Редактировать",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-combine-nutrition-view/:id",
    name: "reference-warehouse-bases-view",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей базы складов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Базы складов",
          isActionable: false,
        },
        {
          label: "Просмотр",
          isActionable: false,
        },
      ],
    },
  },

  // Main Bases

  {
    path: "/reference-main-bases",
    name: "reference-main-bases",
    component: () => import("@/modules/Settings/components/Reference/MainBases.vue"),
    meta: {
      title: "Склады базы",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Склады базы",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-main-bases-add",
    name: "reference-main-bases-add",
    component: () => import("@/modules/Settings/components/Reference/MainBasesAddEditView.vue"),
    meta: {
      title: "Добавить новый склад базы",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Склады базы",
          isActionable: false,
          to: "reference-main-bases",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-main-bases-detail/:id",
    name: "reference-main-bases-edit",
    component: () => import("@/modules/Settings/components/Reference/MainBasesAddEditView.vue"),
    meta: {
      title: "Редактирования склада",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Склады базы",
          isActionable: false,
          to: "reference-main-bases",
        },
        {
          label: "Редактировать",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-main-bases-view/:id",
    name: "reference-main-bases-view",
    component: () => import("@/modules/Settings/components/Reference/MainBasesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей склада",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Управ, комбинаты и склады",
          isActionable: true,
          to: "reference",
        },

        {
          label: "Склады базы",
          isActionable: false,
        },
        {
          label: "Просмотр",
          isActionable: false,
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
