<script
  lang="ts"
  setup
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const { t } = useI18n();

enum TABS {
  ATTENDANCE = 1, DISHES
}

const defaultTab = TABS.ATTENDANCE;

const activeTab = ref<number | null>(null);

const tabItems = computed(() => {
  return [{
    value: TABS.ATTENDANCE,
    label: t("monitoring.attendance"),
  }, {
    value: TABS.DISHES,
    label: t("monitoring.dishes"),
  }];
});

const getActiveTab = () => {
  const tab = Number(route.query?.tab);

  const isValidTab = !isNaN(tab) && [TABS.ATTENDANCE, TABS.DISHES].includes(tab);

  activeTab.value = isValidTab ? tab : defaultTab;
};


const attendanceTableColumns = computed<TableColumnType[]>(() => {
  return [{
    label: "№",
    prop: "num",
    width: 80,
    sortable: false,
    fixed: true,
  }, {
    label: t("common.regions"),
    prop: "region",
    sortable: true,
    width: 200,
  }, {
    label: t("users.visitors"),
    prop: "visitors",
    sortable: true,
    width: 200,
  }, {
    label: t("kitchen.lpp"),
    prop: "kitchens",
    sortable: true,
    width: 200,
  }, {
    label: t("monitoring.holySale"),
    prop: "holy_sale",
    sortable: true,
    width: 200,
  }, {
    label: t("monitoring.buffet"),
    prop: "buffet",
    sortable: true,
    width: 200,
  }, {
    label: t("monitoring.polyclinic"),
    prop: "polyclinic",
    sortable: true,
    width: 200,
  }, {
    label: t("monitoring.healthResort"),
    prop: "health_resort",
    sortable: true,
    width: 200,
  }, {
    label: t("monitoring.camp"),
    prop: "camp",
    sortable: true,
    width: 200,
  }];
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

const dishesTableColumns = computed<TableColumnType[]>(() => {
  return [{
    label: "№",
    prop: "num",
    width: 150,
    sortable: false,
  }, {
    label: t("common.regions"),
    prop: "region",
    sortable: true,
  }, {
    label: t("kitchen.totalServings"),
    prop: "total_servings",
    sortable: true,
  }, {
    label: t("kitchen.lpp"),
    prop: "lpp_kitchens",
    sortable: true,
  }, {
    label: t("monitoring.holySale"),
    prop: "holy_sale",
    sortable: true,
  }, {
    label: t("monitoring.buffet"),
    prop: "buffet",
    sortable: true,
  }, {
    label: t("monitoring.polyclinic"),
    prop: "polyclinic",
    sortable: true,
  }, {
    label: t("monitoring.healthResort"),
    prop: "health_resort",
    sortable: true,
  }, {
    label: t("monitoring.camp"),
    prop: "camp",
    sortable: true,
  }];
});

const dishesTableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 10; i++) {
    const data = {
      num: i + 1,
      region: "Зарафшан",
      total_servings: Math.floor(Math.random() * 1001) + 1000,
      lpp_kitchens: Math.floor(Math.random() * 51) + 1000,
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

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "monitoring.title",
    isTranslate: true,
  }, {
    label: "monitoring.kitchenReport",
    isTranslate: true,
    isActionable: true,
  }]);
};

watch(() => route.query, () => {
  getActiveTab();
}, { immediate: true });

watchEffect(() => {
  setBreadCrumbFn();
});

</script>
<template>
  <section class="kitchen-report">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        {{ t("monitoring.kitchenReport") }}
      </h1>
      <div class="flex justify-between items-start gap-5 mt-6">
        <div class="app-tabs">
          <RouterLink
            v-for="item in tabItems"
            :key="item.value"
            :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
            :to="{query: {...route.query, ...{tab: item.value}}}"
          >
            {{ item.label }}
          </RouterLink>
        </div>
        <div class="grid grid-cols-4 gap-2 max-w-[645px]">
          <AppDatePicker
            size="large"
          />
          <AppDatePicker
            size="large"
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
          <ElButton
            size="large"
            class="h-12 !bg-white-blue !border-white-blue"
          >
            <div class="flex items-center gap-x-2">
              <img
                src="@/assets/images/icons/share.svg"
                class="size-5"
              />
              <span class="font-medium text-dark-gray">
                {{ t("method.share") }}
              </span>
            </div>
          </ElButton>
        </div>
      </div>
      <TransitionGroup
        name="nested"
        :duration="{ enter: 500, leave: 1500 }"
        tag="div"
        class="relative overflow-x-hidden"
      >
        <div
          class="inner"
          v-if="activeTab === TABS.ATTENDANCE"
        >
          <ElTable
            :data="attendanceTableData"
            class="custom-element-table"
            stripe
            :empty-text="t('common.empty')"
          >
            <ElTableColumn
              v-for="column in attendanceTableColumns"
              :key="column.prop"
              :width="column?.width ?? ''"
              :sortable="!!column.sortable"
              :prop="column.prop"
              :fixed="column.fixed"
            >
              <template #header>
                <strong class="font-medium">
                  {{ column.label }}
                </strong>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <div
          class="inner"
          v-else-if="activeTab === TABS.DISHES"
        >
          <div>
            <h2 class="font-semibold text-black text-2xl">
              {{ t("monitoring.prepared") }}
            </h2>
            <ElTable
              :data="dishesTableData"
              stripe
              class="custom-element-table mt-4"
              :empty-text="t('common.empty')"
            >
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
              </ElTableColumn>
            </ElTable>
          </div>
          <div class="mt-6">
            <h2 class="font-semibold text-black text-2xl">
              {{ t("monitoring.distributed") }}
            </h2>
            <ElTable
              stripe
              :data="dishesTableData"
              class="custom-element-table mt-4"
              :empty-text="t('common.empty')"
            >
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
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>