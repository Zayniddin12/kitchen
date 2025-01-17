<script
  setup
  lang="ts"
>

import { computed, ref, watch, watchEffect } from "vue";
import DishesImg from "@/assets/images/kitchen/test/dishes.png";
import { useRoute } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const kitchenStore = useKitchenStore();
const { setBreadCrumb } = useBreadcrumb();

const mealsData = ref([]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
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
      label: "kitchen.dishes2",
      isTranslate: true,
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

  const response = await kitchenStore.GET_MEALS_LIST({ kitchen_id: route.params.child_id });

  console.log(response);

  mealsData.value = response.meals ? response.meals : [];
  setBreadCrumbFn();
}, { immediate: true });

</script>

<template>
  <section>
    <div>
      <div class="flex flex-col gap-y-6">
        <div>
          <h2 class="text-[32px] font-semibold text-dark">
            {{ t("kitchen.dishes2") }}
          </h2>
          <ElTable
            :data="mealsData"
            stripe
            :empty-text="t('common.empty')"
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
              :label="t('common.name')"
              align="center"
              sortable
            >
              <template #default="{row}: {row: Record<string,any>}">
                <div class="flex items-center justify-center gap-x-3">
                  <img
                    :src="row.image ? row.image : ''"
                    :alt="row.name"
                    class="size-8 rounded-full object-contain"
                  />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="price"
              :label="t('common.price')"
              align="center"
              sortable
            />
            <ElTableColumn
              prop="cost_price"
              :label="t('common.ndc')"
              align="center"
              sortable
            />
            <ElTableColumn
              prop="sum"
              :label="t('common.sum')"
              align="center"
              sortable
            />
          </ElTable>
        </div>
      </div>
    </div>
  </section>
</template>