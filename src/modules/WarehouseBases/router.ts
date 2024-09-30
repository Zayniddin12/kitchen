import {useDistrictStore} from "@/modules/WarehouseBases/store/district.store";

export default [
    {
        path: "/warehouse/:district_id(\\d+)/:product_id(\\d+)",
        name: "warehouse",
        component: () => import("@/modules/WarehouseBases/pages/Index.vue"),
        meta: {
            title: "Базы складов",
            breadcrumb: []
        },
        beforeEnter: (to, from, next) => {
            const districtStore = useDistrictStore();

            districtStore.getProduct(+to.params.district_id, +to.params.product_id);

            if(!districtStore.district || !districtStore.product) return next({name: 'notFound'});


            to.meta.breadcrumb = [
                {
                    label: "Базы складов"
                },
                {
                    label: districtStore.district.name
                },
                {
                    label: districtStore.product.name,
                    isActionable: true,
                }
            ]

            next();
        }
    }
]