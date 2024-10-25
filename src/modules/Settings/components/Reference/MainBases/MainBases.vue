<script
    setup
    lang="ts"
>
import { onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { BaseWarehousesParamsType } from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";
import { watchDebounced } from "@vueuse/core";
import { filterObjectValues } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const form = reactive<BaseWarehousesParamsType>({
  search: "",
  page: null
});

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки"
    },
    {
      label: "Справочники",
      to: { name: "reference" }
    },

    {
      label: "Управ, комбинаты и склады",
      to: { name: "reference" }
    },

    {
      label: "Склады базы",
      isActionable: true
    }
  ]);
};

const fetchBaseWareHouses = async () => {
  const perPage = parseInt(route.query.per_page);
  const page = parseInt(route.query.page);

  if (!isNaN(perPage)) form.per_page = perPage;
  if (!isNaN(page)) form.page = page;
  form.search = route.query.search ?? "";

  await settingsStore.fetchBaseWarehouses(filterObjectValues(form));

  if (!settingsStore.baseWarehouses) return;
  form.page = settingsStore.baseWarehouses.paginator.current_page;
  form.per_page = settingsStore.baseWarehouses.paginator.per_page;
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


</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

      <div class="flex items-center">
        <el-input
            v-model="form.search"
            placeholder="Поиск"
            :prefix-icon="Search"
            class="w-[300px] mr-4"
        />

        <RouterLink
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
          ></span>
          Добавить
        </RouterLink>

        <button>

        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
          v-loading="settingsStore.baseWarehousesLoading"
          :data="settingsStore.baseWarehouses?.base_warehouses ?? []"
          stripe
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
            {{
              form.page > 1 ? settingsStore.baseWarehouses.paginator.per_page * (form.page - 1) + $index + 1 : $index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="Наименование склада"
            sortable
            width="400"
        />
        <el-table-column
            prop="base"
            label="База складов"
            sortable
        />
        <el-table-column
            prop="capacity"
            label="Вместимость склада"
            sortable
        />
        <el-table-column
            prop="storage_products"
            label="Продукты хранения"
            sortable
        />
        <el-table-column
            label="Действие"
            align="right"
        >
          <template #default="{row}">
            <div class="inline-flex items-center gap-x-2">
              <RouterLink
                  class="action-btn"
                  :to="{name: 'reference-main-bases-view', params: {id: row.id}}"
              >
                <img
                    src="@/assets/images/eye.svg"
                    alt="download"
                />
              </RouterLink>

              <RouterLink
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
          Показано {{ form.page }}–{{ form.per_page }} из {{ settingsStore.baseWarehouses.paginator.pages_count }}
          результатов
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

