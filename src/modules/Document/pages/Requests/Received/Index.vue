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
  id: number;
  num: string;
  date: string;
  doc: string;
  theme: string;
  send: string;
  receive: string;
}

interface TabItems {
  label: string;
  value: number;
}

const router = useRouter();
const isOpenFilter = ref<boolean>(false);
const activeTab = ref<number>(0);

const tabItems = ref<TabItems[]>([
  {
    label: 'Единоразовый',
    value: 0
  },
  {
    label: 'Месячный',
    value: 1
  },
  {
    label: 'Годовой',
    value: 2
  },
])

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    request: "Z-45896",
    sent: "РУ “Зарафшан”",
    theme: "Доставка мяса",
  },
  {
    id: 2,
    num: "1",
    date: "23.08.2024",
    request: "Z-32478",
    sent: "РУ “Нуробод”",
    theme: "Доставка мяса",
  },
  {
    id: 3,
    num: "1",
    date: "23.08.2024",
    request: "Z-89614",
    sent: "РУ “Навои”",
    theme: "Доставка мяса",
  },
  {
    id: 4,
    num: "1",
    date: "23.08.2024",
    request: "Z-85269",
    sent: "РУ “Зарафшан”",
    theme: "Доставка мяса",
  },
]);

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};

const changeTab = (value: number) => activeTab.value = value;
</script>

<template>
  <div>
    <h1 class="mb-[24px] font-semibold text-[32px]">Полученные</h1>

    <div class="flex items-center justify-between">
      <div class="bg-white-blue p-1 flex items-center rounded-lg font-medium text-xs leading-5">
        <button
          v-for="item in tabItems"
          :key="item.value"
          :class="['rounded-lg py-2.5 px-5 transition duration-100 ease', `${item.value === activeTab ? 'bg-white shadow-[0px_1.5px_4px_-1px_#0A090B12] text-dark' : 'text-dark-gray'}`]"
          @click="changeTab(item.value)"
        >
          {{item.label}}
        </button>
      </div>

      <button class="custom-filter-btn font-medium" :class="isOpenFilter ? '!bg-blue !text-white' : ''"
              @click="isOpenFilter =! isOpenFilter">
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
      <el-table-column prop="num" label="№" />
      <el-table-column prop="date" label="Дата" />
      <el-table-column prop="request" label="№ запроса" />
      <el-table-column prop="sent" label="Отправитель" />
      <el-table-column prop="theme" label="Тема" />
      <el-table-column label="Действие">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/received/${scope.row.id}`)">
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
