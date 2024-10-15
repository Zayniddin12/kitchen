<script setup lang="ts">
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
import VChart from "vue-echarts";
import { ref, watchEffect } from "vue";
import { tableData } from "@/modules/Home/constants";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

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

const data = [
  { value: 1200, name: "Общая вместимость" },
  { value: 4600, name: "Занятое место" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

const data2 = [
  { value: 2200, name: "за свой счет" },
  { value: 3660, name: "с рационом" },
];

const total2 = data2.reduce((sum, item) => sum + item.value, 0);

const option = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "0%",
    left: "center",
    itemGap: 50,
    icon: "circle",
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["40%", "70%"],
      center: ["50%", "40%"],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: true,
        position: "inner",
        formatter: "{c}",
        fontSize: 15,
        fontWeight: "bold",
      },
      labelLine: {
        show: false, // Hide the label connector lines for cleaner look
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 15,
          fontWeight: "bold",
        },
      },
      color: ["#D0D5DD", "#7CD4FD"],
      data: data,

    },
  ],
  graphic: [
    {
      type: "text",
      left: "center",
      top: "35%",
      style: {
        text: `${total}`, // Display total value in the center
        textAlign: "center",
        font: "bold 32px Arial",
        fill: "#333",
      },
    },
    {
      type: "text",
      left: "center",
      top: "45%",
      style: {
        text: "total", // Subtitle (you can change this as needed)
        textAlign: "center",
        font: "normal 16px Arial",
        fill: "#999",
      },
    },
  ],

});

const option2 = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "0%",
    left: "center",
    itemGap: 50,
    icon: "circle",
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["40%", "70%"],
      center: ["50%", "40%"],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: true,
        position: "inner",
        formatter: "{c}",
        fontSize: 15,
        fontWeight: "bold",
      },
      labelLine: {
        show: false, // Hide the label connector lines for cleaner look
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 15,
          fontWeight: "bold",
        },
      },
      color: ["#D0D5DD", "#7CD4FD"],
      // labelLine: {
      //   show: false,
      // },
      data: data2,

    },
  ],
  graphic: [
    {
      type: "text",
      left: "center",
      top: "35%",
      style: {
        text: `${total2}`, // Display total value in the center
        textAlign: "center",
        font: "bold 32px Arial",
        fill: "#333",
      },
    },
    {
      type: "text",
      left: "center",
      top: "45%",
      style: {
        text: "total", // Subtitle (you can change this as needed)
        textAlign: "center",
        font: "normal 16px Arial",
        fill: "#999",
      },
    },
  ],

});

const option3 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: "category",
    data: ["Кухни ЛПП", "Кухня", "Буфет", "Больница", "Профилакторий", "Лагерь"],

  },
  series: [
    {
      name: "Expenses",
      type: "bar",
      data: [356800000, 86480500, 286800000, 500000000, 125800000, 865800000],
      itemStyle: {
        color: function(params: any) {
          // Define colors for each bar
          const colors = ["#36BFFA", "#53D28C", "#EE7677", "#FFB269", "#F670C7", "#9B8AFB"];

          return colors[params.dataIndex];
        },
        borderRadius: [0, 20, 20, 0],
      },

    },
  ],
};

const optionLine = {
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["12", "15", "17", "19", "21", "23", "25", "27", "29", "31", "2", "4", "6", "8", "10", "12"],
  },
  legend: {
    data: ["Мясной склад", "Овощной склад", "Рисовый склад"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Мясной склад",
      data: [120, 132, 101, 134, 90, 230, 210, 180, 200, 250, 300, 280, 320, 240, 500],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#4682B4",
        width: 3,
      },
    },
    {
      name: "Овощной склад",
      data: [220, 182, 191, 234, 290, 330, 310, 210, 150, 220, 270, 310, 120, 54, 350],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#FF6347",
        width: 3,
      },
    },
    {
      name: "Рисовый склад",
      data: [150, 232, 201, 154, 190, 330, 410, 140, 120, 130, 140, 160, 150, 230, 300],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#FFD700",
        width: 3,
      },
    },
  ],
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
};

interface Branch{
  title: string;
  value: number
}

const branch = ref<Branch[]>([
  {
    title: 'Все',
    value: 0
  },
  {
    title: 'Зарафшан',
    value: 1
  },
  {
    title: 'Навои',
    value: 2
  },
  {
    title: 'Нуробод',
    value: 3
  },
  {
    title: 'Учкудук',
    value: 4
  },
  {
    title: 'Зафаробод',
    value: 5
  },
])

const branches = ref<number>(0);

const changeBranch = (code: number) => {
  branches.value = code;
};

