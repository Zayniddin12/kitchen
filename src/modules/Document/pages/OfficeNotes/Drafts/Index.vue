<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import appInput from "@/components/ui/form/app-input/AppInput.vue";
import appSelect from "@/components/ui/form/app-select/AppSelect.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import EditModal from './EditModal.vue'

interface TableData {
  id: number;
  num: string;
  date: string;
  doc: string;
  theme: string;
  send: string;
  receive: string;
}

const router = useRouter();
const isOpenFilter = ref<boolean>(false);
const editModal = ref<boolean>(false);
const isView = ref<boolean>(false)

const tableData = ref<TableData[]>([
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
]);

const viewDraft = () => {
  editModal.value = true;
  isView.value = true
}

const handleEdit = () => {
  editModal.value = true
  isView.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">Черновики</h1>

      <button class="custom-filter-btn font-medium" :class="isOpenFilter ? '!bg-blue !text-white' : ''"
              @click="isOpenFilter = !isOpenFilter">
        <img :src="isOpenFilter ? white : filter" alt="filter" class="mr-[12px]" />
        Фильтр
      </button>

    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <app-date-picker placeholder="с этой даты" />
          <app-date-picker placeholder="по эту дату" />

          <appInput placeholder="Номер документа" />
          <appInput placeholder="Доставка картофеля" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4">
          <appSelect placeholder="Кому" />
          <appSelect placeholder="Отправитель" />
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
      <el-table-column prop="date" label="Дата" />
      <el-table-column prop="doc" label="№ документа" />
      <el-table-column prop="theme" label="Тема" />
      <el-table-column prop="send" label="Отправитель" />
      <el-table-column prop="receive" label="Получатель" />
      <el-table-column label="Действие">
        <template #default="scope">
          <button class="action-btn" @click="viewDraft">
            <img src="@/assets/images/eye.svg" alt="eye" />
          </button>

          <button class="action-btn ml-[8px]" @click="handleEdit">
            <img src="@/assets/images/icons/edit.svg" alt="edit" />
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

    <EditModal
      v-model:editModal="editModal"
      :isView="isView"
    />
  </div>
</template>
