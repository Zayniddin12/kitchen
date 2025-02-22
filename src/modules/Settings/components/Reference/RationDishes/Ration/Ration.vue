<script
    setup
    lang="ts"
>
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Params {
  search: null | string;
  page: number;
  per_page: number;
}

const store = useSettingsStore();
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
    await store.GET_RATION_LIST(params.value);
  } catch (e) {
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
      label: "Рационы и блюда",
      to: { name: "reference" }
    },
    {
      label: "Рационы",
      isActionable: true
    }
  ]);
};

const tableCurrentChange = (value: Record<string, any>) => {
  router.push(`/reference-ration-view/${value.id}`)
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{$t('kitchen.ration')}}</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            :placeholder="$t('form.search')"
            :prefix-icon="Search as string"
            class="w-[300px]"
            @input="handleSearch"
        />

        <button
          v-if="$can('create', 'Button')"
            class="custom-apply-btn ml-[16px]"
            @click="router.push('/reference-ration-create')"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="plus"
          />
          {{$t('method.add')}}
        </button>
      </div>
    </div>

    <el-table
        stripe
        :data="store.rationList.rations"
        class="custom-element-table mt-[24px]"
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
          {{ params.page > 1 ? store.rationList.pagination.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          :label="$t('Наименование рациона')"
          sortable
          :width="200"
      />
      <el-table-column
          prop="number"
          :label="$t('kitchen.uniqueDishNumber')"
          sortable
          :width="200"
      />
      <el-table-column
          prop="kitchen_type_names"
          :label="$t('Тип кухни')"
          sortable
          :width="200"
      />
      <el-table-column
          prop="duration_in_days"
          :label="$t('Длительность')"
          sortable
          :width="200"
      />
      <el-table-column
          :label="$t('common.action')"
          align="right"
          :width="200"
      >
        <template #default="scope">
          <button
            v-if="$can('read', 'Button')"
              class="action-btn"
              @click.stop="router.push(`/reference-ration-view/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
            v-if="$can('update', 'Button')"
              class="action-btn ml-[8px]"
              @click.stop="router.push(`/reference-ration-edit/${scope.row.id}`)"
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
        {{$t('Показано 1–10 из')}} {{ store.rationList?.pagination?.total_count }} {{$t('результатов')}}
      </div>

      <el-pagination
          v-model:current-page="params.page"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="store.rationList?.pagination?.total_count"
          @change="changePagination"
      />
    </div>
  </div>
</template>
