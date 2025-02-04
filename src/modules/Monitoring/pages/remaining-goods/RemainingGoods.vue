<script
  setup
  lang="ts"
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, watchEffect, onMounted, ref, watch } from "vue";

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import { useDistrictStore } from "@/modules/Monitoring/store/district.store";

const store = useDistrictStore();
const { setBreadCrumb } = useBreadcrumb();
const { t } = useI18n();

const params = ref({
  start_data: null,
  end_data: null,
});
const tableColumns = computed<TableColumnType[]>(() => {
  return [{
    label: "№",
    prop: "num",
  }, {
    label: t("product.name"),
    prop: "product_name",
  }, {
    label: t("common.measurement"),
    prop: "measurement",
  }, {
    label: "КП РУ Зарафшон",
    prop: "kp_zarafshon",
    link: {
      name: "monitoring.remainingGoods.district",
      params: { id: 1 },
    },
  }, {
    label: "КП РУ Навои",
    prop: "kp_navoi",
    link: {
      name: "monitoring.remainingGoods.district",
      params: { id: 2 },
    },
  }, {
    label: "КП РУ Нуробод",
    prop: "kp_nurobod",
    link: {
      name: "monitoring.remainingGoods.district",
      params: { id: 3 },
    },
  }, {
    label: "КП РУ Учкудук",
    prop: "kp_uchkuduk",
    link: {
      name: "monitoring.remainingGoods.district",
      params: { id: 4 },
    },
  }, {
    label: "КП РУ Зафаробод",
    prop: "kp_zafarobod",
    link: {
      name: "monitoring.remainingGoods.district",
      params: { id: 5 },
    },
  }, {
    label: "по Фонду НГМК",
    prop: "fund",
  }];
});

onMounted(async () => {

  try {
    await store.GET_REMAINING_GOODS_LIST(params);
  } catch (e) {

  }
});


const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "monitoring.title",
    isTranslate: true,
  }, {
    label: "monitoring.remainingGoods",
    isTranslate: true,
    isActionable: true,
  }]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

watch(() => params.value.start_data, async (newValue, oldValue) => {
  if (newValue) {
    await store.GET_REMAINING_GOODS_LIST(params);
  }
});

watch(() => params.value.end_data, async (newValue, oldValue) => {
  if (newValue && params.value.start_data) {
    await store.GET_REMAINING_GOODS_LIST(params);
  }
});

</script>

<template>
  <section class="remaining-goods">
    <div>
      <div class="flex justify-between items-start gap-5">
        <h1 class="font-semibold text-[32px] text-dark">
          {{ t("monitoring.remainingGoods") }}
        </h1>
        <div class="grid grid-cols-4 gap-2 max-w-[645px]">
          <AppDatePicker
            v-model="params.start_date"
            size="large"
            :placeholder="$t('common.date_from')"
          />
          <AppDatePicker
            v-model="params.end_date"
            size="large"
            :placeholder="$t('common.date_to')"
          />
          <ElDropdown
            placement="bottom"
            class="block w-full"
          >
            <ElButton
              size="large"
              class="h-12 !bg-white-blue w-full !border-white-blue"
            >
              <div class="flex items-center gap-x-2">
                <img
                  src="@/assets/images/download.svg"
                  alt="download"
                  class="size-5"
                />
                <span class="font-medium text-dark-gray">
                  {{ t("method.download") }}
                </span>
              </div>
            </ElButton>
            <template #dropdown>
              <ElDropdownMenu class="p-3 rounded-lg">
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/pdf.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    {{ t("common.file", { format: "PDF" }) }}
                  </span>
                </ElDropdownItem>
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/excel.svg"
                    alt="excel"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    {{ t("common.file", { format: "Excel" }) }}
                  </span>
                </ElDropdownItem>
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/1c.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    {{ t("common.file", { format: "1C" }) }}
                  </span>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
          <ElButton
            size="large"
            class="h-12 !bg-white-blue !border-white-blue"
          >
            <div class="flex items-center gap-x-2">
              <img
                src="@/assets/images/icons/share.svg"
                class="size-5"
                alt="share"
              />
              <span class="font-medium text-dark-gray">
              {{ t("method.share") }}
              </span>
            </div>
          </ElButton>
        </div>
      </div>
      <!--      {{ store.remaining_goods_list }}-->
      <ElTable
        stripe
        :data="store.remaining_goods_list.products"
        :empty-text="t('common.empty')"
        class="custom-element-table"
      >
        <ElTableColumn
          v-for="column in tableColumns"
          type="button"
          :key="column.prop"
          :prop="column.prop"
        >
          <template #header>
            <RouterLink
              v-if="!!column?.link"
              :to="column.link"
            >
              {{ column.label }}
            </RouterLink>
            <template v-else>
              {{ column.label }}
            </template>
          </template>
        </ElTableColumn>
      </ElTable>
      <AppPagination class="mt-6" />
    </div>
  </section>
</template>
