<script
  setup
  lang="ts"
>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import appInput from "@/components/ui/form/app-input/AppInput.vue";
import appSelect from "@/components/ui/form/app-select/AppSelect.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface TableData {
  id: number,
  date: string,
  numDoc: string,
  vidDoc: string,
  type: string,
  vidPro: string,
  warehouse: string,
}

const router = useRouter();
const isOpenFilter = ref<boolean>(false);

const tableData = ref<TableData[]>([
  {
    id: 1,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан",
  },
  {
    id: 2,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан",
  },
  {
    id: 3,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан",
  },
  {
    id: 4,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан",
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
      label: "Акты",
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
      <h1 class="m-0 font-semibold text-[32px]">Акты</h1>

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
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            placeholder="Номер документа"
            label="Номер документа"
            label-class="text-[#7F7D83]"
          />
          <appInput
            placeholder="Доставка картофеля"
            label="Доставка картофеля"
            label-class="text-[#7F7D83]"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4">
          <appSelect
            placeholder="Кому"
            label="Кому"
            label-class="text-[#7F7D83]"
          />
          <appSelect
            placeholder="Отправитель"
            label="Отправитель"
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
        prop="numDoc"
        label="№ док..."
      />
      <el-table-column
        prop="vidDoc"
        label="Вид док..."
      />
      <el-table-column
        prop="type"
        label="Тип продукта"
      />
      <el-table-column
        prop="vidPro"
        label="Вид продукта"
      />
      <el-table-column
        prop="warehouse"
        label="Склад"
      />
      <el-table-column label="Действие">
        <template #default="scope">
          <button
            class="action-btn"
            @click="router.push(`/acts/${scope.row.id}`)"
          >
            <img
              src="@/assets/images/eye.svg"
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
  </div>
</template>
