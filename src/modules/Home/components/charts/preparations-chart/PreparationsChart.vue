<script
    setup
    lang="ts"
>

import { computed, useSlots } from "vue";
import {
  PreparationsChartPropsType
} from "@/modules/Home/components/charts/preparations-chart/preparations-chart.types";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { formatNumber } from "@/utils/helper";
import UppIcon from "@/assets/images/icons/upp.svg";
import VChart from "vue-echarts";

const props = defineProps<PreparationsChartPropsType>();

const slots = useSlots();

const option = computed(() => {
  return {
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
      data: props.data.map(el => el.name)
    },
    series: [
      {
        name: "Expenses",
        type: "bar",
        data: props.data.map(el => el.price),
        itemStyle: {
          color: function (params: any) {
            const colors = ["#36BFFA", "#53D28C", "#EE7677", "#FFB269", "#F670C7", "#9B8AFB"];
            return colors[params.dataIndex];
          },
          borderRadius: [0, 20, 20, 0]
        }

      }
    ]
  };
});


</script>

<template>
  <div>
    <AppOverlay
        :loading
        parent-class-name="home-card"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-dark text-2xl font-semibold">{{ title }}</h2>
        <div
            v-if="slots.form"
            class="w-[425px]"
        >
          <slot name="form"/>
        </div>
      </div>
      <div>
        <span class="text-[#A8AAAE] text-[14px] mb-[4px]">Общая сумма</span>
        <div class="flex items-center">
                <span class="text-[32px] font-semibold">
                  {{ total_price ? formatNumber(total_price) : 0 }} UZS
                </span>
          <span class="flex items-center text-[#28C76F] text-[18px] font-medium">
                  <svg
                      :data-src="UppIcon"
                      class="size-8"
                  />
                    {{ percent }}%
                </span>
        </div>
      </div>
      <VChart
          autoresize
          :option
          class="h-[340px]"
      />
    </AppOverlay>
  </div>
</template>