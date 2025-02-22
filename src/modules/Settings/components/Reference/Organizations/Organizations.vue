<script
  setup
  lang="ts"
>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { ElNotification } from "element-plus";
import { useSettingsStore } from "@/modules/Settings/store";

interface Params {
  search: string | null;
  page: number;
  per_page: number;
}

const route = useRoute();
const router = useRouter();
const store = useSettingsStore();
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
      label: "Поставщики и организации",
      to: { name: "reference" },
    },

    {
      label: "Организации",
      isActionable: true,
    },
  ]);
};

const params = ref<Params>({
  search: null,
  page: 1,
  per_page: 10,
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
    await store.GET_ORGANIZATION(params.value);
  } catch (e: any) {
    loading.value = false;
    ElNotification({ title: e, type: "error" });
  } finally {
    loading.value = false;
  }
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

const tableCurrentChange = (value: Record<string, any>) => {
  router.push({ name: "reference-organization-view", query: { type: "view" }, params: { id: value.id } });
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
          :prefix-icon="Search"
          class="w-[300px] mr-[16px]"
          @input="handleSearch"
        />

        <button
          v-if="$can('create', 'Button')"
          @click="$router.push({name: 'reference-organization-add'})"
          class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            alt="plus"
          >
          {{ $t("method.add") }}
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
        :data="store.organization.organizations"
        stripe
        class="custom-element-table"
        v-loading="loading"
        :empty-text="$t('Нет доступных данных')"
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
            {{ params.page > 1 ? store.organization.paginator.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('common.name2')"
          sortable
          width="200"
        />
        <el-table-column
          prop="tin"
          :label="$t('common.tin')"
          sortable
        />
        <el-table-column
          prop="address"
          :label="$t('common.legalAddress')"
          sortable
        />
        <el-table-column
          :label="$t('common.action')"
          align="right"
        >
          <template #default="scope">
            <button
              v-if="$can('read', 'Button')"
              class="action-btn mr-[8px]"
              @click.stop="router.push({name: 'reference-organization-view', query: {type: 'view'}, params: {id: scope.row.id}})"
            >
              <img
                src="@/assets/images/eye.svg"
                alt="eye"
              />
            </button>

            <button
              v-if="$can('update', 'Button')"
              class="action-btn"
              @click.stop="router.push({name: 'reference-organization-edit', params: {id: scope.row.id}})"
            >
              <img
                src="@/assets/images/icons/edit.svg"
                alt="edit"
              />
            </button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-[24px] flex items-center justify-between">
        <div class="text-cool-gray text-[14px]">
          {{ $t("Показано 1–10 из") }} {{ store.organization.paginator.total_count }} {{ $t("результатов") }}
        </div>

        <el-pagination
          v-model:current-page="params.page"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="store.organization.paginator.total_count"
          @change="changePagination"
        />
      </div>
    </div>
  </div>
</template>

