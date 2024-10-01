import { useRoute } from "vue-router";

const route = useRoute()

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
          isActionable: false,
        },
      ],
    },
  },
  {
    path: "/kitchen-warehouse/:title/:id/:id3",
    name: "kitchen-warehouse-title-id-id3",
    component: () => import("@/modules/KitchenWarehouse/views/index2.vue"),
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
        },
        {
          label: '',
          isActionable: false,
        },
      ],
    },
  },
];
