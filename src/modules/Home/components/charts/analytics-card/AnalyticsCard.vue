<script
  setup
  lang="ts"
>

import { AnalyticsCardPropsType } from "@/modules/Home/components/charts/analytics-card/analytics-card.types";
import { computed } from "vue";
import VChart from "vue-echarts";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<AnalyticsCardPropsType>();

const totalDataValue = computed(() => {
  return props.data.reduce((sum, { value }) => sum + value, 0).toFixed(2);
});

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      left: "center",
      width: "100%",
      itemGap: props.legendItemGap ?? 30,
      icon: "circle",
      orient: "horizontal",
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
          formatter: ({ value }: { value: number }) => value.toFixed(2),
          fontSize: 15,
          fontWeight: "bold",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: "bold",
          },
        },
        color: ["#D0D5DD", "#7CD4FD"],
        data: props.data,
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "35%",
        style: {
          text: totalDataValue.value,
          textAlign: "center",
          font: "bold 20px Arial",
          fill: "#333",
        },
      },
      {
        type: "text",
        left: "center",
        top: "45%",
        style: {
          text: t("common.total"),
          textAlign: "center",
          font: "normal 16px Arial",
          fill: "#999",
        },
      },
    ],
  };
});

</script>

<template>
  <AppOverlay
    :loading
    :rounded="24"
    parent-class-name="home-card analytics-card"
  >
    <div class="flex items-center gap-x-2">
      <div class="bg-white p-2 rounded-lg flex items-center justify-center">
        <svg :data-src="icon" />
      </div>
      <div class="flex flex-col gap-x-1">
        <strong class="text-dark font-semibold text-sm">
          {{ title }}
        </strong>
        <span class="text-xs text-[#A8AAAE] opacity-0">
          {{ subtitle }}
        </span>
      </div>
    </div>
    <VChart
      class="analytics-card__chart h-[314px] mt-[38px]"
      :option="chartOption"
      autoresize
    />
  </AppOverlay>
</template>