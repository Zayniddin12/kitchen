<script setup lang="ts">
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed } from "vue";
import { useRoute } from "vue-router";
import NotFoundPage from "@/components/errors/404.vue";

const route = useRoute();

interface DistrictType {
  id: number;
  name: string;
}

const districts = computed<DistrictType[]>(() => {
  return [
    {
      id: 1,
      name: "КП РУ Зарафшон",
    },
    {
      id: 2,
      name: "КП РУ Навои",
    },
    {
      id: 3,
      name: "КП РУ Нуробод",
    },
    {
      id: 4,
      name: "КП РУ Учкудук",
    },
    {
      id: 5,
      name: "КП РУ Зафаробод",
    },
  ];
});

const activeDistrict = computed<DistrictType | undefined>(() => {
  return districts.value.find((el: DistrictType) => el.id === +route.params.id);
});

const tableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: "№",
      prop: "num",
    },
  ];
});

const tableData = computed(() => {
  return [];
}) as Record<string, any>[];
</script>

<template>
  <section
    class="remaining-goods"
    v-if="activeDistrict"
  >
    <div>
      <div class="flex justify-between items-start gap-5">
        <h1 class="font-semibold text-[32px] text-dark">
          {{ activeDistrict.name }}
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
          type="button"
          :key="column.prop"
          :prop="column.prop"
        >
          <template #header>
            <RouterLink
              v-if="!!column.link"
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
  <NotFoundPage
    v-else
    class="!h-[70vh]"
  />
</template>
