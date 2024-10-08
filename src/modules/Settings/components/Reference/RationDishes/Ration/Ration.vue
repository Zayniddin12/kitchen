<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface TableData {
  id: number;
  name: string;
  unique: string;
  type: string;
  duration: string;
}

const router = useRouter()

const tableData = ref<TableData>([
  {
    id: 1,
    name: 'Рацион 1',
    unique: 'R-00000',
    type: 'ЛПП, Буфет, Кухня',
    duration: '7 дней ',
  },
  {
    id: 2,
    name: 'Рацион 2',
    unique: 'R-00000',
    type: 'ЛПП, Буфет, Кухня',
    duration: '7 дней ',
  },
  {
    id: 3,
    name: 'Рацион 3',
    unique: 'R-00000',
    type: 'ЛПП, Буфет, Кухня',
    duration: '7 дней ',
  },
  {
    id: 4,
    name: 'Рацион 4',
    unique: 'R-00000',
    type: 'ЛПП, Буфет, Кухня',
    duration: '7 дней ',
  },
  {
    id: 5,
    name: 'Рацион 5',
    unique: 'R-00000',
    type: 'ЛПП, Буфет, Кухня',
    duration: '7 дней ',
  },
]);
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Рационы</h1>

      <div class="flex items-center">
        <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
          class="w-[300px]"
        />

        <button class="custom-apply-btn ml-[16px]" @click="router.push('/reference-ration-create')">
          <img src="@/assets/images/icons/plus.svg" alt="plus" />
          Добавить
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table :data="tableData" class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование рациона" sortable/>
        <el-table-column prop="unique" label="Уникальный номер" sortable/>
        <el-table-column prop="type" label="Тип кухни" sortable/>
        <el-table-column prop="duration" label="Длительность" sortable/>
        <el-table-column label="Действие" align="right">
          <template #default="scope">
            <button class="action-btn" @click="router.push(`/reference-ration-view/${scope.row.id}`)">
              <img src="@/assets/images/eye.svg" alt="eye" />
            </button>

            <button class="action-btn ml-[8px]" @click="router.push(`/reference-ration-edit/${scope.row.id}`)">
              <img src="@/assets/images/icons/edit.svg" alt="edit" />
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
