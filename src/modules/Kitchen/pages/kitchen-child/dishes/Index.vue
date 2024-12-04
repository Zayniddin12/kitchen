<script
  setup
  lang="ts"
>

import { computed, watch, watchEffect } from "vue";
import DishesImg from "@/assets/images/kitchen/test/dishes.png";
import { useRoute } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();
const kitchenStore = useKitchenStore();
const { setBreadCrumb } = useBreadcrumb();

const categories = computed(() => [
  {
    id: 1,
    name: "Блюди",
    products: [
      {
        id: 1,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 2,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 3,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 4,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 5,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 6,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 7,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
      {
        id: 8,
        name: "Плов",
        price: 25000,
        cost_price: 3000,
        sum: 28000,
        photo: DishesImg,
      },
    ],
  },
]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      isActionable: false,
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
      isActionable: false,
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: "Блюди",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });

  await kitchenStore.GET_MEALS_LIST({ kitchen_id: route.params.child_id });

  setBreadCrumbFn();
}, { immediate: true });

</script>

<template>
  <section>
    <div>
      <div class="flex flex-col gap-y-6">
        {{kitchenStore.mealsList  }}
        <div
          v-for="category in categories"
          :key="category.id"
        >
          <h2 class="text-[32px] font-semibold text-dark">
            {{ category.name }}
          </h2>
          <ElTable
            :data="category.products"
            stripe
            class="custom-element-table custom-element-table-normal mt-6"
          >
            <ElTableColumn
              prop="idx"
              label="№"
              align="left"
            >
              <template #default="{$index}">
                {{ $index + 1 }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="name"
              label="Название"
              align="center"
              sortable
            >
              <template #default="{row}: {row: Record<string,any>}">
                <div class="flex items-center justify-center gap-x-3">
                  <img
                    :src="DishesImg"
                    :alt="row.name"
                    class="size-8 rounded-full object-contain"
                  />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="price"
              label="Цена"
              align="center"
              sortable
            />
            <ElTableColumn
              prop="cost_price"
              label="НДС"
              align="center"
              sortable
            />
            <ElTableColumn
              prop="sum"
              label="Сумма"
              align="center"
              sortable
            />
          </ElTable>
        </div>
      </div>
    </div>
  </section>
</template>