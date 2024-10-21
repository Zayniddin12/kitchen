<script setup lang="ts">
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {Search} from "@element-plus/icons-vue";

interface TableData {
  id: number;
  name: string;
  type: string;
}

const {setBreadCrumb} = useBreadcrumb();
const route = useRoute()

const input1 = ref<string>('')
const tableData = ref<TableData[]>([
  {
    id: 1,
    name: "Килограм",
    type: "кг",
  },
  {
    id: 2,
    name: "Тонна",
    type: "тн",
  },
  {
    id: 3,
    name: "Грамм",
    type: "гр",
  },
  {
    id: 4,
    name: "Литр",
    type: "л",
  },
  {
    id: 5,
    name: "Штука",
    type: "шт",
  },
  {
    id: 6,
    name: "Порция",
    type: "кг",
  },
  {
    id: 7,
    name: "Банка",
    type: "кг",
  },
  {
    id: 8,
    name: "Упаковка",
    type: "кг",
  },
  {
    id: 9,
    name: "Пачка",
    type: "кг",
  },
  {
    id: 10,
    name: "Рулон",
    type: "кг",
  },
  {
    id: 10,
    name: "Человек",
    type: "кг",
  },
  {
    id: 10,
    name: "Количество людей",
    type: "кг",
  },
]);

onMounted(() => {
  setBreadCrumbFn()
})

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
      to: 'reference'
    },
    {
      label: "Единицы измерения",
      isActionable: true,
    },
  ]);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

      <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
          class="w-[300px] mr-[16px]"
      />
    </div>

    <el-table :data="tableData" stripe class="custom-element-table mt-[24px]">
      <el-table-column prop="id" label="№" width="80" :class-name="'tableHeadClass'"/>
      <el-table-column prop="name" label="Наименование единиц измерения" sortable width="400" :class-name="'tableHeadClass'"/>
      <el-table-column prop="type" label="Сокращение единиц" sortable :class-name="'tableHeadClass'"/>
    </el-table>
  </div>
</template>

