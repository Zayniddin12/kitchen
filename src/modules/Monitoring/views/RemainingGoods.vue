<script setup lang="ts">
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed } from "vue";

const tableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: "№",
      prop: "num",
    },
    {
      label: "Название продукта",
      prop: "product_name",
    },
    {
      label: "Ед. изм",
      prop: "measurement",
    },
    {
      label: "КП РУ Зарафшон",
      prop: "kp_zarafshon",
    },
    {
      label: "КП РУ Навои",
      prop: "kp_navoi",
    },
    {
      label: "КП РУ Нуробод",
      prop: "kp_nurobod",
    },
    {
      label: "КП РУ Учкудук",
      prop: "kp_uchkuduk",
    },
    {
      label: "КП РУ Зафаробод",
      prop: "kp_zafarobod",
    },
    {
      label: "по Фонду НГМК",
      prop: "fund",
    },
  ];
});

const tableData = computed(() => {
  return [
    {
      id: 1,
      num: 1,
      product_name: "Масло подсол...",
      measurement: "шт",
      kp_zarafshon: 50,
      kp_navoi: 45,
      kp_nurobod: 21,
      kp_uchkuduk: 51,
      kp_zafarobod: 52,
      fund: 219,
    },
    {
      id: 2,
      num: 2,
      product_name: "Сахар",
      measurement: "тн",
      kp_zarafshon: 80,
      kp_navoi: 69,
      kp_nurobod: 18,
      kp_uchkuduk: 65,
      kp_zafarobod: 45,
      fund: 200,
    },
    {
      id: 3,
      num: 3,
      product_name: "Молоко сухое",
      measurement: "шт",
      kp_zarafshon: 50,
      kp_navoi: 45,
      kp_nurobod: 21,
      kp_uchkuduk: 51,
      kp_zafarobod: 52,
      fund: 219,
    },
    {
      id: 4,
      num: 4,
      product_name: "Картофель ",
      measurement: "тн",
      kp_zarafshon: 80,
      kp_navoi: 69,
      kp_nurobod: 18,
      kp_uchkuduk: 65,
      kp_zafarobod: 45,
      fund: 200,
    },
    {
      id: 5,
      num: 5,
      product_name: "Масло подсол...",
      measurement: "шт",
      kp_zarafshon: 50,
      kp_navoi: 45,
      kp_nurobod: 21,
      kp_uchkuduk: 51,
      kp_zafarobod: 52,
      fund: 219,
    },
    {
      id: 6,
      num: 6,
      product_name: "Сахар",
      measurement: "тн",
      kp_zarafshon: 80,
      kp_navoi: 69,
      kp_nurobod: 18,
      kp_uchkuduk: 65,
      kp_zafarobod: 45,
      fund: 200,
    },
    {
      id: 7,
      num: 7,
      product_name: "Молоко сухое",
      measurement: "шт",
      kp_zarafshon: 50,
      kp_navoi: 45,
      kp_nurobod: 21,
      kp_uchkuduk: 51,
      kp_zafarobod: 52,
      fund: 219,
    },
    {
      id: 8,
      num: 8,
      product_name: "Картофель ",
      measurement: "тн",
      kp_zarafshon: 80,
      kp_navoi: 69,
      kp_nurobod: 18,
      kp_uchkuduk: 65,
      kp_zafarobod: 45,
      fund: 200,
    },
  ];
}) as Record<string, any>[];
</script>

<template>
  <section class="remaining-goods">
    <div>
      <div class="flex justify-between items-start gap-5">
        <h1 class="font-semibold text-[32px] text-dark">Остатка товаров</h1>
        <div class="grid grid-cols-4 gap-2 max-w-[645px]">
          <AppDatePicker
            format="DD.MM.YYYY"
            size="large"
          />
          <AppDatePicker
            format="DD.MM.YYYY"
            size="large"
          />
          <ElDropdown placement="bottom">
            <ElButton
              size="large"
              class="h-12 !bg-white-blue !border-white-blue"
            >
              <div class="flex items-center gap-x-2">
                <img
                  src="@/assets/images/download.svg"
                  class="size-5"
                />
                <span class="font-medium text-dark-gray">Скачать</span>
              </div>
            </ElButton>
            <template #dropdown>
              <ElDropdownMenu class="p-3">
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5 bg-white sha"
                >
                  <img
                    src="@/assets/images/icons/pdf.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  PDF файл
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
          <ElButton
            size="large"
            class="h-12 !bg-white-blue !border-white-blue !ml-0"
          >
            <div class="flex items-center gap-x-2">
              <img
                src="@/assets/images/icons/share.svg"
                class="size-5"
              />
              <span class="font-medium text-dark-gray">Поделиться</span>
            </div>
          </ElButton>
        </div>
      </div>
      <ElTable
        :data="tableData"
        class="custom-element-table"
      >
        <ElTableColumn
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        />
      </ElTable>
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-cool-gray">
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
  </section>
</template>
