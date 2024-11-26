<script setup lang="ts">
import { ref } from "vue";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";

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

const tableData2 = ref<TableData[]>([
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
  <!------------------------Мясные---------------------->
  <h2 class="text-dark font-medium text-lg mb-[12px] ml-1">Мясные</h2>

  <el-table
    :data="tableData"
    stripe
    class="custom-element-table"
  >
    <el-table-column
      prop="num"
      label="№"
      width="80"
    />
    <el-table-column
      prop="name"
      label="Название продукта"
    />
    <el-table-column
      prop="count"
      label="Количество"
      width="160"
    />
    <el-table-column
      prop="ed"
      label="Ед. изм"
      width="120"
    />
    <el-table-column
      prop="tzr"
      label="ТЗР"
      width="130"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.tzr"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="nas"
      label="Наценка"
      width="130"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.nas"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="rent"
      label="Рентаб..."
      width="120"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.rent"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="ndc"
      label="НДС"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.ndc"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="summa"
      label="Сумма"
    />
    <el-table-column label="Действие">
      <template #default="scope">
        <button
          v-show="scope.row.isEdit"
          class="action-btn"
          @click="scope.row.isEdit = !scope.row.isEdit"
        >
          <img
            src="@/assets/images/icons/check.svg"
            alt="check"
          />
        </button>

        <button
          v-show="!scope.row.isEdit"
          class="action-btn"
          @click="scope.row.isEdit = !scope.row.isEdit"
        >
          <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
          />
        </button>

        <!--        <button class="action-btn ml-[8px]" v-show="!scope.row.isEdit">-->
        <!--          <img src="@/assets/images/icons/delete.svg" alt="delete" />-->
        <!--        </button>-->

        <button
          class="action-btn ml-[8px]"
          v-show="scope.row.isEdit"
          @click="scope.row.isEdit = false"
        >
          <img
            src="@/assets/images/icons/x.svg"
            alt="x"
          />
        </button>
      </template>
    </el-table-column>
  </el-table>

  <!--------------------Зерновые------------------------->
  <h2 class="text-[#000D24] font-medium text-[18px] mb-[12px] ml-1 mt-[16px]">
    Зерновые
  </h2>
  <el-table
    :data="tableData2"
    stripe
    class="custom-element-table"
  >
    <el-table-column
      prop="num"
      label="№"
      width="80"
    />
    <el-table-column
      prop="name"
      label="Рыбное мясо"
    />
    <el-table-column
      prop="count"
      width="160"
      label="Количество"
    />
    <el-table-column
      prop="ed"
      width="120"
      label="Ед. изм"
    />
    <el-table-column
      prop="tzr"
      width="130"
      label="ТЗР"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.tzr"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="nas"
      width="130"
      label="Наценка"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.nas"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="rent"
      width="120"
      label="Рентаб..."
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.rent"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="ndc"
      label="НДС"
    >
      <template #default="scope">
        <el-input
          style="width: 50px"
          v-model="scope.row.ndc"
          v-if="scope.row.isEdit"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="summa"
      label="Сумма"
    />
    <el-table-column label="Действие">
      <template #default="scope">
        <button
          v-show="scope.row.isEdit"
          class="action-btn"
          @click="scope.row.isEdit = !scope.row.isEdit"
        >
          <img
            src="@/assets/images/icons/check.svg"
            alt="check"
          />
        </button>

        <button
          v-show="!scope.row.isEdit"
          class="action-btn"
          @click="scope.row.isEdit = !scope.row.isEdit"
        >
          <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
          />
        </button>

        <!--        <button class="action-btn ml-[8px]" v-show="!scope.row.isEdit">-->
        <!--          <img src="@/assets/images/icons/delete.svg" alt="delete" />-->
        <!--        </button>-->

        <button
          class="action-btn ml-[8px]"
          v-show="scope.row.isEdit"
          @click="scope.row.isEdit = false"
        >
          <img
            src="@/assets/images/icons/x.svg"
            alt="x"
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
</template>
