<script setup lang="ts">
import { ref } from "vue";
import white from '@/assets/images/filter2.svg'
import filter from '@/assets/images/filter.svg'

const isOpenFilter = ref<boolean>(false)

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <div>

    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">
        Входящие
      </h1>

      <button class="custom-filter-btn font-medium" :class="isOpenFilter ? '!bg-[#2E90FA] !text-white' : ''" @click="isOpenFilter =! isOpenFilter">
        <img :src="isOpenFilter ? white : filter" alt="filter" class="mr-[12px]" />
        Фильтр
      </button>
    </div>

    <el-table :data="tableData" class="mt-[24px]">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name"  />
      <el-table-column prop="address" label="Address" />
    </el-table>

  </div>
</template>
