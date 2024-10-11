<script
  setup
  lang="ts"
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, watchEffect } from "vue";

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const { setBreadCrumb } = useBreadcrumb();

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
      link: { name: "monitoring.remainingGoods.district", params: { id: 1 } },
    },
    {
      label: "КП РУ Навои",
      prop: "kp_navoi",
      link: { name: "monitoring.remainingGoods.district", params: { id: 2 } },
    },
    {
      label: "КП РУ Нуробод",
      prop: "kp_nurobod",
      link: { name: "monitoring.remainingGoods.district", params: { id: 3 } },
    },
    {
      label: "КП РУ Учкудук",
      prop: "kp_uchkuduk",
      link: { name: "monitoring.remainingGoods.district", params: { id: 4 } },
    },
    {
      label: "КП РУ Зафаробод",
      prop: "kp_zafarobod",
      link: { name: "monitoring.remainingGoods.district", params: { id: 5 } },
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
});

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Мониторинг",
    },
    {
      label: "Остатка товаров",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

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
          <ElDropdown
            placement="bottom"
            class="block w-full"
          >
            <ElButton
              size="large"
              class="h-12 !bg-white-blue w-full !border-white-blue"
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
              <ElDropdownMenu class="p-3 rounded-lg">
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/pdf.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    PDF файл
                  </span>
                </ElDropdownItem>
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/excel.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    Excel файл
                  </span>
                </ElDropdownItem>
                <ElDropdownItem
                  class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
                >
                  <img
                    src="@/assets/images/icons/1c.svg"
                    alt="pdf"
                    class="w-[13px] h-[17px]"
                  />
                  <span class="text-sm text-dark-gray font-medium">
                    1C файл
                  </span>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
          <ElButton
            size="large"
            class="h-12 !bg-white-blue !border-white-blue"
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
          type="button"
          :key="column.prop"
          :prop="column.prop"
        >
          <template #header>
            <RouterLink
              v-if="!!column?.link"
              :to="column.link"
            >
              {{ column.label }}
            </RouterLink>
            <template v-else>
              {{ column.label }}
            </template>
          </template>
        </ElTableColumn>
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
