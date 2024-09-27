<script setup lang="ts">
import { ref } from "vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";

const isOpenFilter = ref<boolean>(false);

const tableData = [
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    doc: "852369",
    theme: "Доставка мяса",
    send: "Зарафшан",
    receive: "Фонд",
  },
  {
    id: 2,
    num: "2",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
  {
    id: 3,
    num: "3",
    date: "21.08.2024",
    doc: "584534",
    theme: "Доставка лука",
    send: "Навои",
    receive: "Фонд",
  },
  {
    id: 4,
    num: "4",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
];

const actinButton = (value: any) => {
  console.log(value, 'value');
}
</script>

<template>
  <div>

    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">
        Входящие
      </h1>

      <button class="custom-filter-btn font-medium" :class="isOpenFilter ? '!bg-[#2E90FA] !text-white' : ''"
              @click="isOpenFilter =! isOpenFilter">
        <img :src="isOpenFilter ? white : filter" alt="filter" class="mr-[12px]" />
        Фильтр
      </button>
    </div>

    <el-table :data="tableData" class="mt-[24px] custom-element-table">
      <el-table-column prop="num" label="№" />
      <el-table-column prop="date" label="Дата" />
      <el-table-column prop="doc" label="№ документа" />
      <el-table-column prop="theme" label="Тема" />
      <el-table-column prop="send" label="Отправитель" />
      <el-table-column prop="receive" label="Получатель" />
      <el-table-column prop="action" label="Действие">
        <template #default="scope">
          <!--          {{scope.row.date}}-->
          <button class="action-btn" @click="actinButton(scope.row)">
            <img src="@/assets/images/eye.svg" alt="eye">
          </button>

          <button class="action-btn ml-[8px]" @click="actinButton(scope.row)">
            <img src="@/assets/images/download.svg" alt="download">
          </button>
        </template>
      </el-table-column>
    </el-table>


    <div class="mt-[24px] flex items-center justify-between">
      <div class="text-[#8F9194] text-[14px]">
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
