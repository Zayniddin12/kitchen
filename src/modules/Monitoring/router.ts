import { useDistrictStore } from "@/modules/Monitoring/store/district.store";

export default [
  {
    path: "/monitoring",
    name: "monitoring",
    redirect: { name: "monitoring.remainingGoods" },
    meta: {
      title: "Мониторинг",
    },
    children: [
      {
        path: "remaining-goods",
        name: "monitoring.remainingGoods",
        redirect: { name: "monitoring.remainingGoods.index" },
        children: [
          {
            path: "",
            name: "monitoring.remainingGoods.index",
            component: () =>
              import(
                "@/modules/Monitoring/pages/remaining-goods/RemainingGoods.vue"
              ),
            meta: {
              breadcrumb: [
                {
                  label: "Мониторинг",
                },
                {
                  label: "Остатка товаров",
                  isActionable: true,
                },
              ],
            },
          },
          {
            path: "district/:id(\\d+)",
            name: "monitoring.remainingGoods.district",
            component: () =>
              import("@/modules/Monitoring/pages/remaining-goods/District.vue"),
            meta: {
              breadcrumb: [],
            },
            beforeEnter: (to, from, next) => {
              const districtStore = useDistrictStore();

              districtStore.getDistrict(+to.params.id);

              if (districtStore.district) {
                to.meta.breadcrumb = [
                  {
                    label: "Мониторинг",
                    to: { name: "monitoring.remainingGoods.index" },
                  },
                  {
                    label: "КП РУ Навои",
                  },
                  {
                    label: districtStore.district.name,
                    isActionable: true,
                  },
                ];
              }
              next();
            },
          },
        ],
      },
      {
        path: "kitchen-report",
        name: "monitoring.kitchenReport",
        component: () => import("@/modules/Monitoring/pages/KitchenReport.vue"),
        meta: {
          breadcrumb: [
            {
              label: "Мониторинг"
            },
            {
              label: "Отчет о кухне",
              isActionable: true
            }
          ]
        }
      },
    ],
  },
];
