export default [
  // sidebar start
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
  // sidebar end

  // Документы start
  {
    path: "/reference-type-document",
    name: "reference-type-document",
    component: () =>
      import("@/modules/Settings/components/Reference/Document/TypeProduct/TypeDocument.vue"),
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
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Document/VidDocument/VidDocument.vue"
        ),
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
  // Документы end

  {
    path: "/reference-regional-directorates",
    name: "reference-regional-directorates",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectorates.vue"),
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
          isActionable: false,
          to: "reference",
        },

        {
          label: "Региональные управления",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-regional-directorates-add",
    name: "reference-regional-directorates-add",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutrition.vue"),
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
          isActionable: false,
          to: "reference",
        },

        {
          label: "Комбинаты питания",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-combine-nutrition-add",
    name: "reference-combine-nutrition-add",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
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
    component: () =>
      import("@/modules/Settings/components/Reference/WarehouseBases.vue"),
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
          isActionable: false,
          to: "reference",
        },

        {
          label: "Базы складов",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-warehouse-bases-add",
    name: "reference-warehouse-bases-add",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"
        ),
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
    component: () =>
      import(
        "@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"
        ),
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
    component: () =>
      import(
        "@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"
        ),
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
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBases.vue"),
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
          isActionable: false,
          to: "reference",
        },

        {
          label: "Склады базы",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-main-bases-add",
    name: "reference-main-bases-add",
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
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
  // Kitchen Warehouse

  {
    path: "/reference-kitchen-warehouse",
    name: "reference-kitchen-warehouse",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehouses.vue"),
    meta: {
      title: "Склады кухни",
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
          label: "Склады кухни",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-warehouse-add",
    name: "reference-kitchen-warehouse-add",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Добавить новый склад кухни",
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
          label: "Склады кухни",
          isActionable: false,
          to: "reference-kitchen-warehouse",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-warehouse-detail/:id",
    name: "reference-kitchen-warehouse-edit",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Редактировать склада кухни",
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
          label: "Склады кухни",
          isActionable: false,
          to: "reference-kitchen-warehouse",
        },
        {
          label: "Редактировать",
          isActionable: false,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-warehouse-view/:id",
    name: "reference-kitchen-warehouse-view",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей склада кухни",
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
          label: "Склады кухни",
          isActionable: false,
          to: "reference-kitchen-warehouse",
        },
        {
          label: "Просмотр",
          isActionable: false,
        },
      ],
    },
  },

  // Kitchen Type

  {
    path: "/reference-kitchen-type",
    name: "reference-kitchen-type",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenType.vue"),
    meta: {
      title: "Типы кухни",
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
          label: "Типы кухни",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-type-add",
    name: "reference-kitchen-type-add",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Добавить тип кухни",
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
          label: "Типы кухни",
          isActionable: false,
          to: "reference-kitchen-type",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-type-detail/:id",
    name: "reference-kitchen-type-edit",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Редактировать тип кухни",
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
          label: "Типы кухни",
          isActionable: false,
          to: "reference-kitchen-type",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-kitchen-type-view/:id",
    name: "reference-kitchen-type-view",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей тип кухни",
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
          label: "Типы кухни",
          isActionable: false,
          to: "reference-kitchen-type",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },

  //Suppliers

  {
    path: "/reference-suppliers",
    name: "reference-suppliers",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/Suppliers.vue"),
    meta: {
      title: "Поставщики",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Поставщики",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-suppliers-add",
    name: "reference-suppliers-add",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Добавить нового поставщика",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Поставщики",
          isActionable: false,
          to: "reference-suppliers",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-suppliers-detail/:id",
    name: "reference-suppliers-edit",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Редактирования поставщика",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Поставщики",
          isActionable: false,
          to: "reference-suppliers",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-suppliers-view/:id",
    name: "reference-suppliers-view",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Просмотр деталей поставщика",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Поставщики",
          isActionable: false,
          to: "reference-suppliers",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },

  //Organizations

  {
    path: "/reference-organization",
    name: "reference-organization",
    component: () => import("@/modules/Settings/components/Reference/Organizations/Organizations.vue"),
    meta: {
      title: "Организации",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Организации",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-organization-add",
    name: "reference-organization-add",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Добавить новую организацию",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Организации",
          isActionable: false,
          to: "reference-organization",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-organization-detail/:id",
    name: "reference-organization-edit",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Редактировать рациона",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Организации",
          isActionable: false,
          to: "reference-organization",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },

  {
    path: "/reference-organization-view/:id",
    name: "reference-organization-view",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Просмотр деталей организации",
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
          label: "Поставщики и организации",
          isActionable: false,
          to: "reference",
        },

        {
          label: "Организации",
          isActionable: false,
          to: "reference-organization",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },

  // Продукты start
  // Типы документов
  {
    path: "/reference-type-product",
    name: "reference-type-product",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/TypeProduct/TypeProduct.vue"
        ),
    meta: {
      title: "Типы продуктов",
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
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы продуктов",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-type-product-create",
    name: "reference-type-product-create",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"
        ),
    meta: {
      title: "Добавить тип продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: "reference-type-product",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-type-product-edit/:id",
    name: "reference-type-product-edit-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"
        ),
    meta: {
      title: "Редактирования типа продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: "reference-type-product",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-type-product-view/:id",
    name: "reference-type-product-view-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"
        ),
    meta: {
      title: "Просмотр деталей типа продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Справочники",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: "reference-type-product",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },

  // Виды документов
  {
    path: "/reference-vid-product",
    name: "reference-vid-product",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocument.vue"
        ),
    meta: {
      title: "Виды продуктов",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Типы продуктов",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-vid-add",
    name: "reference-vid-add",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"
        ),
    meta: {
      title: "Добавить вид продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: "reference-vid-product",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-view-edit/:id",
    name: "reference-vid-view-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"
        ),
    meta: {
      title: "Просмотр деталей вида продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: "reference-vid-product",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-vid-edit/:id",
    name: "reference-vid-edit-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"
        ),
    meta: {
      title: "Редактировать вид продукта",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Настройки",
          isActionable: false,
        },
        {
          label: "Продукты",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: "reference-vid-product",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },
  // Продукты end

  // Рационы и блюда
  // Рационы
  {
    path: "/reference-ration",
    name: "reference-ration",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/RationDishes/Ration/Ration.vue"
        ),
    meta: {
      title: "Виды продуктов",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Рационы",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-ration-create",
    name: "reference-ration-create",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"
        ),
    meta: {
      title: "Добавить новый рацион",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Рационы",
          isActionable: false,
          to: "reference-ration",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-ration-edit/:id",
    name: "reference-ration-edit-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"
        ),
    meta: {
      title: "Редактировать рациона",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Рационы",
          isActionable: false,
          to: "reference-ration",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-ration-view/:id",
    name: "reference-ration-view-id",
    component: () =>
      import(
        "@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"
        ),
    meta: {
      title: "Просмотр деталей рациона",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Рационы",
          isActionable: false,
          to: "reference-ration",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },

  // Блюда start
  {
    path: "/reference-dish",
    name: "reference-dish",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/Dish.vue"),
    meta: {
      title: "Блюда",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Блюда",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-dish-create",
    name: "reference-dish-create",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Добавить новое блюдо",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Блюда",
          isActionable: false,
          to: "reference-dish",
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-dish-edit/:id",
    name: "reference-dish-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Редактировать блюда",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Блюда",
          isActionable: false,
          to: "reference-dish",
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/reference-dish-view/:id",
    name: "reference-view-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Просмотр деталей блюда",
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
          label: "Рационы и блюда",
          isActionable: false,
          to: "reference",
        },
        {
          label: "Блюда",
          isActionable: false,
          to: "reference-dish",
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },
  // Блюда end
  // Рационы и блюда end
];
