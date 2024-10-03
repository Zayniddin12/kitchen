<script setup lang="ts">
import { useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ref } from "vue";

const router = useRouter();

interface TableData {
  name: string;
  count: string;
  count2: string;
  cost: string;
  sum: string;
}

const tableData = ref<TableData[]>([
  {
    name: "Картофель",
    count: "80",
    count2: "кг",
    cost: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    name: "Говядина",
    count: "30",
    count2: "кг",
    cost: "86 000 сум",
    sum: "1 700 000 сум",
  },
  {
    name: "Горох",
    count: "50",
    count2: "кг",
    cost: "34 000 сум",
    sum: "1 000 000 сум",
  },
  {
    name: "Морковь",
    count: "50",
    count2: "кг",
    cost: "20 000 сум",
    sum: "1 760 000 сум",
  },
]);
</script>

<template>
  <h1 class="m-0 font-semibold text-[32px]">Просмотор</h1>

  <div class="border rounded-[24px] p-[24px] my-[24px]">
    <div class="grid grid-cols-2 gap-6">
      <div>
        <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">№ контракта</label>
        <app-input />
      </div>

      <div>
        <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Поставщик</label>
        <app-select placeholder="" />
      </div>
    </div>

    <div class="p-[16px] rounded-[16px]">
      <el-table :data="tableData" class="custom-element-table">
        <el-table-column prop="name" label="Тип продукта" />
        <el-table-column prop="count" label="Вид продукта" />
        <el-table-column prop="count2" label="Количество" />
        <el-table-column prop="cost" label="Ед. измерения" />
        <el-table-column prop="sum" label="Цена" />
        <el-table-column prop="sum" label="Сумма" />
      </el-table>

      <div class="flex items-center justify-end mt-[10px]">
        <h1 class="text-[#000D24] text-[14px] font-bold mr-[70px]">Общая сумма: </h1>
        <h1 class="text-[#000D24] text-[14px] font-bold mr-2">7 040 000 сум</h1>
      </div>
    </div>
  </div>
</template>

