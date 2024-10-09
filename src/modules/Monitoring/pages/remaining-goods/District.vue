<script
  setup
  lang="ts"
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, onMounted } from "vue";
import NotFoundPage from "@/components/errors/404.vue";
import { useDistrictStore } from "@/modules/Monitoring/store/district.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const districtStore = useDistrictStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const tableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: "№",
      prop: "num",
      width: 80,
      sortable: false,
    },
    {
      label: "Название продукта",
      prop: "product_name",
      width: 220,
      sortable: true,
    },
    {
      label: "Ед. изм",
      width: 170,
      prop: "unit_measurement",
      sortable: true,
    },
    {
      label: "Ёшлар",
      prop: "department_1",
      width: 170,
      sortable: true,
    },
    {
      label: "Високоволтнй",
      prop: "department_2",
      width: 180,
      sortable: true,
    },
    {
      label: "Табассум",
      prop: "department_3",
      width: 165,
      sortable: true,
    },
    {
      label: "Мойбулоқ",
      prop: "department_4",
      width: 165,
      sortable: true,
    },
    {
      label: "Ёғду",
      prop: "department_5",
      sortable: true,
    },
    {
      label: "Паҳлавон",
      prop: "department_6",
      sortable: true,
    },
    {
      label: "по КП РУ Навои",
      prop: "all",
      sortable: true,
    },
  ];
});

const tableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 10; i++) {
    const data = {
      num: i + 1,
      product_name: "Масло подсол...",
      unit_measurement: Math.round(1 + Math.random()) === 1 ? "шт" : "тн",
      department_1: Math.floor(Math.random() * 51) + 50,
      department_2: Math.floor(Math.random() * 51) + 50,
      department_3: Math.floor(Math.random() * 51) + 50,
      department_4: Math.floor(Math.random() * 51) + 50,
      department_5: Math.floor(Math.random() * 51) + 50,
      department_6: Math.floor(Math.random() * 51) + 50,
      all: Math.floor(Math.random() * 501) + 50,
    };

    dataList.push(data);
  }

  return dataList;
});

const setBreadCrumbFn = () => {
  districtStore.getDistrict(+route.params.id);

  if (!districtStore.district) return;

  setBreadCrumb([
    {
      label: "Мониторинг",
      to: { name: "monitoring.remainingGoods.index" },
    },
    {
      label: "КП РУ Навои",
    },
    {
      label: districtStore.district.name,
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section v-if="districtStore.district">
    <div>
      <div class="flex justify-between items-start gap-5">
        <h1 class="font-semibold text-[32px] text-dark">
          {{ districtStore.district.name }}
        </h1>
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
          :key="column.prop"
          :width="column?.width ?? ''"
          :sortable="!!column.sortable"
          :prop="column.prop"
        >
          <template #header>
            <strong class="font-medium">
              {{ column.label }}
            </strong>
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
  <NotFoundPage
    v-else
    class="!h-[70vh]"
  />
</template>
