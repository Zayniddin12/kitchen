<script
  setup
  lang="ts"
>

import { watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";

const kitchenStore = useKitchenStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const { t } = useI18n();

const tableData = Array(4).fill({
  compound: "Рис",
  quantity: 50,
  unit_measurement: "грамм",
  price: 25000,
});

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
    },
    {
      label: kitchenStore.part.name,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: "Лагерь",
      to: { name: "KitchenShowIndex" },
    },
    {
      label: "Паҳлавон",
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: "kitchen.dishes2",
      to: { name: "KitchenDishesIndex" },
    },
    {
      label: "common.view",
      isTranslate: true,
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section>
    <div>
      <h1 class="text-[32px] font-semibold text-dark">
        Плов
      </h1>
      <div class="min-h-[67vh] max-w-[792px] rounded-3xl border border-[#E2E6F3] p-6 mt-6">
        <h6 class="text-dark font-medium text-lg">
          {{ t("kitchen.compoundRation") }}
        </h6>
        <ElTable
          :data="tableData"
          stripe
          :empty-text="t('common.empty')"
          class="custom-element-table-normal custom-element-table mt-4 custom-element-table--has-append"
        >
          <ElTableColumn
            :label="t('common.compound')"
            prop="compound"
          ></ElTableColumn>
          <ElTableColumn
            :label="t('common.quantity')"
            prop="quantity"
          ></ElTableColumn>
          <ElTableColumn
            :label="t('common.measurement')"
            prop="unit_measurement"
          ></ElTableColumn>
          <ElTableColumn
            :label="t('common.price')"
            prop="price"
            sortable
          ></ElTableColumn>
          <template #append>
            <div class="px-4 py-3.5 flex justify-end items-center gap-x-8">
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{t("common.price")}}:
                </span>
                <strong class="font-semibold text-dark">
                  25 000 {{t("currency.sum")}}
                </strong>
              </div>
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{t("common.ndc")}}:
                </span>
                <strong class="font-semibold text-dark">
                  3 000 {{t("currency.sum")}}
                </strong>
              </div>
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{ t("common.totalSum")}}:
                </span>
                <strong class="font-semibold text-dark">
                  28 000 {{t("currency.sum")}}
                </strong>
              </div>
            </div>
          </template>
        </ElTable>
      </div>
    </div>
  </section>
</template>