export default [
  // sidebar start
  {
    path: "/reference",
    name: "reference",
    component: () => import("@/modules/Settings/pages/Reference/index.vue"),
    meta: {
      title: "Справочники",
    },
  },
  {
    path: "/personnel",
    name: "personnel",
    component: () => import("@/modules/Settings/pages/Personnel/index.vue"),
    meta: {
      title: "Логи",
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
    },
  },
  {
    path: "/reference-vid-document",
    name: "reference-vid-document",
    component: () => import("@/modules/Settings/components/Reference/Document/VidDocument/VidDocument.vue"),
    meta: {
      title: "Виды документов",
    },
  },
  // Документы end

  {
    path: "/reference-regional-directorates",
    name: "reference-regional-directorates",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectorates.vue"),
    meta: {
      title: "Региональные управления",
    },
  },

  {
    path: "/reference-regional-directorates-add",
    name: "reference-regional-directorates-add",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Добавить новое региональное управление",
    },
  },

  {
    path: "/reference-regional-directorates-detail/:id",
    name: "reference-regional-directorates-edit",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Редактировать региональное управление",
    },
  },

  {
    path: "/reference-regional-directorates-view/:id",
    name: "reference-regional-directorates-view",
    component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей региональное управление",
    },
  },

  // Combine

  {
    path: "/reference-combine-nutrition",
    name: "reference-combine-nutrition",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutrition.vue"),
    meta: {
      title: "Комбинаты питания",
    },
  },

  {
    path: "/reference-combine-nutrition-add",
    name: "reference-combine-nutrition-add",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Добавить новый комбинат питания",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-combine-nutrition-detail/:id",
    name: "reference-combine-nutrition-edit",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Редактировать комбината",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-combine-nutrition-view/:id",
    name: "reference-combine-nutrition-view",
    component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей комбината",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Warehouse bases

  {
    path: "/reference-warehouse-bases",
    name: "reference-warehouse-bases",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBases.vue"),
    meta: {
      title: "Базы складов",
    },
  },

  {
    path: "/reference-warehouse-bases-add",
    name: "reference-warehouse-bases-add",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Добавить базу складов",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-warehouse-bases-detail/:id",
    name: "reference-warehouse-bases-edit",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Редактировать базу складов",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-warehouse-bases-view/:id",
    name: "reference-warehouse-bases-view",
    component: () => import("@/modules/Settings/components/Reference/WarehouseBasesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей базы складов",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Main Bases

  {
    path: "/reference-main-bases",
    name: "reference-main-bases",
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBases.vue"),
    meta: {
      title: "Склады базы",
    },
  },

  {
    path: "/reference-main-bases-add",
    name: "reference-main-bases-add",
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
    meta: {
      title: "Добавить новый склад базы",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-main-bases-detail/:id",
    name: "reference-main-bases-edit",
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
    meta: {
      title: "Редактирования склада",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-main-bases-view/:id",
    name: "reference-main-bases-view",
    component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей склада",
      breadcrumbItemTitle: "Просмотр",
    },
  },
  // Kitchen Warehouse

  {
    path: "/reference-kitchen-warehouse",
    name: "reference-kitchen-warehouse",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehouses.vue"),
    meta: {
      title: "Склады кухни",
    },
  },

  {
    path: "/reference-kitchen-warehouse-add",
    name: "reference-kitchen-warehouse-add",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Добавить новый склад кухни",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-kitchen-warehouse-detail/:id",
    name: "reference-kitchen-warehouse-edit",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Редактировать склада кухни",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-kitchen-warehouse-view/:id",
    name: "reference-kitchen-warehouse-view",
    component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
    meta: {
      title: "Просмотр деталей склада кухни",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Kitchen Type

  {
    path: "/reference-kitchen-type",
    name: "reference-kitchen-type",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenType.vue"),
    meta: {
      title: "Типы кухни",
    },
  },

  {
    path: "/reference-kitchen-type-add",
    name: "reference-kitchen-type-add",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Добавить тип кухни",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-kitchen-type-detail/:id",
    name: "reference-kitchen-type-edit",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Редактировать тип кухни",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-kitchen-type-view/:id",
    name: "reference-kitchen-type-view",
    component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
    meta: {
      title: "Просмотр деталей тип кухни",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  //Suppliers

  {
    path: "/reference-suppliers",
    name: "reference-suppliers",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/Suppliers.vue"),
    meta: {
      title: "Поставщики",
    },
  },

  {
    path: "/reference-suppliers-add",
    name: "reference-suppliers-add",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Добавить нового поставщика",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-suppliers-detail/:id",
    name: "reference-suppliers-edit",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Редактирования поставщика",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-suppliers-view/:id",
    name: "reference-suppliers-view",
    component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
    meta: {
      title: "Просмотр деталей поставщика",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  //Organizations

  {
    path: "/reference-organization",
    name: "reference-organization",
    component: () => import("@/modules/Settings/components/Reference/Organizations/Organizations.vue"),
    meta: {
      title: "Организации",
    },
  },

  {
    path: "/reference-organization-add",
    name: "reference-organization-add",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Добавить новую организацию",
      breadcrumbItemTitle: "Добавить",
    },
  },

  {
    path: "/reference-organization-detail/:id",
    name: "reference-organization-edit",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Редактировать рациона",
      breadcrumbItemTitle: "Редактировать",
    },
  },

  {
    path: "/reference-organization-view/:id",
    name: "reference-organization-view",
    component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
    meta: {
      title: "Просмотр деталей организации",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Продукты start
  // Типы документов
  {
    path: "/reference-type-product",
    name: "reference-type-product",
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/TypeProduct.vue"),
    meta: {
      title: "Типы продуктов",
    },
  },
  {
    path: "/reference-type-product-create",
    name: "reference-type-product-create",
    component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
    meta: {
      title: "Добавить тип продукта",
      breadcrumbItemTitle: "Добавить",
    },
  },
  {
    path: "/reference-type-product-edit/:id",
    name: "reference-type-product-edit-id",
    component: () =>
      import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
    meta: {
      title: "Редактирования типа продукта",
      breadcrumbItemTitle: "Редактировать",
    },
  },
  {
    path: "/reference-type-product-view/:id",
    name: "reference-type-product-view-id",
    component: () =>
      import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
    meta: {
      title: "Просмотр деталей типа продукта",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Виды документов
  {
    path: "/reference-vid-product",
    name: "reference-vid-product",
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocument.vue"),
    meta: {
      title: "Виды продуктов",
    },
  },
  {
    path: "/reference-vid-add",
    name: "reference-vid-add",
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
    meta: {
      title: "Добавить вид продукта",
      breadcrumbItemTitle: "Добавить",
    },
  },
  {
    path: "/reference-view-edit/:id",
    name: "reference-vid-view-id",
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
    meta: {
      title: "Просмотр деталей вида продукта",
      breadcrumbItemTitle: "Просмотр",
    },
  },
  {
    path: "/reference-vid-edit/:id",
    name: "reference-vid-edit-id",
    component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
    meta: {
      title: "Редактировать вид продукта",
      breadcrumbItemTitle: "Редактировать",
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
    },
  },
  {
    path: "/reference-ration-create",
    name: "reference-ration-create",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
    meta: {
      title: "Добавить новый рацион",
      breadcrumbItemTitle: "Добавить",
    },
  },
  {
    path: "/reference-ration-edit/:id",
    name: "reference-ration-edit-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
    meta: {
      title: "Редактировать рациона",
      breadcrumbItemTitle: "Редактировать",
    },
  },
  {
    path: "/reference-ration-view/:id",
    name: "reference-ration-view-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
    meta: {
      title: "Просмотр деталей рациона",
      breadcrumbItemTitle: "Просмотр",
    },
  },

  // Блюда start
  {
    path: "/reference-dish",
    name: "reference-dish",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/Dish.vue"),
    meta: {
      title: "Блюда",
    },
  },
  {
    path: "/reference-dish-create",
    name: "reference-dish-create",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Добавить новое блюдо",
      breadcrumbItemTitle: "Добавить",
    },
  },
  {
    path: "/reference-dish-edit/:id",
    name: "reference-dish-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Редактировать блюда",
      breadcrumbItemTitle: "Редактировать",
    },
  },
  {
    path: "/reference-dish-view/:id",
    name: "reference-view-id",
    component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
    meta: {
      title: "Просмотр деталей блюда",
      breadcrumbItemTitle: "Просмотр",
    },
  },
  // Блюда end
  // Рационы и блюда end

  // Единицы измерения
  {
    path: "/reference-unit",
    name: "reference-unit",
    component: () => import("@/modules/Settings/components/Reference/Unit/Unit.vue"),
    meta: {
      title: "Единицы измерения",
    },
  },
  // Единицы измерения end
];
