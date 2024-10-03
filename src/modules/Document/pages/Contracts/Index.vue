<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import appInput from "@/components/ui/form/app-input/AppInput.vue";
import appSelect from "@/components/ui/form/app-select/AppSelect.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";

interface TableData {
  id: number,
  date: string,
  numContact: string,
  supplier: string,
  sum: string,
  typePro: string,
  vidPro: string,
  count: string,
  editing: string,
}

const router = useRouter();
const isOpenFilter = ref<boolean>(false);

const tableData = ref<TableData[]>([
  {
    id: 1,
    date: "23.08.2024",
    numContact: "852369",
    supplier: "Фонд",
    sum: "22 654 000 сум",
    typePro: "Мясные",
    vidPro: "Куриное мясо",
    count: "200",
    editing: "килограмм",
  },
  {
    id: 2,
    date: "23.08.2024",
    numContact: "852369",
    supplier: "Фонд",
    sum: "22 654 000 сум",
    typePro: "Зерновые",
    vidPro: "Рис",
    count: "450",
    editing: "килограмм",
  },
  {
    id: 3,
    date: "23.08.2024",
    numContact: "852369",
    supplier: "Фонд",
    sum: "22 654 000 сум",
    typePro: "Овощи",
    vidPro: "Картофель",
    count: "340",
    editing: "килограмм",
  },
  {
    id: 4,
    date: "23.08.2024",
    numContact: "852369",
    supplier: "Фонд",
    sum: "22 654 000 сум",
    typePro: "Мясные",
    vidPro: "Говядина",
    count: "155",
    editing: "килограмм",
  },
]);

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">Контракты</h1>

      <div class="flex items-center">
        <button class="custom-apply-btn" @click="router.push('/contracts-create')">
          <img src="@/assets/images/icons/plus.svg" alt="add">
          Добавить
        </button>

        <button class="custom-filter-btn font-medium ml-[16px]" :class="isOpenFilter ? '!bg-blue !text-white' : ''"
                @click="isOpenFilter =! isOpenFilter">
          <img :src="isOpenFilter ? white : filter" alt="filter" class="mr-[12px]" />
          Фильтр
        </button>
      </div>
    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <app-date-picker placeholder="с этой даты" />
          <app-date-picker placeholder="по эту дату" />

          <appInput placeholder="Номер документа" />
          <appInput placeholder="Поставщик" />
          <appInput placeholder="Общая сумма контракта" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <appSelect placeholder="Название продукта" />
          <appSelect placeholder="Количество" />
          <app-input placeholder="Ед. измерения" />
        </div>

        <div class="flex items-center mt-[10px] justify-between">
          <div class="text-[#8F9194] text-[14px]">Найдено: 56</div>
          <div class="flex items-center">
            <button class="custom-reset-btn">Сбросить</button>
            <button class="custom-apply-btn ml-[16px]">Применить</button>
          </div>
        </div>
      </template>
    </CollapseFilter>

    <el-table :data="tableData" class="custom-element-table">
      <el-table-column prop="id" label="№" width="80" />
      <el-table-column prop="date" label="Дата" />
      <el-table-column prop="numContact" label="№ контракта" />
      <el-table-column prop="supplier" label="Поставщик" />
      <el-table-column prop="sum" label="Cумма" />
      <el-table-column prop="typePro" label="Тип продукта" />
      <el-table-column prop="vidPro" label="Вид продукта" />
      <el-table-column prop="count" label="Количество" />
      <el-table-column prop="editing" label="Измерения" />
      <el-table-column label="Действие">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/contracts-view/${scope.row.id}`)">
            <img src="@/assets/images/eye.svg" alt="eye" />
          </button>

          <button class="action-btn ml-[8px]" @click="actionButton(scope.row)">
            <img src="@/assets/images/download.svg" alt="download" />
          </button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-[24px] flex items-center justify-between">
      <div class="text-cool-gray text-[14px]">
        Показано 1–12 из 100 результатов
      </div>

      <el-pagination
        class="float-right"
        background
        layout="prev, pager, next"
        :total="1000"
      />
    </div>
  </div>
</template>
