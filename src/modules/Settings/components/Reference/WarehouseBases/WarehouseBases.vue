<script
  setup
  lang="ts"
>
import { ref, watchEffect, onMounted, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { watchDebounced } from "@vueuse/core";
import { FoodFactoryListType } from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import { setTableColumnIndex } from "../../../../../utils/helper";
import { useI18n } from "vue-i18n";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const params = ref<object>({
  search: "",
  page: 1,
  per_page: 10,
});
const loading = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
    isActionable: false,
  }, {
    label: "settings.directories",
    isTranslate: true,
    isActionable: false,
    to: { name: "reference" },
  },

    {
      label: "settings.managementFactoriesAndWarehouses",
      isTranslate: true,
      isActionable: false,
      to: { name: "reference" },
    }, {
      label: title.value,
      isTranslate: isTranslate.value,
      isActionable: true,
    }]);
};

watchEffect(() => {
  setBreadCrumbFn();
});


const refresh = async () => {
  loading.value = true;
  try {
    await settingsStore.GET_WAREHOUSE_BASES_LIST(params.value);
  } catch (e: any) {
    // ElNotification({
    //   title: e,
    //   type: "error",
    // });
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

watchDebounced(() => params.value.search, () => {
  params.value.page = 1;
  refresh();
}, {
  debounce: 1000,
  maxWait: 5000,
});

const tableCurrentChange = (value: FoodFactoryListType) => {
  router.push({
    name: "reference-warehouse-bases-view",
    params: { id: value.id },
    query: { type: "view" },
  });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
      <div class="flex items-center">
        <el-input
          v-model="params.search"
          size="large"
          :placeholder="t('form.search')"
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
            {{ t("method.add") }}
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
        v-loading="loading"
        :empty-text="t('common.empty')"
        :data="settingsStore.wareHouseList.bases"
        stripe
        class="custom-element-table"
        highlight-current-row
        @current-change="tableCurrentChange"
      >
        <el-table-column
          prop="idx"
          label="№"
          width="100"
        >
          <template #default="{$index}">
            {{ setTableColumnIndex($index, params.page ?? 1, settingsStore.wareHouseList?.paginator.per_page ?? 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="t('base.name')"
          sortable
          width="400"
        />
        <el-table-column
          prop="address"
          :label="t('common.legalAddress')"
          sortable
        />
        <el-table-column
          :label="t('common.action')"
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
      <AppPagination
        v-model="params.page"
        class="mt-6"
        @current-change="changePagination"
      />
    </div>
  </div>
</template>

