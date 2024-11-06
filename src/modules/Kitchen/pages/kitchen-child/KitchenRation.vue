<script
  setup
  lang="ts"
>

import { computed, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const kitchenStore = useKitchenStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

interface TableDataType {
  id: number;
  idx: number;
  type: string;
  unique_number: string;
  price: string;
  nd_price: string;
  sum: string;
}

const tableData = computed<TableDataType[]>(() => {
  const data: TableDataType[] = [];

  for (let i = 1; i <= 12; i++) {
    data.push({
      id: i,
      idx: i,
      type: `Рацион ${i}`,
      unique_number: "R-00000",
      price: "25 000 сум",
      nd_price: "3 000 сум",
      sum: "28 000 сум",
    });
  }

  return data;
});

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.name,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: "Лагерь",
      to: { name: "KitchenShowIndex" },
    },
    {
      label: "Паҳлавон",
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: "Рационы",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <section class="kitchen-ration">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Рационы
      </h1>
      <ElTable
        :data="tableData"
        stripe
        class="mt-6 custom-element-table custom-element-table-normal kitchen-ration__table"
      >
        <ElTableColumn
          prop="idx"
          label="№"
          :width="150"
        />
        <ElTableColumn
          prop="type"
          label="Тип рациона"
          sortable
          align="center"
        >
          <template #default="{row}: {row: TableDataType}">
            <ElDropdown
              placement="bottom"
              class="kitchen-ration__table__dropdown"
            >
              {{ row.type }}
              <template #dropdown>
                <ElDropdownMenu class="min-w-[140px] p-4 rounded-lg bg-white flex flex-col gap-y-3">
                  <div class="text-sm flex gap-x-2 w-full">
                    <span class="text-dark-gray w-[55%] inline-block">
                      Кабачки
                    </span>
                    <span class="text-[#A8AAAE]">
                      0.8 кг
                    </span>
                  </div>
                  <div class="text-sm flex gap-x-2 w-full">
                    <span class="text-dark-gray w-[55%] inline-block">
                      Хлеб
                    </span>
                    <span class="text-[#A8AAAE]">
                      0.8 кг
                    </span>
                  </div>
                  <div class="text-sm flex gap-x-2 w-full">
                    <span class="text-dark-gray w-[55%] inline-block">
                      Компот
                    </span>
                    <span class="text-[#A8AAAE]">
                      0.8 кг
                    </span>
                  </div>
                  <div class="text-sm flex gap-x-2 w-full">
                    <span class="text-dark-gray w-[55%] inline-block">
                      Яйцо
                    </span>
                    <span class="text-[#A8AAAE]">
                      0.8 кг
                    </span>
                  </div>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="unique_number"
          label="Уникальный номер"
          sortable
          align="center"
        />
        <ElTableColumn
          prop="price"
          label="Цена"
          sortable
          align="center"
        />
        <ElTableColumn
          prop="nd_price"
          label="НДС"
          sortable
          align="center"
        />
        <ElTableColumn
          prop="sum"
          label="Сумма"
          sortable
          align="center"
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

<style lang="scss">
.kitchen-ration {

  &__table {

    &__dropdown {
      .el-tooltip__trigger:hover {
        outline: unset !important;
      }
    }
  }
}
</style>