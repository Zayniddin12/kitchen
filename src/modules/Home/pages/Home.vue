<script
  setup
  lang="ts"
>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
  GridComponent,
} from "echarts/components";
import { computed, onMounted, reactive, ref, watch } from "vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AnalyticsCard from "@/modules/Home/components/charts/analytics-card/AnalyticsCard.vue";
import WarehouseIcon from "@/assets/images/icons/warehouse.svg";
import UsersIcon from "@/assets/users.svg";
import KitchenIcon from "@/assets/images/icons/kitchen.svg";
import BranchIcon from "@/assets/images/icons/branch.svg";
import { useStatisticsStore } from "@/modules/Home/statistics.store";
import { AnalyticsCardDataType } from "@/modules/Home/components/charts/analytics-card/analytics-card.types";
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import {
  GraphProductsParamsType,
  KitchenPreparationParamsType,
  ProductType,
  WarehouseCapacityParamsType,
} from "@/modules/Home/statistics.types";
import { filterObjectValues } from "@/utils/helper";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import GraphChart from "@/modules/Home/components/charts/graph-chart/GraphChart.vue";
import PreparationsChart from "@/modules/Home/components/charts/preparations-chart/PreparationsChart.vue";
import { useI18n } from "vue-i18n";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
  GridComponent,
]);

const { t } = useI18n();

const route = useRoute();

const statisticsStore = useStatisticsStore();
const settingsStore = useSettingsStore();

const form = reactive<WarehouseCapacityParamsType>({
  management_id: null,
});

const warehouseCapacityData = computed<AnalyticsCardDataType[]>(() => {
  return [
    {
      name: t("common.totalCapacity"),
      value: statisticsStore.warehouseCapacity?.total_capacity || 0,
    },
    {
      name: t("common.occupiedSpace"),
      value: statisticsStore.warehouseCapacity?.total_exist || 0,
    },
  ];
});

const visitorsData = computed<AnalyticsCardDataType[]>(() => {
  return [
    {
      name: t("common.yourOwnExpense"),
      value: statisticsStore.visitors?.paid || 0,
    },
    {
      name: t("common.withDiet"),
      value: statisticsStore.visitors?.free || 0,
    },
  ];
});

const kitchenData = computed<AnalyticsCardDataType[]>(() => {
  return statisticsStore.kitchenCount.map(el => {
    const newEl: AnalyticsCardDataType = {
      name: el.kitchen_type_name,
      value: el.count,
    };

    return newEl;
  });
});

const warehouseData = computed<AnalyticsCardDataType[]>(() => {
  return statisticsStore.warehouseCount.map(el => {
    const newEl: AnalyticsCardDataType = {
      name: el.kitchen_type_name,
      value: el.count,
    };

    return newEl;
  });
});

const handleClass = ({ row }: { row: ProductType }) => {
  return !row.quantity ? "!bg-[#FBDDDD]" : undefined;
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "navigation.home",
      isTranslate: true,
      isActionable: true,
    },
  ]);
};

const kitchenPreparationsForm = reactive<KitchenPreparationParamsType>({
  management_id: null,
  type_id: "",
  from_date: "",
  to_date: "",
});

const kitchenPreparationsValidationErrors = ref<Record<string, any> | null>(null);

const fetchKitchenPreparations = async () => {
  kitchenPreparationsForm.management_id = form.management_id;
  try {
    await statisticsStore.fetchKitchenPreparations(filterObjectValues(kitchenPreparationsForm));
    kitchenPreparationsValidationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      kitchenPreparationsValidationErrors.value = error.meta.validation_errors;
    }
  }
};

const incomingGraphForm = reactive<GraphProductsParamsType>({
  management_id: null,
  type_id: "",
  from_date: "",
  to_date: "",
});

const incomingGraphValidationErrors = ref<Record<string, any> | null>(null);

const fetchIncomingGraphProducts = async () => {
  incomingGraphForm.management_id = form.management_id;

  try {
    await statisticsStore.fetchIncomingGraphProducts(filterObjectValues(incomingGraphForm));
    incomingGraphValidationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      incomingGraphValidationErrors.value = error.meta.validation_errors;
    }
  }
};

const outgoingGraphForm = reactive<GraphProductsParamsType>({
  management_id: null,
  type_id: "",
  from_date: "",
  to_date: "",
});

const outgoingGraphValidationErrors = ref<Record<string, any> | null>(null);

