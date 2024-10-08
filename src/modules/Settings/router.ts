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
    component: () => import("@/modules/Settings/components/Reference/Document/TypeProduct/TypeDocument.vue"),
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
    component: () => import("@/modules/Settings/components/Reference/Document/VidDocument/VidDocument.vue"),
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
  // Документы end


  // Продукты start
  // Типы документов
  {
    path: "/reference-type-product",
    name: "reference-type-product",
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/TypeProduct.vue"),
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
          to: 'reference'
        },
        {
          label: "Продукты",
          isActionable: false,
          to: 'reference'
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
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
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
          to: 'reference'
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: 'reference-type-product'
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
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
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
          to: 'reference'
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: 'reference-type-product'
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
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
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
          to: 'reference'
        },
        {
          label: "Типы продуктов",
          isActionable: false,
          to: 'reference-type-product'
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
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocument.vue"),
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
          to: 'reference'
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: 'reference'
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
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
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
          to: 'reference'
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: 'reference-vid-product'
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
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
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
          to: 'reference'
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: 'reference-vid-product'
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
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
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
          to: 'reference'
        },
        {
          label: "Виды продуктов",
          isActionable: false,
          to: 'reference-vid-product'
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
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/Ration.vue"),
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
          to: 'reference'
        },
        {
          label: "Рационы и блюда",
          isActionable: false,
          to: 'reference'
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
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
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
          to: 'reference'
        },
        {
          label: "Рационы и блюда",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Рационы",
          isActionable: false,
          to: 'reference-ration'
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
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
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
          to: 'reference'
        },
        {
          label: "Рационы и блюда",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Рационы",
          isActionable: false,
          to: 'reference-ration'
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
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
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
          to: 'reference'
        },
        {
          label: "Рационы и блюда",
          isActionable: false,
          to: 'reference'
        },
        {
          label: "Рационы",
          isActionable: false,
          to: 'reference-ration'
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],
    },
  },
];
