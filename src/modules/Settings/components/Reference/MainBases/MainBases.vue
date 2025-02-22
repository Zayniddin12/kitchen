<script
  setup
  lang="ts"
>
import { onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {
  BaseWarehouseListType,
  BaseWarehousesParamsType,
} from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";
import { watchDebounced } from "@vueuse/core";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";
import { FoodFactoryListType } from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const form = reactive<BaseWarehousesParamsType>({
  search: "",
  page: null,
});

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },

    {
      label: "Управ, комбинаты и склады",
      to: { name: "reference" },
    },

    {
      label: "Склады базы",
      isActionable: true,
    },
  ]);
};

const fetchBaseWareHouses = async () => {
  const page: number = parseInt(route.query.page as string);

  if (!isNaN(page)) form.page = page;
  form.search = route.query.search as string ?? "";

  await settingsStore.fetchBaseWarehouses(filterObjectValues(form));

  if (!settingsStore.baseWarehouses) return;
  form.page = settingsStore.baseWarehouses.paginator.current_page as number;
};

onMounted(() => {
  setBreadCrumbFn();
});

watch(route, () => {
  fetchBaseWareHouses();
}, { immediate: true });

watchDebounced(() => form.search, () => {
  router.replace({ query: { search: form.search } });
}, { debounce: 1000, maxWait: 5000 });

const changePage = () => {
  router.replace({ query: { ...route.query, page: form.page } });
};

const tableCurrentChange = (value: Record<string, any>) => {
  router.push({ name: "reference-main-bases-view", params: { id: value.id } });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>

      <div class="flex items-center">
        <el-input
          v-model="form.search"
          :placeholder="$t('form.search')"
          :prefix-icon="Search"
          class="w-[300px] mr-4"
        />

        <RouterLink
          v-if="$can('create', 'Button')"
          :to="{name: 'reference-main-bases-add'}"
          class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <span
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
          />
          {{$t('method.add')}}
        </RouterLink>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
        v-loading="settingsStore.baseWarehousesLoading"
        :data="settingsStore.baseWarehouses?.base_warehouses ?? []"
        stripe
        highlight-current-row
        @current-change.self="tableCurrentChange"
        class="custom-element-table"
      >
        <el-table-column
          prop="idx"
          label="№"
          width="80"
        >
          <template
            #default="{$index}"
            v-if="settingsStore.baseWarehouses"
          >
            {{ setTableColumnIndex($index, form.page || 1, settingsStore.baseWarehouses?.paginator.per_page || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('Наименование склада')"
          :width="200"
        >

        </el-table-column>
        <el-table-column
          prop="base"
          :label="$t('База складов')"
          :width="200"
        />
        <el-table-column
          prop="capacity"
          :label="$t('Вместимость склада')"
          :width="200"
        />
        <el-table-column
          prop="products"
          :label="$t('Продукты хранения')"
          :width="200"
        >
          <template #default="{row}:{row:BaseWarehouseListType}">
            {{ row.products.map(item => item.name).join(", ") }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.action')"
          align="right"
          :width="200"
        >
          <template #default="{row}">
            <div class="inline-flex items-center gap-x-2">
              <RouterLink
                v-if="$can('read', 'Button')"
                class="action-btn"
                :to="{name: 'reference-main-bases-view', params: {id: row.id}}"
              >
                <img
                  src="@/assets/images/eye.svg"
                  alt="download"
                />
              </RouterLink>

              <RouterLink
                v-if="$can('update', 'Button')"
                :to="{name: 'reference-main-bases-edit', params: {id: row.id}}"
                class="action-btn"
              >
                <img
                  src="@/assets/images/icons/edit.svg"
                  alt="eye"
                />
              </RouterLink>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="settingsStore.baseWarehouses && settingsStore.baseWarehouses.paginator.pages_count>1"
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-cool-gray text-[14px]">
          Показано {{ form.page }}–{{ form.per_page }} из {{ settingsStore.baseWarehouses.paginator.pages_count }} результатов
        </div>

        <el-pagination
          v-model:current-page="form.page"
          @current-change="changePage"
          :page-size="form.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="settingsStore.baseWarehouses.paginator.total_count"
        />
      </div>
    </div>
  </div>
</template>

