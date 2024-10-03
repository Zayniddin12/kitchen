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
  num: string,
  system: string,
  dateSystem: string,
  doc: string,
  nak: string,
  main: string,
  whom: string,
  toWhom: string,
  payType: string,
}

const router = useRouter();
const isOpenFilter = ref<boolean>(false);

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    system: "NK-00000",
    dateSystem: "23.08.2024",
    doc: "247",
    main: "04-04-01/463",
    whom: "Зарафшан",
    toWhom: "Фонд",
    payType: "85 897 VAA",
  },
  {
    id: 2,
    num: "2",
    system: "NK-00000",
    dateSystem: "23.08.2024",
    doc: "247",
    main: "04-04-01/463",
    whom: "Зарафшан",
    toWhom: "Фонд",
    payType: "85 897 VAA",
  },
  {
    id: 3,
    num: "3",
    system: "NK-00000",
    dateSystem: "23.08.2024",
    doc: "247",
    main: "04-04-01/463",
    whom: "Зарафшан",
    toWhom: "Фонд",
    payType: "85 897 VAA",
  },
  {
    id: 4,
    num: "4",
    system: "NK-00000",
    dateSystem: "23.08.2024",
    doc: "247",
    main: "04-04-01/463",
    whom: "Зарафшан",
    toWhom: "Фонд",
    payType: "85 897 VAA",
  },
]);

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">Исходящие</h1>

      <button class="custom-filter-btn font-medium" :class="isOpenFilter ? '!bg-blue !text-white' : ''"
              @click="isOpenFilter = !isOpenFilter">
        <img :src="isOpenFilter ? white : filter" alt="filter" class="mr-[12px]" />
        Фильтр
      </button>
    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <appInput placeholder="№ накладной в системе" label="№ накладной в системе" label-class="text-[#7F7D83]"/>
          <appInput placeholder="Дата создания в системе" label="Дата создания в системе" label-class="text-[#7F7D83]"/>

          <appInput placeholder="№ накладной" label="№ накладной" label-class="text-[#7F7D83]"/>
          <appInput placeholder="Дата накладной" label="Дата накладной" label-class="text-[#7F7D83]"/>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <appSelect placeholder="От кого" label="От кого" label-class="text-[#7F7D83]"/>
          <appSelect placeholder="Кому" label="Кому" label-class="text-[#7F7D83]"/>

          <appInput placeholder="Основание" label="Основание" label-class="text-[#7F7D83]"/>
          <appInput placeholder="Способ отправления" label="Способ отправления" label-class="text-[#7F7D83]"/>
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
      <el-table-column prop="num" label="№" width="80" />
      <el-table-column prop="system" label="№ в системе" />
      <el-table-column prop="dateSystem" label="Дата в системе" />
      <el-table-column prop="doc" label="№ док..." />
      <el-table-column prop="main" label="Основание" />
      <el-table-column prop="whom" label="От кого" />
      <el-table-column prop="toWhom" label="Кому" />
      <el-table-column prop="payType" label="Способ отп..." />
      <el-table-column label="Действие">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/invoice-outgoing/${scope.row.id}`)">
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
