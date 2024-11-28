<script
  setup
  lang="ts"
>

import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";

const settingsStore = useSettingsStore();
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

const params = ref({
  page: 1,
  per_page: 10,
});

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: "Рационы",
      isActionable: true,
    },
  ]);
};

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });

  setBreadCrumbFn();
}, { immediate: true });


const refresh = async () => {
  await settingsStore.GET_RATION_LIST(params.value);
};

onMounted(() => {
  refresh();
});

watchEffect(() => {
  setBreadCrumbFn();
});

const changePage = () => {
  refresh();
};
</script>

<template>
  <section class="kitchen-ration">
    <div>
<!--      {{ settingsStore.rationList }}-->
      <h1 class="font-semibold text-[32px] text-dark">
        Рационы
      </h1>
      <ElTable
        :data="settingsStore.rationList.rations"
        stripe
        class="mt-6 custom-element-table custom-element-table-normal kitchen-ration__table"
      >
        <ElTableColumn
          prop="id"
          label="№"
          :width="150"
        >
          <template #default="{row,$index}">
            <span>{{ $index + 1}}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="type"
          label="Тип рациона"
          sortable
          align="center"
        >
          <template #default="{row,$index}">
            <ElDropdown
              placement="bottom"
              class="kitchen-ration__table__dropdown"
            >
              {{ row.name }}
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
          prop="number"
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
          Показано {{ params.page }}–{{ params.per_page }} из 100 результатов
        </div>
        <el-pagination
          v-model:current-page="params.page"
          @current-change="changePage"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="settingsStore.rationList.pagination?.total_count"
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