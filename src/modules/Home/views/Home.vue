<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

// provide(THEME_KEY, "dark");

const option = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "0%",
    left: "center",
    itemGap: 160,
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
      data: [
        { value: 1200, name: "Общая вместимость" },
        { value: 4600, name: "Занятое место" },
      ],
    },
  ],
  graphic: {
    type: "text",
    left: "center",
    top: "center",
    style: {
      text: "Total\n3147", // Displayed text in the center, '\n' for line break
      textAlign: "center",
      fill: "#0000", // Text color
      fontSize: 20,
      fontWeight: "bold",
    },
  },
});

const option2 = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "0%",
    left: "center",
    itemGap: 160,
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
      data: [
        { value: 2200, name: "за свой счет" },
        { value: 3660, name: "с рационом" },
      ],
    },
  ],
  graphic: {
    type: "text",
    left: "center",
    top: "center",
    style: {
      text: "Total\n3147", // Displayed text in the center, '\n' for line break
      textAlign: "center",
      fill: "#0000", // Text color
      fontSize: 20,
      fontWeight: "bold",
    },
  },
});

const branches = ref<number>(0);

const changeBranch = (code: number) => {
  branches.value = code;
};

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] mb-[24px]">Главная</h1>

    <div
      class="flex items-center rounded bg-white-blue p-[4px] w-[586px] mb-[24px]"
    >
      <button
        @click="changeBranch(0)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 0 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Все
      </button>

      <button
        @click="changeBranch(1)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 1 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Зарафшан
      </button>

      <button
        @click="changeBranch(2)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 2 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Навои
      </button>

      <button
        @click="changeBranch(3)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 3 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Нуробод
      </button>

      <button
        @click="changeBranch(4)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 4 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Учкудук
      </button>

      <button
        @click="changeBranch(5)"
        :class="{ 'bg-[#FFFFFF] rounded-[8px] text-dark': branches == 5 }"
        class="px-[20px] py-[10px] text-[14px] text-dark-gray font-medium"
      >
        Зафаробод
      </button>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-[55%]">
        <div class="flex items-center gap-4">
          <div class="w-[50%] bg-white-blue rounded-[24px] p-[16px]">
            <div class="flex items-center mb-[38px]">
              <div class="flex items-center gap-2">
                <div
                  class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center"
                >
                  <img
                    src="@/assets/warehouse.svg"
                    alt="warehouse"
                    width="32"
                  />
                </div>
                <div>
                  <h2 class="text-dark font-semibold text-[14px]">
                    Занятость складов
                  </h2>
                  <span class="text-[#A8AAAE] text-[12px]"
                    >Здесь будет текст</span
                  >
                </div>
              </div>
            </div>

            <v-chart
              class="chart"
              :option="option"
              autoresize
            />
          </div>

          <div class="w-[50%] bg-white-blue rounded-[24px] p-[16px]">
            <div class="flex items-center mb-[38px]">
              <div class="flex items-center gap-2">
                <div
                  class="bg-[#FFFFFF] p-[8px] rounded-[8px] flex items-center justify-center"
                >
                  <img
                    src="@/assets/users.svg"
                    alt="warehouse"
                    width="32"
                  />
                </div>
                <div>
                  <h2 class="text-dark font-semibold text-[14px]">
                    Количество посетителей
                  </h2>
                  <span class="text-[#A8AAAE] text-[12px]"
                    >Здесь будет текст</span
                  >
                </div>
              </div>
            </div>

            <v-chart
              class="chart"
              :option="option2"
              autoresize
            />
          </div>
        </div>
      </div>
      <div class="w-[45%]">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="№"
            width="180"
          />
          <el-table-column
            prop="name"
            label="Тип продукта"
            width="180"
          />
          <el-table-column
            prop="address"
            label="Вид продукта"
          />
          <el-table-column
            prop="address"
            label="Количество"
          />
          <el-table-column
            prop="address"
            label="База"
          />
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
