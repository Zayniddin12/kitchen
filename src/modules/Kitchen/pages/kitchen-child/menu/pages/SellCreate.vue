<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const num = ref(1);

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    doc: "852369",
    theme: "Доставка мяса",
    send: "Зарафшан",
    receive: "Фонд",
  },
  {
    id: 2,
    num: "2",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
  {
    id: 3,
    num: "3",
    date: "21.08.2024",
    doc: "584534",
    theme: "Доставка лука",
    send: "Навои",
    receive: "Фонд",
  },
  {
    id: 4,
    num: "4",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
]);
</script>

<template>
  <div>
    <span class="mb-[24px] text-[32px] text-[#000D24] font-semibold	block"> {{ route.meta.title ? route.meta.title : ""
      }}</span>

    <div class="bg-[#FFFFFF] border border-[#E2E6F3] rounded-[24px] p-[24px]">

      <div class="flex items-center mb-[24px]">
        <div v-for="item in 7" class="bg-[#F8F9FC] rounded-[16px] p-[12px] mr-[24px]">
          <span class="block text-[18px] text-[#4F5662] font-medium mb-[4px]">Рацион {{ item }}</span>
          <span class="block text-[14px] text-[#8F9194] mb-[4px]">R-0000</span>
          <span class="block text-[14px] text-[#8F9194]">R-0000</span>
        </div>
      </div>

      <div class="mb-[24px]">
        <el-table :data="tableData" class="custom-element-table">
          <el-table-column prop="num" label="Название" />
          <el-table-column prop="date" label="Количество" />
          <el-table-column prop="doc" label="Ед. измерения" />

          <template #append>
            <div class="px-4 py-3.5 flex justify-between items-center ">
              <div class="flex items-center">
                <span class="text-[#8F9194] text-[14px] font-medium mr-[16px]">Количество порции</span>
                <el-input-number v-model="num" :min="1" size="small" @change="handleChange" />
              </div>
              <div class="flex items-center gap-x-8">
                <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            Цена:
                          </span>
                  <strong class="font-semibold text-dark">
                    25 000 сум
                  </strong>
                </div>
                <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            НДС:
                          </span>
                  <strong class="font-semibold text-dark">
                    3 000 сум
                  </strong>
                </div>
                <div class="flex items-center gap-x-1 text-sm">
                          <span class="text-cool-gray">
                            Общая сумма:
                          </span>
                  <strong class="font-semibold text-dark">
                    28 000 сум
                  </strong>
                </div>
              </div>
            </div>
          </template>

        </el-table>


      </div>
      <div class="flex justify-end">
        <button class="custom-apply-btn">Продать</button>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>