const fetchOutgoingGraphProducts = async () => {
  outgoingGraphForm.management_id = form.management_id;

  try {
    await statisticsStore.fetchOutgoingGraphProducts(filterObjectValues(outgoingGraphForm));
    outgoingGraphValidationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      outgoingGraphValidationErrors.value = error.meta.validation_errors;
    }
  }
};

watch(() => route.query.management_id, (newId) => {
  const management_id = newId ? parseInt(newId as string) : null;
  form.management_id = management_id && !isNaN(management_id) ? management_id : null;

  const newForm = filterObjectValues(form);

  statisticsStore.fetchWarehouseCapacity(newForm);
  statisticsStore.fetchVisitors(newForm);
  statisticsStore.fetchProducts(newForm);
  statisticsStore.fetchKitchenCount(newForm);
  statisticsStore.fetchWarehouseCount(newForm);
  fetchKitchenPreparations();
  fetchIncomingGraphProducts();
  fetchOutgoingGraphProducts();
  settingsStore.fetchKitchenTypesList();
  settingsStore.fetchKitchenWarehouseList();

}, { immediate: true });

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_REGIONAL({ per_page: 100 });

  const data = {
    "05.11.2024": [{
      "period": 1,
      "start_time": null,
      "end_time": null,
      "amount": null,
      "product_type": "ration",
      "product_id": null,
      "rationsList": [],
    }],
  };
});


const receipt = ref(null);
const items = ref([
  { name: "Apples", price: 3.5 },
  { name: "Bananas", price: 2.0 },
  { name: "Bread", price: 2.5 },
  { name: "Milk", price: 1.5 },
  { name: "Eggs", price: 3.0 },
]);

const totalPrice = computed(() =>
  items.value.reduce((total, item) => total + item.price, 0),
);

</script>

