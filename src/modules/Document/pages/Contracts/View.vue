<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

interface TableData {
  typePro: string;
  vidPro: string;
  count: string;
  unit: string;
  cost: string;
  sum: string;
}

const router = useRouter();

const tableData = ref<TableData[]>([
  {
    typePro: "Овощи",
    vidPro: "Картофель",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум",
  },
  {
    typePro: "Мясные",
    vidPro: "Говядина",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум",
  },
  {
    typePro: "Зерновые",
    vidPro: "Горох",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум",
  },
  {
    typePro: "Овощи",
    vidPro: "Морковь",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум",
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
        <el-table-column prop="typePro" label="Тип продукта" />
        <el-table-column prop="vidPro" label="Вид продукта" />
        <el-table-column prop="count" label="Количество" />
        <el-table-column prop="unit" label="Ед. измерения" />
        <el-table-column prop="cost" label="Цена" />
        <el-table-column prop="sum" label="Сумма" />
      </el-table>

      <div class="flex items-center justify-end mt-[10px]">
        <h1 class="text-[#000D24] text-[14px] font-bold mr-[70px]">Общая сумма: </h1>
        <h1 class="text-[#000D24] text-[14px] font-bold mr-2">7 040 000 сум</h1>
      </div>
    </div>
  </div>
</template>

