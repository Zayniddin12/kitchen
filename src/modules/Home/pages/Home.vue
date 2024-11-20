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
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { tableData } from "@/modules/Home/constants";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AnalyticsCard from "@/modules/Home/components/analytics-card/AnalyticsCard.vue";
import WarehouseIcon from "@/assets/images/icons/warehouse.svg";
import UsersIcon from "@/assets/users.svg";
import KitchenIcon from "@/assets/images/icons/kitchen.svg";
import BranchIcon from "@/assets/images/icons/branch.svg";
import { useStatisticsStore } from "@/modules/Home/statistics.store";
import { AnalyticsCardDataType } from "@/modules/Home/components/analytics-card/analytics-card.types";
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { ProductType, WarehouseCapacityParamsType } from "@/modules/Home/statistics.types";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
  GridComponent
]);

const route = useRoute();

const statisticsStore = useStatisticsStore();
const settingsStore = useSettingsStore();

const form = reactive<WarehouseCapacityParamsType>({
  management_id: null
});

const warehouseCapacityData = computed<AnalyticsCardDataType[]>(() => {
  return [
    {
      name: "Общая вместимость",
      value: statisticsStore.warehouseCapacity?.total_capacity || 0
    },
    {
      name: "Занятое место",
      value: statisticsStore.warehouseCapacity?.total_exist || 0
    }
  ];
});

const visitorsData = computed<AnalyticsCardDataType[]>(() => {
  return [
    {
      name: "за свой счет",
      value: statisticsStore.visitors?.paid || 0
    },
    {
      name: "с рационом",
      value: statisticsStore.visitors?.free || 0
    }
  ];
});

const data = [
  { value: 1200, name: "Общая вместимость" },
  { value: 4600, name: "Занятое место" }
];

const data2 = [
  { value: 2200, name: "за свой счет" },
  { value: 3660, name: "с рационом" }
];

const option3 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: "category",
    data: ["Кухни ЛПП", "Кухня", "Буфет", "Больница", "Профилакторий", "Лагерь"]

  },
  series: [
    {
      name: "Expenses",
      type: "bar",
      data: [356800000, 86480500, 286800000, 500000000, 125800000, 865800000],
      itemStyle: {
        color: function (params: any) {
          // Define colors for each bar
          const colors = ["#36BFFA", "#53D28C", "#EE7677", "#FFB269", "#F670C7", "#9B8AFB"];

          return colors[params.dataIndex];
        },
        borderRadius: [0, 20, 20, 0]
      }

    }
  ]
};

const optionLine = {
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["12", "15", "17", "19", "21", "23", "25", "27", "29", "31", "2", "4", "6", "8", "10", "12"]
  },
  legend: {
    data: ["Мясной склад", "Овощной склад", "Рисовый склад"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "Мясной склад",
      data: [120, 132, 101, 134, 90, 230, 210, 180, 200, 250, 300, 280, 320, 240, 500],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#4682B4",
        width: 3
      }
    },
    {
      name: "Овощной склад",
      data: [220, 182, 191, 234, 290, 330, 310, 210, 150, 220, 270, 310, 120, 54, 350],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#FF6347",
        width: 3
      }
    },
    {
      name: "Рисовый склад",
      data: [150, 232, 201, 154, 190, 330, 410, 140, 120, 130, 140, 160, 150, 230, 300],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#FFD700",
        width: 3
      }
    }
  ],
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  }
};

const handleClass = ({ row }:{row:ProductType}) => {
  return !row.quantity ? "!bg-[#FBDDDD]" : undefined;
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Главная",
      isActionable: true
    }
  ]);
};

