<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";
import { tableData } from "@/modules/Home/constants";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
]);

// provide(THEME_KEY, "dark");

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
      labelLine: {
        show: false,
      },
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
      labelLine: {
        show: false,
      },
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


const branches = ref<number>(0);

const changeBranch = (code: number) => {
  branches.value = code;
};

const handleClass = (item) => {

  return "!bg-[#FBDDDD]";
};

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] mb-[24px]">
      Главная
    </h1>

    <div class="flex items-center rounded bg-[#F8F9FC] p-[4px] w-[586px] mb-[24px]">
      <button @click="changeBranch(0)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 0}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Все
      </button>

      <button @click="changeBranch(1)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 1}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Зарафшан
      </button>

      <button @click="changeBranch(2)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 2}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Навои
      </button>

      <button @click="changeBranch(3)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 3}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Нуробод
      </button>

      <button @click="changeBranch(4)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 4}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Учкудук
      </button>

      <button @click="changeBranch(5)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 5}"
              class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
        Зафаробод
      </button>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-[55%]">
        <div class="flex items-center gap-4">
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

          <el-table-column type="index" label="№" />

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

  </div>
</template>

<style scoped lang="scss">
.chart {
  height: 314px;
}
</style>