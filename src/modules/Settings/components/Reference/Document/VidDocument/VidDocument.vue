<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

interface TableData {
  id: number;
  name: string;
  type: string;
}

const input1 = ref<string>("");
const tableData = ref<TableData[]>([
  {
    id: 1,
    name: "Служебные записки",
    type: 'Служебные записки'
  },
  {
    id: 2,
    name: "Запросы",
    type: 'Запросы'
  },
  {
    id: 3,
    name: "Накладные",
    type: 'Накладные'
  },
  {
    id: 4,
    name: "Акты",
    type: 'Акты'
  },
  {
    id: 5,
    name: "Контракты",
    type: 'Контракты'
  },
]);
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Виды документов</h1>

      <el-input
        v-model="input1"
        size="large"
        placeholder="Поиск"
        :prefix-icon="Search"
        class="w-[300px]"
      />
    </div>

    <div class="mt-[24px]">
      <el-table :data="tableData" class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование типа" sortable width="400"/>
        <el-table-column prop="name" label="Типы документов" sortable />
      </el-table>
    </div>
  </div>
</template>