<template>
    <div>
      <h1 class="m-0 font-semibold text-[32px] mb-[24px]">
        Главная
      </h1>
      <div
        v-if="settingsStore.regional.managements.length"
        class="app-tabs !text-sm mb-6"
      >
        <RouterLink
          :to="{name: route.name}"
          :class="[
                'app-tab',
                { 'app-tab--active': !form.management_id },
              ]"
        >
          {{ t("common.all") }}
        </RouterLink>
        <RouterLink
          v-for="item in settingsStore.regional.managements"
          :key="item.id"
          :to="{ query: { ...route.query, ...{ management_id: item.id } } }"
          :class="[
                'app-tab',
                { 'app-tab--active': form.management_id === item.id },
              ]"
        >
          {{ item.name }}
        </RouterLink>
      </div>

      <div class="flex items-start gap-4 mb-[40px]">
        <div class="w-[55%]">
          <div class="grid grid-cols-2 gap-x-4 mb-10">
            <AnalyticsCard
              :icon="WarehouseIcon"
              :title="t('home.warehouseOccupancy')"
              :subtitle="t('home.textWillGoHere')"
              :data="warehouseCapacityData"
              :loading="statisticsStore.warehouseCapacityLoading"
            />
            <AnalyticsCard
              :title="t('home.visitorsNumber')"
              :icon="UsersIcon"
              :subtitle="t('home.textWillGoHere')"
              :data="visitorsData"
              :loading="statisticsStore.visitorsLoading"
            />
          </div>
          <PreparationsChart
            :title="t('home.preparation')"
            :total_price="statisticsStore.kitchenPreparations?.total_price"
            :percent="5"
            :data="statisticsStore.kitchenPreparations?.kitchens ?? []"
            :loading="statisticsStore.kitchenPreparationsLoading"
          >
            <template #form>
              <AppForm
                :value="kitchenPreparationsForm"
                :validation-errors="kitchenPreparationsValidationErrors"
                class="grid grid-cols-3 gap-x-2"
              >
                <AppSelect
                  v-model="kitchenPreparationsForm.type_id"
                  prop="type_id"
                  size="large"
                  :placeholder="t('home.allType')"
                  :items="settingsStore.kitchenWarehouseList"
                  item-label="name"
                  item-value="id"
                  @change="fetchKitchenPreparations"
                />
                <AppDatePicker
                  v-model="kitchenPreparationsForm.from_date"
                  prop="from_date"
                  size="large"
                  @change="fetchKitchenPreparations"
                />
                <AppDatePicker
                  v-model="kitchenPreparationsForm.to_date"
                  prop="to_date"
                  size="large"
                  @change="fetchKitchenPreparations"
                />
              </AppForm>
            </template>
          </PreparationsChart>
        </div>
        <div class="w-[45%]">
          <div class="p-6 bg-[#F8F9FC] rounded-t-[24px]">
            <h6 class="text-dark text-lg font-semibold ">{{ t("home.lowStockProducts") }}</h6>
          </div>

          <ElTable
            v-loading="statisticsStore.productsLoading"
            :data="statisticsStore.products"
            :row-class-name="handleClass"
            :empty-text="t('common.empty')"
          >
            <ElTableColumn
              prop="idx"
              label="№"
              width="80"
            >
              <template #default="{$index}">
                {{ $index + 1 }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product_parent_name"
              :label="t('product.type')"
            >
              <template #default="{row}:{row:ProductType}">
                <div
                  v-if="row.product_image || row.product_parent_name"
                  class="flex items-center gap-x-3"
                >
                  <el-avatar
                    v-if="row.product_image"
                    :size="32"
                    :src="row.product_image"
                  />
                  <span>{{ row.product_parent_name }}</span>
                </div>
                <template v-else>-</template>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product_name"
              :label="t('product.view')"
            >
              <template #default="{row}:{row: ProductType}">
                {{ row.product_name || "-" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="quantity"
              :label="t('common.quantity')"
            >
              <template #default="{row}:{row: ProductType}">
                {{ row.quantity || "-" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="base_name"
              :label="t('common.base')"
            >
              <template #default="{row}:{row: ProductType}">
                {{ row.base_name || "-" }}
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <GraphChart
        :title="t('product.by_warehouses')"
        :subtitle="t('home.textWillGoHere')"
        class="mb-10"
        :loading="statisticsStore.incomingGraphProductsLoading"
        :data="statisticsStore.incomingGraphProducts"
      >
        <template #form>
          <AppForm
            :value="incomingGraphForm"
            :validation-errors="incomingGraphValidationErrors"
            class="grid grid-cols-3 gap-x-4"
          >
            <AppSelect
              v-model="incomingGraphForm.type_id"
              prop="type_id"
              size="large"
              :placeholder="t('home.allType')"
              :items="settingsStore.kitchenTypesList"
              item-value="id"
              item-label="name"
              @change="fetchIncomingGraphProducts"
            />
            <AppDatePicker
              v-model="incomingGraphForm.from_date"
              prop="from_date"
              size="large"
              @change="fetchIncomingGraphProducts"
            />
            <AppDatePicker
              v-model="incomingGraphForm.to_date"
              prop="to_date"
              size="large"
              @change="fetchIncomingGraphProducts"
            />
          </AppForm>
        </template>
      </GraphChart>
      <GraphChart
        :title="t('home.leftoversFromDishes')"
        :subtitle="t('home.textWillGoHere')"
        class="mb-10"
        :loading="statisticsStore.outgoingGraphProductsLoading"
        :data="statisticsStore.outgoingGraphProducts"
      >
        <template #form>
          <AppForm
            :value="outgoingGraphForm"
            :validation-errors="outgoingGraphValidationErrors"
            class="grid grid-cols-3 gap-x-4"
          >
            <AppSelect
              v-model="outgoingGraphForm.type_id"
              prop="type_id"
              size="large"
              clearable
              :placeholder="t('kitchen.all')"
              :items="settingsStore.kitchenTypesList"
              item-value="id"
              item-label="name"
              @change="fetchOutgoingGraphProducts"
            />
            <AppDatePicker
              v-model="outgoingGraphForm.from_date"
              prop="from_date"
              size="large"
              @change="fetchOutgoingGraphProducts"
            />
            <AppDatePicker
              v-model="outgoingGraphForm.to_date"
              prop="to_date"
              size="large"
              @change="fetchOutgoingGraphProducts"
            />
          </AppForm>
        </template>
      </GraphChart>

      <div class="grid grid-cols-2 gap-x-4">
        <AnalyticsCard
          :title="t('home.numberOfKitchens')"
          :icon="KitchenIcon"
          :subtitle="t('home.textWillGoHere')"
          :data="kitchenData"
          :loading="statisticsStore.kitchenCountLoading"
        />
        <AnalyticsCard
          :title="t('home.numberOfWarehouses')"
          :icon="BranchIcon"
          :subtitle="t('home.textWillGoHere')"
          :data="warehouseData"
          :loading="statisticsStore.warehouseCountLoading"
        />
      </div>
    </div>
</template>

