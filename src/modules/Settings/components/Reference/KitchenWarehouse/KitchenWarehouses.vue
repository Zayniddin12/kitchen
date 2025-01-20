<script
    setup
    lang="ts"
>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Params {
  search: string | number;
  page: number;
  per_page: number;
}

const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

const params = ref<Params>({
  search: "",
  page: 1,
  per_page: 10
});
const loading = ref<boolean>(false);
let debounceTimeout: ReturnType<typeof setTimeout>;

onMounted(() => {
  setBreadCrumbFn();

  refresh();
});

const refresh = async () => {
  loading.value = true;
  try {
    await store.GET_KITCHEN_WAREHOUSE(params.value);
  } catch (e) {
    ElNotification({ title: e as string, type: "error" });
    loading.value = false;
  }
  loading.value = false;
};

const handleSearch = (): void => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(async () => {
    params.value.page = 1;

    await refresh();
  }, 500);
};

const changePagination = (event: any) => {
  params.value.page = event;

  refresh();
};

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
      label: "Склады кухни",
      isActionable: true
    }
  ]);
};

const tableCurrentChange = (value: Record<string, any>) => {
  router.push({ name: "reference-kitchen-warehouse-view", query: { type: "view" }, params: { id: value.id } });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            :placeholder="$t('form.enter')"
            :prefix-icon="Search"
            class="w-[300px] mr-[16px]"
            @input="handleSearch"
        />

        <button
            @click="$router.push({name: 'reference-kitchen-warehouse-add'})"
            class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="#"
          >
          {{$t('method.add')}}
        </button>
      </div>
    </div>

    <el-table
        :data="store.kitchenWarehouse.kitchen_warehouses"
        v-loading="loading"
        :empty-text="$t('Нет доступных данных')"
        stripe
        class="custom-element-table mt-[24px]"
        highlight-current-row
        @current-change="tableCurrentChange"
    >
      <el-table-column
          prop="idx"
          label="№"
          width="80"
      >
        <template
            #default="{$index}"
            v-if="store.rationList.rations"
        >
          {{
            params.page > 1 ? store.kitchenWarehouse.paginator.per_page * (params.page - 1) + $index + 1 : $index + 1
          }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          :label="$t('common.name2')"
          sortable
      />
      <el-table-column
          prop="base"
          :label="$t('База складов')"
          sortable
      />
      <el-table-column
          prop="capacity"
          :label="$t('Вмес. склада')"
          sortable
      />
      <el-table-column
          prop="kitchen_capacity"
          :label="$t('Вмес. кухни')"
          sortable
      />
      <el-table-column
          prop="kitchen_type"
          :label="$t('Тип кухни')"
          sortable
      />
      <el-table-column
          :label="$t('common.action')"
          align="right"
      >
        <template #default="scope">
          <button
              class="action-btn mr-[8px]"
              @click="router.push({name: 'reference-kitchen-warehouse-view', query: {type: 'view'}, params: {id: scope.row.id}})"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="download"
            />
          </button>

          <button
              class="action-btn"
              @click="$router.push({name: 'reference-kitchen-warehouse-edit', params: {id: scope.row.id}})"
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
        {{$t('Показано 1–10 из')}} {{ store.kitchenWarehouse.paginator.total_count }} {{$t('результатов')}}
      </div>

      <el-pagination
          v-model:current-page="params.page"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="store.kitchenWarehouse.paginator.total_count"
          @change="changePagination"
      />
    </div>
  </div>
</template>

