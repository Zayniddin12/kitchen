<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Name {
  uz: string;
  ru: string;
}
interface TableData {
  id: number,
  name: Name,
  type: string,
  photo: string,
}

const router = useRouter()

const input1 = ref<string>("");
const tableData = ref<TableData[]>([
  {
    id: 1,
    photo: '',
    name: {
      uz: 'Куриное мясо',
      ru: 'Куриное мясо',
    },
    type: "Мясные",
  },
  {
    id: 2,
    photo: '',
    name: {
      uz: 'рис',
      ru: 'рис',
    },
    type: "Зерновые",
  },
  {
    id: 3,
    photo: '',
    name: {
      uz:'Помидор',
      ru:'Помидор',
    },
    type: "Овощи",
  },
  {
    id: 4,
    photo: '',
    name: {
      uz: 'Молоко',
      ru: 'Молоко',
    },
    type: "Мясные",
  },
  {
    id: 5,
    photo: '',
    name: {
      uz: 'Пепси',
      ru: 'Пепси',
    },
    type: "Напитки",
  },
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Виды продуктов",
      to: { name: "reference" },
    },
    {
      label: "Типы продуктов",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Виды продуктов</h1>

      <div class="flex items-center">
        <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
          class="w-[300px]"
        />

        <button class="custom-apply-btn ml-[16px]" @click="router.push('/reference-vid-add')">
          <img src="../../../../../../assets/images/icons/plus.svg" alt="plus" />
          Добавить
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table :data="tableData" class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="photo" label="Картинка вида продукта" sortable>
          <template #default="scope"><img src="https://avatar.iran.liara.run/public" alt="#" class="h-[32px]"/></template>
        </el-table-column>
        <el-table-column prop="name" label="Наименование вида продукта" sortable>
          <template #default="scope">
            {{ scope.row?.name?.[$i18n.locale] }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Тип продукта" sortable/>
        <el-table-column label="Действие" align="right">
          <template #default="scope">
            <button class="action-btn" @click="router.push(`/reference-view-edit/${scope.row.id}`)">
              <img src="../../../../../../assets/images/eye.svg" alt="eye" />
            </button>

            <button class="action-btn ml-[8px]" @click="router.push(`/reference-vid-edit/${scope.row.id}`)">
              <img src="../../../../../../assets/images/icons/edit.svg" alt="edit" />
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
