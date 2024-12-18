<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute, useRouter } from "vue-router";
import { computed, watchEffect } from "vue";
import { TableColumnType } from "@/types/common.type";
import { useI18n } from "vue-i18n";

const kitchenStore = useKitchenStore();
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const tableColumns = computed<TableColumnType[]>(() => [
  {
    label: t("common.compound"),
    prop: "composition",
  },
  {
    label: t("common.quantity"),
    prop: "quantity",
  },
  {
    label: t("common.measurement"),
    prop: "unit_measurement",
  },
  {
    label: t("common.price"),
    prop: "price",
    sortable: true,
  },
]);

const tableData = Array.from({ length: 4 }, () => ({
  composition: "Рис",
  quantity: Math.floor(Math.random() * 11) + 90,
  unit_measurement: "грамм",
  price: `25 000 ${t("currency.sum")}`,
}));

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = async () => {
  await kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part || route.params.part_name !== "sales") return router.replace({ name: "notFound" });

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
      label: "common.menu",
      isTranslate: true,
      to: { name: "KitchenMenuIndex", params: { part_name: "sales" }, query: { tab: 2 } },
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
      <h1 class="font-semibold text-dark text-[32px] leading-9">
        Плов
      </h1>
      <div class="mt-6 rounded-3xl border border-[#E2E6F3] p-6 w-3/4 min-h-[70vh]">
        <h6 class="text-dark font-medium text-lg">
          {{ t("kitchen.compoundRation") }}
        </h6>
        <ElTable
          :data="tableData"
          stripe
          :empty-text="t('common.empty')"
          class="mt-4 custom-element-table custom-element-table--has-append"
        >
          <ElTableColumn
            v-for="column in tableColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :sortable="!!column.sortable"
          />
          <template #append>
            <div class="px-4 py-3.5 flex justify-end items-center gap-x-8">
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{ t("common.price") }}:
                </span>
                <strong class="font-semibold text-dark">
                  162 000 {{ t("currency.sum") }}
                </strong>
              </div>
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{ t("common.ndc") }}:
                </span>
                <strong class="font-semibold text-dark">
                  19 440 {{ t("currency.sum") }}
                </strong>
              </div>
              <div class="flex items-center gap-x-1 text-sm">
                <span class="text-cool-gray">
                  {{ t("common.totalSum")}}:
                </span>
                <strong class="font-semibold text-dark">
                  181 440 {{ t("currency.sum") }}
                </strong>
              </div>
            </div>
          </template>
        </ElTable>
      </div>
    </div>
  </section>
</template>