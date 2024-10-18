<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface TableData {
  id: number;
  name: string;
}

const input1 = ref<string>("");
const tableData = ref<TableData[]>([
  {
    id: 1,
    name: "Служебные записки",
  },
  {
    id: 2,
    name: "Запросы",
  },
  {
    id: 3,
    name: "Накладные",
  },
  {
    id: 4,
    name: "Акты",
  },
  {
    id: 5,
    name: "Контракты",
  },
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },
    {
      label: "Документы",
      to: { name: "reference" },
    },
    {
      label: "Типы документов",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Типы документов</h1>

      <el-input
        v-model="input1"
        size="large"
        placeholder="Поиск"
        :prefix-icon="Search"
        class="w-[300px]"
      />
    </div>

    <div class="mt-[24px]">
      <el-table :data="tableData" stripe class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование типа" sortable />
      </el-table>
    </div>
  </div>
</template>
