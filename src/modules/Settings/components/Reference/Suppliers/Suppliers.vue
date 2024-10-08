<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

interface TableData {
  id: number;
  name: string;
  type: string;
}

const input1 = ref<string>("");
const tableData = ref<TableData[]>([
  {
    id: 1,
    name: "Зарафшан",
    inn: "123456789012",
    legal_address: "100052, Tashkent, st.Kichik Khalka Yuli 34-36",
    oked: "54569",
  },

  {
    id: 2,
    name: "Зарафшан",
    inn: "123456789012",
    legal_address: "100052, Tashkent, st.Kichik Khalka Yuli 34-36",
    oked: "54569",
  },

  {
    id: 3,
    name: "Зарафшан",
    inn: "123456789012",
    legal_address: "100052, Tashkent, st.Kichik Khalka Yuli 34-36",
    oked: "54569",
  },
  {
    id: 4,
    name: "Зарафшан",
    inn: "123456789012",
    legal_address: "100052, Tashkent, st.Kichik Khalka Yuli 34-36",
    oked: "54569",
  },

]);
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
          @click="$router.push({name: 'reference-suppliers-add'})"
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
      <el-table :data="tableData" class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование" sortable width="400" />
        <el-table-column prop="inn" label="ИНН" sortable />
        <el-table-column prop="legal_address" label="Юр. адрес" sortable />
        <el-table-column prop="oked" label="ОКЭД" sortable />
        <el-table-column label="Действие" align="right">
          <template #default="scope">
            <button class="action-btn mr-[8px]"
                    @click="$router.push({name: 'reference-suppliers-view', query: {type: 'view'}, params: {id: 1}})">
              <img src="../../../../../assets/images/eye.svg" alt="download" />
            </button>

            <button class="action-btn"
                    @click="$router.push({name: 'reference-suppliers-edit', params: {id: 1}})">
              <img src="../../../../../assets/images/icons/edit.svg" alt="eye" />
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

