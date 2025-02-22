<script
    setup
    lang="ts"
>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";


interface Params {
  search: string | null;
  page: number;
  per_page: number;
}

const store = useSettingsStore();
const router = useRouter();
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
      label: "Рационы и блюда",
      to: { name: "reference" }
    },
    {
      label: "Блюда",
      isActionable: true
    }
  ]);
};

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
    await store.GET_MEALS(params.value);
  } catch (e) {
    loading.value = false;
    ElNotification({ title: e as string, type: "error" });
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


const setDefaultImage = (event: any) => {
  event.target.src = "https://www.landuse-ca.org/wp-content/uploads/2019/04/no-photo-available.png";
};

const tableCurrentChange = (value:Record<string, any>) => {
  router.push(`/reference-dish-view/${value.id}`)
}

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px] text-[#000D24]">{{$t('monitoring.dishes')}}</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            :placeholder="$t('form.search')"
            :prefix-icon="Search"
            class="w-[300px]"
            @input="handleSearch"
        />

        <button
          v-if="$can('create', 'Button')"
            class="custom-apply-btn ml-[16px]"
            @click="router.push('/reference-dish-create')"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="plus"
              class="mr-[8px]"
          />
          {{$t('method.add')}}
        </button>
      </div>
    </div>

    <el-table
        :data="store.meals.meals"
        stripe
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
          {{ params.page > 1 ? store.meals.pagination.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="image"
          :label="$t('Картинка блюды')"
          sortable
          :width="200"
      >
        <template #default="scope">
          <img
              @error="setDefaultImage"
              :src="scope.row.image"
              v-if="scope.row.image"
              class="h-[32px] w-[32px] object-cover rounded-full"
              alt="photo"
          />
          <img
              v-else
              src="https://www.landuse-ca.org/wp-content/uploads/2019/04/no-photo-available.png"
              class="h-[32px] w-[32px] object-cover rounded-full"
              alt="photo"
          />
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          :label="$t('Наименование блюда')"
          sortable
          :width="200"
      />
      <el-table-column
          prop="number"
          :label="$t('common.uniqueNumber')"
          sortable
          :width="200"
      />
      <el-table-column
          prop="unit"
          :label="$t('common.measurement')"
          sortable
          :width="200"
      />
      <el-table-column :label="$t('common.action')" :width="200">
        <template #default="scope">
          <button
            v-if="$can('read', 'Button')"
              class="action-btn"
              @click.stop="router.push(`/reference-dish-view/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
            v-if="$can('update', 'Button')"
              class="action-btn ml-[8px]"
              @click.stop="router.push(`/reference-dish-edit/${scope.row.id}`)"
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
        {{$t('Показано 1–10 из')}} {{ store.meals.pagination.total_count }} {{$t('результатов')}}
      </div>

      <el-pagination
          v-model:current-page="params.page"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="store.meals.pagination.total_count"
          @change="changePagination"
      />
    </div>
  </div>
</template>
