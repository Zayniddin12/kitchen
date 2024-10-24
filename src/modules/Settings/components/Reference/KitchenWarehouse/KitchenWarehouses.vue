<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();

interface TableData {
  id: number;
  name: string;
  type: string;
}

const input1 = ref<string>("");
const tableData = ref<any>([
  {
    id: 1,
    name: "Ёшлар",
    type_base: "Зарафшан",
    total: "10 тонна",
    sum: "200",
    type_kitchen: "Профилакторий",
  },
  {
    id: 2,
    name: "Ёшлар",
    type_base: "Зарафшан",
    total: "10 тонна",
    sum: "200",
    type_kitchen: "Профилакторий",
  },
  {
    id: 3,
    name: "Ёшлар",
    type_base: "Зарафшан",
    total: "10 тонна",
    sum: "200",
    type_kitchen: "Профилакторий",
  },
  {
    id: 4,
    name: "Ёшлар",
    type_base: "Зарафшан",
    total: "10 тонна",
    sum: "200",
    type_kitchen: "Профилакторий",
  },
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },

    {
      label: "Управ, комбинаты и склады",
      to: { name: "reference" },
    },

    {
      label: "Склады кухни",
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
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

      <div class="flex items-center">
        <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
          class="w-[300px] mr-[16px]"
        />

        <button
          @click="$router.push({name: 'reference-kitchen-warehouse-add'})"
          class="flex items-center justify-center gap-3 custom-apply-btn">
          <li
            :style="{
                  maskImage: 'url(/icons/plusIcon.svg)',
                  backgroundColor: '#fff',
                  color: '#fff',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          ></li>
          Добавить
        </button>

        <button>

        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table :data="tableData" stripe class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование" sortable />
        <el-table-column prop="type_base" label="База складов" sortable />
        <el-table-column prop="total" label="Вмес. склада" sortable />
        <el-table-column prop="sum" label="Вмес. кухни" sortable />
        <el-table-column prop="type_kitchen" label="Тип кухни" sortable />
        <el-table-column label="Действие" align="right">
          <template #default="scope">
            <button class="action-btn mr-[8px]"
                    @click="$router.push({name: 'reference-kitchen-warehouse-view', query: {type: 'view'}, params: {id: 1}})">
              <img src="../../../../../assets/images/eye.svg" alt="download" />
            </button>

            <button class="action-btn"
                    @click="$router.push({name: 'reference-kitchen-warehouse-edit', params: {id: 1}})">
              <img src="../../../../../assets/images/icons/edit.svg" alt="eye" />
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

