export default [
  {
    path: "/kitchen-warehouse/:title/:id",
    name: "kitchen-warehouse-title-id",
    component: () => import("@/modules/KitchenWarehouse/views/index.vue"),
    meta: {
      isBread: true,
      title: "Склад кухни",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Склад кухни",
          isActionable: false,
        },
        {
          label: '',
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/kitchen-warehouse/:title/:id/:id3",
    name: "kitchen-warehouse-title-id-id3",
    component: () => import("@/modules/KitchenWarehouse/pages/kitchen.vue"),
    meta: {
      isBread: true,
      title: "Склад кухни",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Склад кухни",
          isActionable: false,
        },
        {
          label: '',
          isActionable: false,
          to: 'kitchen-warehouse-title-id'
        },
        {
          label: '',
          isActionable: true,
        },
      ],
    },
  },
  {
    path: "/kitchen-warehouse/:title/:id/:id3/:kithchen",
    name: "kitchen-warehouse-title-id-id3-kithchen",
    component: () => import("@/modules/KitchenWarehouse/pages/kitchenDetail.vue"),
    meta: {
      isBread: true,
      title: "",
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Склад кухни",
          isActionable: false,
        },
        {
          label: '',
          isActionable: false,
          to: 'kitchen-warehouse-title-id'
        },
        {
          label: '',
          isActionable: false,
          to: 'kitchen-warehouse-title-id-id3'
        },
        {
          label: '',
          isActionable: true,
        },
      ],
    },
  },
];