watch(() => route.query.management_id, (newId) => {
  const management_id = newId ? parseInt(newId as string) : null;
  form.management_id = management_id && !isNaN(management_id) ? management_id : null;

  statisticsStore.fetchWarehouseCapacity(form);
  statisticsStore.fetchVisitors(form);
  statisticsStore.fetchProducts(form);

}, { immediate: true });

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_REGIONAL({ per_page: 100 });
});

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
        Все
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
              title="Занятость складов"
              subtitle="Здесь будет текст"
              :data="warehouseCapacityData"
              :loading="statisticsStore.warehouseCapacityLoading"
          />
          <AnalyticsCard
              title="Количество посетителей"
              :icon="UsersIcon"
              subtitle="Здесь будет текст"
              :data="visitorsData"
              :loading="statisticsStore.visitorsLoading"
          />
        </div>
        <div>
          <div class="bg-[#F8F9FC] rounded-[24px] p-[16px]">
            <div class="flex items-center justify-between">
              <h2 class="text-[#000D24] !text-[24px] font-semibold">Приготовление</h2>

              <div class="flex items-center gap-2">
                <AppDatePicker
                    format="DD.MM.YYYY"
                    size="large"
                    class="w-[142px]"
                />
                <AppDatePicker
                    class="w-[142px]"
                    format="DD.MM.YYYY"
                    size="large"
                />
              </div>
            </div>

            <div>
              <span class="text-[#A8AAAE] text-[14px] mb-[4px]">Общая сумма</span>
              <div class="flex items-center">
                <span class="text-[32px] font-semibold">2 221 680 500 UZS</span>
                <span class="flex items-center text-[#28C76F] text-[18px] font-medium">
                  <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M16.0002 6.66699V25.3337"
                        stroke="#28C76F"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M24 14.667L16 6.66699"
                        stroke="#28C76F"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M8 14.667L16 6.66699"
                        stroke="#28C76F"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    </svg>
                    5%
                </span>
              </div>
            </div>

            <v-chart
                class="chart-horizon"
                :option="option3"
                autoresize
            />

          </div>
        </div>

      </div>
      <div class="w-[45%]">
        <div class="p-[24px] bg-[#F8F9FC] rounded-t-[24px]">
          <span class="text-[#000D24] text-[18px] font-semibold ">Продукты с низким запасом</span>
        </div>

        <ElTable
            v-loading="statisticsStore.productsLoading"
            :data="statisticsStore.products"
            :row-class-name="handleClass"
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
              label="Тип продукта"
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
              label="Вид продукта"
          >
            <template #default="{row}:{row: ProductType}">
              {{row.product_name || "-"}}
            </template>
          </ElTableColumn>
          <ElTableColumn
              prop="quantity"
              label="Количество"
          >
            <template #default="{row}:{row: ProductType}">
              {{row.quantity || "-"}}
            </template>
          </ElTableColumn>
          <ElTableColumn
              prop="base_name"
              label="Количество"
          >
            <template #default="{row}:{row: ProductType}">
              {{row.base_name || "-"}}
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </div>

    <div
        class="p-[24px] bg-[#F8F9FC] rounded-[24px] mb-[40px]"
        v-for="item in 2"
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="block text-[24px] text-[#000D24] font-semibold">Приход продуктов</span>
          <span class="text-black-sub block text-[14px]">Здесь будет текст</span>
        </div>

        <div class="flex items-center gap-2">
          <AppSelect
              size="large"
              class="w-[142px]"
          />
          <AppDatePicker
              format="DD.MM.YYYY"
              size="large"
              class="w-[142px]"
          />
          <AppDatePicker
              class="w-[142px]"
              format="DD.MM.YYYY"
              size="large"
          />
        </div>
      </div>

      <v-chart
          class="line-chart"
          :option="optionLine"
          autoresize
      />
    </div>

    <div class="grid grid-cols-2 gap-x-4">
      <AnalyticsCard
          title="Количество кухонь"
          :icon="KitchenIcon"
          subtitle="Здесь будет текст"
          :data
      />
      <AnalyticsCard
          title="Количество складов"
          :icon="BranchIcon"
          subtitle="Здесь будет текст"
          :data="data2"
      />
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>
.chart {
  height: 314px;
}

.chart-horizon {
  height: 340px;
}

.line-chart {
  height: 381px;
}
</style>

