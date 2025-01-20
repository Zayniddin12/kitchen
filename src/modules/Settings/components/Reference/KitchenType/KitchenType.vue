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
  search: string | null;
  page: number;
  per_page: number;
}

const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

const params = ref<Params>({
  search: null,
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
    await store.GET_KITCHEN_TYPE(params.value);
  } catch (e: any) {
    ElNotification({ title: e, type: "error" });
    loading.value = false;
  } finally {
    loading.value = false;
  }
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
      label: "Типы кухни",
      isActionable: true
    }
  ]);
};

const handleSearch = (): void => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(async () => {
    params.value.page = 1;

    await refresh();
  }, 500);
};

const currentTableChange = (value: Record<string, any>) => {
  router.push({name: 'reference-kitchen-type-view', query: {type: 'view'}, params: {id: value.id}})
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
            placeholder="Поиск"
            :prefix-icon="Search as any"
            class="w-[300px] mr-[16px]"
            @input="handleSearch"
        />

        <button
            @click="$router.push({name: 'reference-kitchen-type-add'})"
            class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="#"
          />
          Добавить
        </button>
      </div>
    </div>

    <el-table
        :data="store.kitchenTypes.kitchen_types"
        stripe
        class="custom-element-table mt-[24px]"
        v-loading="loading"
        :empty-text="$t('Нет доступных данных')"
        highlight-current-row
        @current-change="currentTableChange"
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
          {{ params.page > 1 ? store.kitchenTypes.paginator.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="Наименование кухни"
          sortable
          width="400"
      >
        <template #default="scope">
           <span v-if="scope.row.name">
             {{ scope.row.name }}
           </span>
        </template>
      </el-table-column>
      <el-table-column
          label="Действие"
          align="right"
      >
        <template #default="scope">
          <button
              class="action-btn mr-[8px]"
              @click.stop="$router.push({name: 'reference-kitchen-type-view', query: {type: 'view'}, params: {id: scope.row.id}})"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="download"
            />
          </button>

          <button
              class="action-btn"
              @click.stop="$router.push({name: 'reference-kitchen-type-edit', params: {id: scope.row.id}})"
          >
            <img
                src="@/assets/images/icons/edit.svg"
                alt="eye"
            />
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

