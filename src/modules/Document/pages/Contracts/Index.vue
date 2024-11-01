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
    editing: "килограмм"
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
    editing: "килограмм"
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
    editing: "килограмм"
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
    editing: "килограмм"
  }
]);

const tableCurrentChange = (value: TableData) => {
  router.push({ name: "contracts-view-view", params: { id: value.id } });
};

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Контракты",
      isActionable: true
    }
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">Контракты</h1>

      <div class="flex items-center">
        <button
            class="custom-apply-btn"
            @click="router.push('/contracts-create')"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="add"
          >
          Добавить
        </button>

        <button
            class="custom-filter-btn font-medium ml-[16px]"
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
              placeholder="Номер документа"
              label="Номер документа"
              label-class="text-[#7F7D83]"
          />
          <appInput
              placeholder="Поставщик"
              label="Поставщик"
              label-class="text-[#7F7D83]"
          />
          <appInput
              placeholder="Общая сумма контракта"
              label="Общая сумма контракта"
              label-class="text-[#7F7D83]"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <appSelect
              placeholder="Название продукта"
              label="Название продукта"
              label-class="text-[#7F7D83]"
          />
          <appSelect
              placeholder="Количество"
              label="Количество"
              label-class="text-[#7F7D83]"
          />
          <app-input
              placeholder="Ед. измерения"
              label="Ед. измерения"
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
        stripe
        class="custom-element-table"
        highlight-current-row
        @current-change="tableCurrentChange"
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
          prop="numContact"
          label="№ контракта"
      />
      <el-table-column
          prop="supplier"
          label="Поставщик"
      />
      <el-table-column
          prop="typePro"
          label="Тип продукта"
      />
      <el-table-column
          prop="vidPro"
          label="Вид продукта"
      />
      <el-table-column
          prop="count"
          label="Количество"
      />
      <el-table-column
          prop="editing"
          label="Ед. измерения"
      />
      <el-table-column
          prop="sum"
          label="Общая сумма"
      />
      <el-table-column label="Действие">
        <template #default="scope">
          <button
              class="action-btn"
              @click.stop="router.push(`/contracts-view/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
              class="action-btn ml-[8px]"
              @click.stop="actionButton(scope.row)"
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