const handleClass = () => {
  return "!bg-[#FBDDDD]";
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Главная",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] mb-[24px]">
      Главная
    </h1>

    <div class="flex items-center rounded-md bg-[#F8F9FC] p-[4px] w-[586px] mb-[24px]">
      <button v-for="(event, index) in branch"
              :key="index"
              @click="changeBranch(event.value)"
              :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24] shadow': branches == event.value}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium"
      >
        {{event.title}}
      </button>
    </div>

    <div class="flex items-start gap-4 mb-[40px]">
      <div class="w-[55%]">
        <div class="flex items-center gap-4 mb-[40px]">
          <div class="w-[50%] bg-[#F8F9FC] rounded-[24px] p-[16px]">

            <div class="flex items-center mb-[38px]">
              <div class="flex items-center gap-2">
                <div class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center">
                  <img src="@/assets/warehouse.svg" alt="warehouse" width="32">
                </div>
                <div>
                  <h2 class="text-[#000D24] font-semibold text-[14px]">Занятость складов</h2>
                  <span class="text-[#A8AAAE] text-[12px]">Здесь будет текст</span>
                </div>
              </div>
            </div>

            <v-chart class="chart" :option="option" autoresize />
          </div>

          <div class="w-[50%] bg-[#F8F9FC] rounded-[24px] p-[16px]">

            <div class="flex items-center mb-[38px]">
              <div class="flex items-center gap-2">
                <div class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center">
                  <img src="@/assets/users.svg" alt="warehouse" width="32">
                </div>
                <div>
                  <h2 class="text-[#000D24] font-semibold text-[14px]">Количество посетителей</h2>
                  <span class="text-[#A8AAAE] text-[12px]">Здесь будет текст</span>
                </div>
              </div>
            </div>

            <v-chart class="chart" :option="option2" autoresize />
          </div>

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
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0002 6.66699V25.3337" stroke="#28C76F" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                    <path d="M24 14.667L16 6.66699" stroke="#28C76F" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                    <path d="M8 14.667L16 6.66699" stroke="#28C76F" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                    </svg>
                    5%
                </span>
              </div>
            </div>

            <v-chart class="chart-horizon" :option="option3" autoresize />

          </div>
        </div>

      </div>
      <div class="w-[45%]">
        <div class="p-[24px] bg-[#F8F9FC] rounded-t-[24px]">
          <span class="text-[#000D24] text-[18px] font-semibold ">Продукты с низким запасом</span>
        </div>
        <el-table :data="tableData" style="width: 100%" :row-class-name="handleClass">
          <!--          <el-table-column prop="id" label="№" width="180" />-->
          <!--          <el-table-column prop="product" label="Тип продукта" width="180" />-->
          <!--          <el-table-column prop="product-two" label="Вид продукта" />-->
          <!--          <el-table-column prop="total-count" label="Количество" />-->
          <!--          <el-table-column prop="branch" label="База" />-->

          <el-table-column type="index" label="№" width="80" />

          <el-table-column label="Тип продукта">
            <template #default="{row}">
              <div class="flex items-center gap-3">
                <el-avatar :size="32" :src="row.product_type.photo" />
                <span>{{ row.product_type.title }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Вид продукта">
            <template #default="{row}">
              <div class="flex items-center gap-3">
                <el-avatar :size="32" :src="row.product_view.photo" />
                <span>{{ row.product_view.title }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Количество">
            <template #default="{row}">
              <span class="">{{ row.total_count }} кг</span>
            </template>
          </el-table-column>

          <el-table-column label="База">
            <template #default="{row}">
              <span class="">{{ row.branch }}</span>
            </template>
          </el-table-column>

        </el-table>

      </div>
    </div>

    <div class="p-[24px] bg-[#F8F9FC] rounded-[24px] mb-[40px]" v-for="item in 2">
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

      <v-chart class="line-chart" :option="optionLine" autoresize />
    </div>

    <div class="flex items-center gap-4 mb-[40px]">
      <div class="w-[50%] bg-[#F8F9FC] rounded-[24px] p-[16px]">

        <div class="flex items-center mb-[38px]">
          <div class="flex items-center gap-2">
            <div class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center">
              <img src="@/assets/images/icons/kitchen.svg" alt="warehouse" width="32">
            </div>
            <div>
              <h2 class="text-[#000D24] font-semibold text-[14px]">Количество кухонь</h2>
              <span class="text-[#A8AAAE] text-[12px]">Здесь будет текст</span>
            </div>
          </div>
        </div>

        <v-chart class="chart" :option="option" autoresize />
      </div>

      <div class="w-[50%] bg-[#F8F9FC] rounded-[24px] p-[16px]">
        <div class="flex items-center mb-[38px]">
          <div class="flex items-center gap-2">
            <div class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center">
              <img src="@/assets/images/icons/branch.svg" alt="warehouse" width="32">
            </div>
            <div>
              <h2 class="text-[#000D24] font-semibold text-[14px]">Количество складов</h2>
              <span class="text-[#A8AAAE] text-[12px]">Здесь будет текст</span>
            </div>
          </div>
        </div>

        <v-chart class="chart" :option="option2" autoresize />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

