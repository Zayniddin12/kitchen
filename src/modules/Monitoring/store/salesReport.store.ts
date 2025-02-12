import { defineStore } from "pinia";
import { ref, watch } from "vue";
import $axios from "@/plugins/axios/axios";

export const useSalesReportStore = defineStore("salesReportStore", () => {
  const salesReport = ref([]);
  const reportFilter = ref({
    kitchen_id: null as string | number | null,
    management_id: null as string | number | null,
    date: null as string | null, 
  });

  // Get sales report
  const GET_SALES_REPORT = async () => {
    try {
      const params: Record<string, string | number> = {};
      if (reportFilter.value.kitchen_id) params.kitchen_id = reportFilter.value.kitchen_id;
      if (reportFilter.value.management_id) params.management_id = reportFilter.value.management_id;
      if (reportFilter.value.date) params.date = reportFilter.value.date;
 
      const { data } = await $axios.get("/monitoring/paid-sales", { params });
      salesReport.value = data.data;
      return data.data;
    } catch (error) {
      console.error("Error fetching sales report:", error);
      return [];
    }
  };

  const setFilterParams = (kitchen_id: string | number, management_id: string | number, date: string | null) => {
    reportFilter.value.kitchen_id = kitchen_id;
    reportFilter.value.management_id = management_id;
    reportFilter.value.date = date;
  };

  const resetFilters = () => {
    reportFilter.value = { kitchen_id: null, management_id: null, date: null };
  };

  return {
    salesReport,
    reportFilter,
    GET_SALES_REPORT,
    setFilterParams,
    resetFilters,
  };
});
