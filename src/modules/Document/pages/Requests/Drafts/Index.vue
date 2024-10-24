<script
  setup
  lang="ts"
>
import { ref, watchEffect } from "vue";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import appInput from "@/components/ui/form/app-input/AppInput.vue";
import appSelect from "@/components/ui/form/app-select/AppSelect.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import EditModal from "./EditModal.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface TableData {
  id: number;
  num: string;
  date: string;
  request: string;
  recipient: string;
  theme: string;
}

const isOpenFilter = ref<boolean>(false);
const isOpenModal = ref<boolean>(false);

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    request: "Z-45896",
    recipient: "РУ “Зарафшан”",
    theme: "Доставка мяса",
  },
  {
    id: 2,
    num: "1",
    date: "23.08.2024",
    request: "Z-45896",
    recipient: "РУ “Нуробод”",
    theme: "Доставка мяса",
  },
  {
    id: 3,
    num: "1",
    date: "23.08.2024",
    request: "Z-45896",
    recipient: "РУ “Навои”",
    theme: "Доставка мяса",
  },
  {
    id: 4,
    num: "1",
    date: "23.08.2024",
    request: "Z-45896",
    recipient: "РУ “Зарафшан”",
    theme: "Доставка мяса",
  },
]);

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы",
    },
    {
      label: "Запросы",
    },
    {
      label: "Черновики",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="mb-0 font-semibold text-[32px]">Черновики</h1>

      <button
        class="custom-filter-btn font-medium"
        :class="isOpenFilter ? '!bg-blue !text-white' : ''"
        @click="isOpenFilter =! isOpenFilter"
      >
        <img
          :src="isOpenFilter ? white : filter"
          alt="filter"
          class="mr-[12px]"
        />
        Фильтр
      </button>
    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <app-date-picker
            placeholder="С этой даты"
            label="С этой даты"
            label-class="text-[#7F7D83]"
          />
          <app-date-picker
            placeholder="По эту дату"
            label="По эту дату"
            label-class="text-[#7F7D83]"
          />

          <appInput
            placeholder="№ запроса"
            label="№ запроса"
            label-class="text-[#7F7D83]"
          />
          <appInput
            placeholder="Тема"
            label="Тема"
            label-class="text-[#7F7D83]"
          />
          <app-select
            placeholder="Отправитель"
            label="Отправитель"
            label-class="text-[#7F7D83]"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4">
          <app-input
            placeholder="Тема"
            label="Тема"
            label-class="text-[#7F7D83]"
          />
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

    <el-table
      :data="tableData"
      class="custom-element-table"
      stripe
    >
      <el-table-column
        prop="id"
        label="№"
        width="80"
      />
      <el-table-column
        prop="date"
        label="Дата"
      />
      <el-table-column
        prop="request"
        label="№ запроса"
      />
      <el-table-column
        prop="recipient"
        label="Получатель"
      />
      <el-table-column
        prop="theme"
        label="Тема"
      />
      <el-table-column label="Действие">
        <template #default="scope">
          <button
            class="action-btn"
            @click="isOpenModal = true"
          >
            <img
              src="@/assets/images/icons/edit.svg"
              alt="eye"
            />
          </button>

          <button
            class="action-btn ml-[8px]"
            @click="actionButton(scope.row)"
          >
            <img
              src="@/assets/images/download.svg"
              alt="download"
            />
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

    <EditModal v-model:editModal="isOpenModal" />
  </div>
</template>
