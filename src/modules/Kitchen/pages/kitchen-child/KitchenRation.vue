<script
  setup
  lang="ts"
>

import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { useI18n } from "vue-i18n";
import { setTableColumnIndex } from "../../../../utils/helper";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import { PaginationType } from "@/types/pagination.type";

const settingsStore = useSettingsStore();
const kitchenStore = useKitchenStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const { t } = useI18n();

const params = ref({
  per_page: 100,
  kitchen_id: route.params.child_id,
});

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
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
      label: "kitchen.ration",
      isTranslate: true,
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
        {{ t("kitchen.ration") }}
      </h1>
      <ElTable
        :data="settingsStore.rationList.rations"
        stripe
        class="mt-6 custom-element-table custom-element-table-normal kitchen-ration__table"
        :empty-text="t('common.empty')"
      >
        <ElTableColumn
          prop="id"
          label="№"
          :width="80"
        >
          <template #default="{$index}">
            {{ setTableColumnIndex($index, params.page, settingsStore.rationList.pagination?.per_page ?? 0) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="type"
          :label="t('kitchen.rationType')"
          sortable
          align="center"
          :width="200"
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
          :label="t('common.uniqueNumber')"
          sortable
          align="center"
          :width="200"
        />
        <ElTableColumn
          prop="net_price"
          :label="t('common.price')"
          sortable
          align="center"
          :width="200"
        >
          <template #default="{row}">
            {{ row.net_price && row.net_price.toLocaleString() }} {{ t("currency.sum") }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="vat"
          :label="t('common.ndc')"
          sortable
          align="center"
          :width="200"
        >
          <template #default="{row}">
            {{ row.vat && row.vat.toLocaleString() }} {{ t("currency.sum") }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="price"
          :label="t('common.sum')"
          sortable
          align="center"
          :width="200"
        >
          <template #default="{row}">
            {{ row.price && row.price.toLocaleString() }} {{ t("currency.sum") }}
          </template>
        </ElTableColumn>
      </ElTable>
      <AppPagination
        v-if="settingsStore.rationList"
        v-model="params.page"
        :pagination="settingsStore.rationList.pagination as PaginationType"
        class="mt-6"
      />
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