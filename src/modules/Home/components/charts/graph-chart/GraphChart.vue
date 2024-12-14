<script
    setup
    lang="ts"
>

import { GraphChartPropsType } from "@/modules/Home/components/charts/graph-chart/graph-chart.types";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { computed, useSlots } from "vue";
import VChart from "vue-echarts";
import { formatDate2 } from "@/utils/helper";

const props = defineProps<GraphChartPropsType>();

const slots = useSlots();

const option = computed(() => {
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: props.data[0]?.data.map((item) => formatDate2(new Date(item.date)))
    },
    legend: {
      data: props.data.map(item => item.warehouse_name)
    },
    yAxis: {
      type: "value"
    },
    series: props.data.map((item) => {
      return {
        name: item.warehouse_name,
        data: item.data.map(el => el.value),
        type: "line",
        smooth: true,
        lineStyle: {
          color: item.color,
          width: 3
        }
      };
    }),
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
});

</script>

<template>
  <div>
    <AppOverlay
        :loading
        :loading-size="60"
        parent-class-name="home-card"
    >
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <strong class="text-2xl text-dark font-semibold">{{ title }}</strong>
          <span class="text-black-sub block text-sm">{{ subtitle }}</span>
        </div>
        <div
            v-if="slots.form"
            class="w-[424px]"
        >
          <slot name="form"/>
        </div>
      </div>
      <VChart
          class="h-[381px]"
          autoresize
          :option
      />
    </AppOverlay>
  </div>
</template>