<script
  setup
  lang="ts"
>
import { onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import {
  FoodFactoriesParamsType, FoodFactoryListType,
} from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import { watchDebounced } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const form = reactive<FoodFactoriesParamsType>({
  page: null,
  per_page: null,
  search: "",
});

const settingsStore = useSettingsStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
      isActionable: false,
    },
    {
      label: "Справочники",
      isActionable: false,
      to: { name: "reference" },
    },

    {
      label: "Управ, комбинаты и склады",
      isActionable: false,
      to: { name: "reference" },
    },

    {
      label: "Комбинаты питания",
      isActionable: true,
    },
  ]);
};

const fetchFoodFactories = async () => {
  const perPage = parseInt(route.query.per_page as string);
  const page = parseInt(route.query.page as string);

  if (!isNaN(perPage)) form.per_page = perPage;
  if (!isNaN(page)) form.page = page;
  form.search = String(route.query.search ?? "");

  await settingsStore.fetchFoodFactories(filterObjectValues(form));

  if (!settingsStore.foodFactories) return;
  form.page = settingsStore.foodFactories.paginator.current_page;
  form.per_page = settingsStore.foodFactories.paginator.per_page;
};

onMounted(() => {
  setBreadCrumbFn();
});

watch(route, () => {
  fetchFoodFactories();
}, { immediate: true });

watchDebounced(() => form.search, () => {
  router.replace({ query: { search: form.search } });
}, { debounce: 1000, maxWait: 5000 });

const changePage = () => {
  router.replace({ query: { ...route.query, page: form.page } });
};

const tableCurrentChange = (value: FoodFactoryListType) => {
  router.push({ name: "reference-combine-nutrition-view", params: { id: value.id } });
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
          class="w-[300px] mr-[16px]"
        />

        <button
          @click="$router.push({name: 'reference-combine-nutrition-add'})"
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
        </button>

        <button>

        </button>
      </div>
    </div>

    <div class="mt-6">
      <el-table
        v-loading="settingsStore.foodFactoriesLoading"
        :data="settingsStore.foodFactories?.food_factories ?? []"
        stripe
        class="custom-element-table"
        highlight-current-row
        @current-change="tableCurrentChange"
      >
        <el-table-column
          prop="idx"
          label="№"
          width="80"
        >
          <template #default="{$index}">
            {{ setTableColumnIndex($index, form.page ?? 1, settingsStore.foodFactories?.paginator.per_page ?? 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Наименование"
          sortable
          width="400"
        />
        <el-table-column
          prop="management"
          label="Региональное управление"
          sortable
        >
          <template #default="{row}">
            {{ row.management.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="Действие"
          align="right"
        >
          <template #default="{row}">
            <div class="inline-flex items-center">
              <RouterLink
                class="action-btn mr-2"
                :to="{name: 'reference-combine-nutrition-view', params: {id: row.id}}"
              >
                <img
                  src="@/assets/images/eye.svg"
                  alt="download"
                />
              </RouterLink>

              <RouterLink
                class="action-btn"
                :to="{name: 'reference-combine-nutrition-edit', params: {id: row.id}}"
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
        v-if="settingsStore.foodFactories && settingsStore.foodFactories.paginator.pages_count>1"
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-cool-gray text-[14px]">
          Показано {{ form.page }}–{{ form.per_page }} из {{ settingsStore.foodFactories.paginator.pages_count }}
          результатов
        </div>

        <el-pagination
          v-model:current-page="form.page"
          @current-change="changePage"
          :page-size="form.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="settingsStore.foodFactories.paginator.total_count"
        />
      </div>
    </div>
  </div>
</template>

