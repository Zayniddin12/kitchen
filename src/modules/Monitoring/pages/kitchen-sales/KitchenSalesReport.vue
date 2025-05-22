<script
  lang="ts"
  setup
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/modules/Settings/store";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useSalesReportStore } from "@/modules/Monitoring/store/salesReport.store";
import useComp from "@/mixins";

const route = useRoute();

const { t } = useI18n();

const salesReportStore = useSalesReportStore();
const settingsStore = useSettingsStore();
const kitchenStore = useKitchenStore();

const kitchen_id = ref(null);
const selectedDate = ref(null);
const {num_format} = useComp();

const { setBreadCrumb } = useBreadcrumb();

const activeTab = ref<number | null>(null);

const managementsList = computed<{ id: number; name: string }[]>(
  () => settingsStore.regional.managements
);

const tabItems = computed(() => {
  return managementsList.value.map(item => ({
    value: item.id,
    label: item.name,
  }));
});

const TABS = computed(() => {
  return Object.fromEntries(
    managementsList.value.map(item => [item.name.toUpperCase(), item.id])
  );
});

const onKitchenChange = (value: any) => {
  kitchen_id.value = value;
};

onMounted(async () => {
  await settingsStore.GET_REGIONAL({ per_page: 100 });
  getActiveTab();
});

const getActiveTab = () => {
  const tab = Number(route.query?.tab);

  const isValidTab = !isNaN(tab) && Object.values(TABS.value).includes(tab);

  activeTab.value = isValidTab ? tab : null;
};

const attendanceTableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: "№",
      prop: "num",
      width: 150,
      sortable: false,
    },
    {
      label: t("common.regions"),
      prop: "region",
      sortable: true,
    },
    {
      label: t("users.visitors"),
      prop: "visitors",
      sortable: true,
    },
    {
      label: t("kitchen.lpp"),
      prop: "kitchens",
      sortable: true,
    },
    {
      label: t("monitoring.holySale"),
      prop: "holy_sale",
      sortable: true,
    },
    {
      label: t("monitoring.buffet"),
      prop: "buffet",
      sortable: true,
    },
    {
      label: t("monitoring.polyclinic"),
      prop: "polyclinic",
      sortable: true,
    },
    {
      label: t("monitoring.healthResort"),
      prop: "health_resort",
      sortable: true,
    },
    {
      label: t("monitoring.camp"),
      prop: "camp",
      sortable: true,
    },
  ];
});

const attendanceTableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 10; i++) {
    const data = {
      num: i + 1,
      region: "Зарафшан",
      visitors: Math.floor(Math.random() * 1001) + 1000,
      kitchens: Math.floor(Math.random() * 51) + 1000,
      holy_sale: Math.floor(Math.random() * 51) + 1000,
      buffet: Math.floor(Math.random() * 51) + 1000,
      polyclinic: Math.floor(Math.random() * 51) + 1000,
      health_resort: Math.floor(Math.random() * 51) + 1000,
      camp: 0,
    };

    dataList.push(data);
  }

  return dataList;
});

const mealTimeTable = ref({
  breakfast: t("mealTimeTable.breakfast"),
  first: t("mealTimeTable.first"),
  second: t("mealTimeTable.second"),
  salads: t("mealTimeTable.salads"),
  desserts: t("mealTimeTable.desserts"),
  supplements: t("mealTimeTable.supplements"),
  drinks: t("mealTimeTable.drinks"),
});

const dishesTableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: t("salesReport.name"),
      prop: "product_name",
      sortable: true,
    },
    {
      label: t("salesReport.prepared_portion"),
      prop: "prepared_amount",
      sortable: true,
    },
    {
      label: t("salesReport.amount"),
      prop: "sold_amount",
      sortable: true,
    },
    {
      label: t("salesReport.total_amount"),
      prop: "total_price",
      sortable: true,
    },
    {
      label: t("salesReport.number_leftovers"),
      prop: "left_amount",
      sortable: true,
    },
  ];
});

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "monitoring.title",
      isTranslate: true,
    },
    {
      label: "monitoring.kitchenReport",
      isTranslate: true,
      isActionable: true,
    },
  ]);
};

