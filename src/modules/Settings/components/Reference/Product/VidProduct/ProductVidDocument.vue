<script
    setup
    lang="ts"
>
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { ElNotification } from "element-plus";

interface Params {
  search: string | null,
  page: number,
  per_page: number,
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
let time: ReturnType<typeof setTimeout>;


onMounted(() => {
  setBreadCrumbFn();
  refresh();
});

const refresh = async () => {
  loading.value = true;

  try {
    await store.GET_VID_PRODUCT(params.value);
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
      label: "Продукты",
      to: { name: "reference" }
    },
    {
      label: "Виды продуктов",
      to: { name: "reference" }
    },
    {
      label: "Типы продуктов",
      isActionable: true
    }
  ]);
};

const changeSearch = (): void => {
  clearTimeout(time);

  time = setTimeout(async () => {
    params.value.page = 1;
    await refresh();
  }, 500);
};

const changePagination = (event: any) => {
  params.value.page = event;

  refresh();
};

const tableCurrentChange = (value: Record<string, any>) => {
  router.push(`/reference-vid-view/${value.id}`);
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Виды продуктов</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            placeholder="Поиск"
            :prefix-icon="Search"
            class="w-[300px]"
            size="large"
            @input="changeSearch"
        />

        <button
            class="custom-apply-btn ml-[16px] h-11"
            @click="router.push('/reference-vid-add')"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="plus"
          />
          Добавить
        </button>
      </div>
    </div>


    <el-table
        :data="store.vidProduct.product_types"
        v-loading="loading"
        class="custom-element-table mt-[24px]"
        stripe
        empty-text="Нет доступных данных"
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
          {{ params.page > 1 ? store.vidProduct.pagination.per_page * (params.page - 1) + $index + 1 : $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="photo"
          label="Картинка вида продукта"
      >
        <template #default="scope">
          <img
              v-if="scope.row.image"
              :src="scope.row.image"
              alt="#"
              class="h-[32px] w-[32px] rounded-full"
          />
          <img
              v-else
              src="https://www.landuse-ca.org/wp-content/uploads/2019/04/no-photo-available.png"
              alt="#"
              class="h-[32px] w-[32px] rounded-full object-cover"
          />
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="Наименование вида продукта"
          sortable
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="parent_name"
          label="Тип продукта"
          sortable
      />
      <el-table-column
          label="Действие"
          align="right"
      >
        <template #default="scope">
          <button
              class="action-btn"
              @click.stop="router.push(`/reference-vid-view/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
              class="action-btn ml-2"
              @click="router.push(`/reference-vid-edit/${scope.row.id}`)"
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
        Показано 1–10 из {{ store.vidProduct.pagination?.total_count }} результатов
      </div>

      <el-pagination
          v-model:current-page="params.page"
          :page-size="params.per_page"
          class="float-right"
          background
          layout="prev, pager, next"
          :total="store.vidProduct.pagination?.total_count"
          @change="changePagination"
      />
    </div>
  </div>
</template>
