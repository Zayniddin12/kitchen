<script setup lang="ts">
import { ref } from "vue";

interface TableData {
  id: number;
  num: string;
  name: string;
  count: string;
  ed: string;
  tzr: string;
  nas: string;
  rent: string;
  ndc: string;
  summa: string;
}

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    name: "Говядина",
    count: "85",
    ed: "кг",
    tzr: "7%",
    nas: "13%",
    rent: "11%",
    ndc: "12%",
    summa: "6 400 000 сум",
  },
  {
    id: 1,
    num: "1",
    name: "Говядина",
    count: "85",
    ed: "кг",
    tzr: "7%",
    nas: "13%",
    rent: "11%",
    ndc: "12%",
    summa: "6 400 000 сум",
  },
  {
    id: 1,
    num: "1",
    name: "Говядина",
    count: "85",
    ed: "кг",
    tzr: "7%",
    nas: "13%",
    rent: "11%",
    ndc: "12%",
    summa: "6 400 000 сум",
  },
  {
    id: 1,
    num: "1",
    name: "Говядина",
    count: "85",
    ed: "кг",
    tzr: "7%",
    nas: "13%",
    rent: "11%",
    ndc: "12%",
    summa: "6 400 000 сум",
  },
]);
</script>

<template>
  <el-table :data="tableData" class="custom-element-table">
    <el-table-column prop="num" label="№" />
    <el-table-column prop="name" label="Название продукта" />
    <el-table-column prop="count" label="Количество" />
    <el-table-column prop="ed" label="Ед. изм" />
    <el-table-column prop="tzr" label="ТЗР">
      <template #default="scope">
        <el-input style="width: 50px" v-model="scope.row.tzr" v-if="scope.row.isEdit"/>
      </template>
    </el-table-column>
    <el-table-column prop="nas" label="Наценка">
      <template #default="scope">
        <el-input style="width: 50px" v-model="scope.row.nas" v-if="scope.row.isEdit" />
      </template>
    </el-table-column>
    <el-table-column prop="rent" label="Рентаб...">
      <template #default="scope">
        <el-input style="width: 50px" v-model="scope.row.rent" v-if="scope.row.isEdit"/>
      </template>
    </el-table-column>
    <el-table-column prop="ndc" label="НДС">
      <template #default="scope">
        <el-input style="width: 50px" v-model="scope.row.ndc" v-if="scope.row.isEdit"/>
      </template>
    </el-table-column>
    <el-table-column prop="summa" label="Сумма" />
    <el-table-column label="Действие">
      <template #default="scope">
        <button v-show="scope.row.isEdit" class="action-btn" @click="scope.row.isEdit =! scope.row.isEdit">
          <img src="@/assets/images/icons/check.svg" alt="check" />
        </button>

        <button v-show="!scope.row.isEdit" class="action-btn" @click="scope.row.isEdit =! scope.row.isEdit">
          <img src="@/assets/images/icons/edit.svg" alt="edit" />
        </button>

        <button class="action-btn ml-[8px]" v-show="!scope.row.isEdit">
          <img src="@/assets/images/icons/delete.svg" alt="delete" />
        </button>

        <button class="action-btn ml-[8px]" v-show="scope.row.isEdit" @click="scope.row.isEdit = false">
          <img src="@/assets/images/icons/x.svg" alt="x" />
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
</template>