watch(
  () => route.query,
  () => {
    getActiveTab();
  },
  { immediate: true }
);

watch(kitchen_id, async newKitchenId => {
  if (newKitchenId) {
    salesReportStore.reportFilter.kitchen_id = newKitchenId;
  } else {
    delete salesReportStore.reportFilter.kitchen_id;
  }

  await salesReportStore.GET_SALES_REPORT();
});

watch(selectedDate, async newDate => {
  if (newDate) {
    salesReportStore.reportFilter.date = newDate;
  } else {
    delete salesReportStore.reportFilter.date;
  }
  await salesReportStore.GET_SALES_REPORT();
});

watch(
  () => activeTab.value,
  async newTab => {
    if (newTab) {
      salesReportStore.reportFilter.management_id = newTab;
    } else {
      delete salesReportStore.reportFilter.management_id;
    }

    await salesReportStore.GET_SALES_REPORT();
  },
  { immediate: true }
);

watchEffect(() => {
  setBreadCrumbFn();
  if (activeTab.value !== null) {
    kitchenStore.GET_KITCHEN_ALL({ management_id: activeTab.value });
  }
});
</script>
<template>
  <section class="kitchen-report">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        {{ t("monitoring.kitchenSalesReport") }}
      </h1>
      <div class="flex justify-between items-center gap-5 mt-6">
        <div class="app-tabs">
          <RouterLink
            v-for="item in tabItems"
            :key="item.value"
            :class="[
              'app-tab',
              { 'app-tab--active': activeTab === item.value },
            ]"
            :to="{ query: { ...route.query, ...{ tab: item.value } } }"
          >
            {{ item.label }}
          </RouterLink>
        </div>
        <div class="grid grid-cols-3 gap-2 max-w-[645px] items-center">
          <AppSelect
            size="large"
            v-model="kitchen_id"
            :prop="`id`"
            :items="kitchenStore.kitchenAll"
            item-value="id" 
            item-label="name"
            :label="t('kitchen.title')"
            :placeholder="t('salesReport.choose_kitchen')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            clearable
            @clear="onKitchenClear"
            @change="onKitchenChange"
          />

          <AppDatePicker
            size="large"
            v-model="selectedDate"
            :label="t('common.date')"
            label-class="text-[#A8AAAE] text-xs font-medium"
          />

          <ElDropdown
            placement="bottom"
            class="block w-full"
            style="margin-top: 5px"
          >
            <ElButton
              size="large"
              class="h-12 !bg-white-blue w-full !border-white-blue"
            >
              <div class="flex items-center gap-x-2">
                <img
                  src="@/assets/images/download.svg"
                  class="size-5"
                  alt="download img"
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
                    alt="pdf"
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
        </div>
      </div>
      <TransitionGroup
        name="nested"
        :duration="{ enter: 500, leave: 1500 }"
        tag="div"
        class="relative overflow-x-hidden"
      >
        <div class="inner">
          <div v-if="salesReportStore.salesReport?.sold_items?.length === 0">
            <p class="text-center text-gray-500 mt-5">
              {{ t("common.empty") }}
            </p>
          </div>
          <div
            v-else
            v-for="(solds, index) in salesReportStore.salesReport.sold_items"
            :key="index"
          >
            <h2
              class="font-semibold text-black text-2xl text-center mx-auto mt-5"
            >
              {{ solds.period_name }}
            </h2>

            <ElTable
              :data="solds.items"
              stripe
              class="custom-element-table mt-4"
              :empty-text="t('common.empty')"
            >
              <ElTableColumn
                prop="idx"
                label="№"
                width="80"
              >
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </ElTableColumn>

              <ElTableColumn
                v-for="column in dishesTableColumns"
                :key="column.prop"
                :width="column.width ?? ''"
                :sortable="!!column.sortable"
                :prop="column.prop"
              >
                <template #header>
                  <strong class="font-medium">
                    {{ column.label }}
                  </strong>
                </template>
                <template #default="{row}" v-if="column.prop==='total_price'">
                  {{ num_format(row.total_price, 2) }}
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>