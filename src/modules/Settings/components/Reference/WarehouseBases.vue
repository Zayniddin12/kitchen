<script
    setup
    lang="ts"
>
import { ref, watchEffect, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { watchDebounced } from "@vueuse/core";
import { FoodFactoryListType } from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

interface TableData {
  id: number;
  name: string;
  type: string;
}


const params = ref<object>({
  search: "",
  page: 1,
  per_page: 10
});
const loading = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
      isActionable: false
    },
    {
      label: "Справочники",
      isActionable: false,
      to: { name: "reference" }
    },

    {
      label: "Управ, комбинаты и склады",
      isActionable: false,
      to: { name: "reference" }
    },

    {
      label: "Базы складов",
      isActionable: true
    }
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});


const refresh = async () => {
  loading.value = true;
  try {
    await settingsStore.GET_WAREHOUSE_BASES_LIST(params.value);
  } catch (e: any) {
    ElNotification({ title: e, type: "error" });
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  refresh();
});

const changePagination = (event: any) => {
  params.value.page = event;

  refresh();
};

watchDebounced(
    () => params.value.search,
    () => {
      params.value.page = 1;
      refresh();
    },
    { debounce: 1000, maxWait: 5000 }
);

const tableCurrentChange = (value: FoodFactoryListType) => {
  router.push({ name: "reference-warehouse-bases-view", params: { id: value.id }, query: {type: 'view'} });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search"
            class="w-[300px] mr-[16px]"
        />

        <button
            @click="$router.push({name: 'reference-warehouse-bases-add'})"
            class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="plus"
          >
          Добавить
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
          v-loading="loading"
          :empty-text="'Нет доступных данных'"
          :data="settingsStore.wareHouseList.bases"
          stripe
          class="custom-element-table"
          highlight-current-row
          @current-change="tableCurrentChange"
      >
        <el-table-column
            prop="id"
            label="№"
            width="80"
        />
        <el-table-column
            prop="name"
            label="Наименование базы"
            sortable
            width="400"
        />
        <el-table-column
            prop="address"
            label="Юр. адрес"
            sortable
        />
        <el-table-column
            label="Действие"
            align="right"
        >
          <template #default="scope">
            <button
                class="action-btn mr-[8px]"
                @click.stop="$router.push({name: 'reference-warehouse-bases-view', query: {type: 'view'}, params: {id: scope.row.id}})"
            >
              <img
                  src="@/assets/images/eye.svg"
                  alt="download"
              />
            </button>

            <button
                class="action-btn"
                @click.stop="$router.push({name: 'reference-warehouse-bases-edit', params: {id: scope.row.id}})"
            >
              <img
                  src="@/assets/images/icons/edit.svg"
                  alt="eye"
              />
            </button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-[24px] flex items-center justify-between">
        <div class="text-cool-gray text-[14px]">
          Показано 1–10 из {{ settingsStore.wareHouseList.paginator.total_count }} результатов
        </div>

        <el-pagination
            v-model:current-page="params.page"
            :page-size="params.per_page"
            class="float-right"
            background
            layout="prev, pager, next"
            :total="settingsStore.wareHouseList.paginator.total_count"
            @change="changePagination"
        />
      </div>
    </div>
  </div>
</template>

