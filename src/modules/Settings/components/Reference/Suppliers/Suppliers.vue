<script
  setup
  lang="ts"
>
import { computed, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";

const store = useSettingsStore();
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

interface ParamsInterface {
  search: string | null;
  per_page: number;
  page: number;
}

const params = ref<ParamsInterface>({
  search: null,
  per_page: 10,
  page: 1,
});
const loading = ref<boolean>(false);
let debounceTimeout: ReturnType<typeof setTimeout>;

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
  }, {
    label: "settings.directories",
    isTranslate: true,
    to: { name: "reference" },
  },

    {
      label: "settings.suppliersAndOrganizations",
      isTranslate: true,
      to: { name: "reference" },
    },

    {
      label: title.value,
      isTranslate: isTranslate.value,
      isActionable: true,
    }]);
};

onMounted(() => {
  setBreadCrumbFn();

  refresh();
});

const refresh = async () => {
  loading.value = true;
  try {
    await store.GET_PROVIDERS(params.value);
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
  router.push({
    name: "reference-suppliers-view",
    query: { type: "view" },
    params: { id: value.id },
  });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ isTranslate ? t(title) : title }}</h1>

      <div class="flex items-center">
        <el-input
          v-model="params.search"
          size="large"
          :placeholder="t('form.search')"
          :prefix-icon="Search"
          class="w-[300px] mr-[16px]"
          @input="handleSearch"
        />

        <button
          v-if="$can('create', 'Button')"
          @click="router.push({name: 'reference-suppliers-add'})"
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
          {{ t("method.add") }}
        </button>
      </div>
    </div>

    <div class="mt-6">
      <el-table
        :data="store.providers.providers"
        stripe
        class="custom-element-table"
        v-loading="loading"
        :empty-text="t('common.empty')"
        @current-change="tableCurrentChange"
        highlight-current-row
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
            {{ params.page > 1 ? store.providers.paginator.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="t('common.name2')"
          sortable
          width="400"
        />
        <el-table-column
          prop="tin"
          :label="t('common.tin')"
          sortable
        />
        <el-table-column
          prop="address"
          :label="t('common.legalAddress')"
          sortable
        />
        <el-table-column
          prop="oked"
          :label="t('common.oked')"
          sortable
        />
        <el-table-column
          :label="t('common.action')"
          align="right"
        >
          <template #default="scope">
            <button
              v-if="$can('read', 'Button')"
              class="action-btn mr-[8px]"
              @click.stop="router.push({name: 'reference-suppliers-view', query: {type: 'view'}, params: {id: scope.row.id}})"
            >
              <img
                src="@/assets/images/eye.svg"
                alt="eye"
              />
            </button>

            <button
              v-if="$can('update', 'Button')"
              class="action-btn"
              @click.stop="router.push({name: 'reference-suppliers-edit', params: {id: scope.row.id}})"
            >
              <img
                src="@/assets/images/icons/edit.svg"
                alt="eye"
              />
            </button>
          </template>
        </el-table-column>
      </el-table>

      <AppPagination
        v-model="params.page"
        :pagination="store.providers.paginator"
        class="mt-6"
        @current-change="changePagination"
      />
    </div>
  </div>
</template>

