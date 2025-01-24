<script
    setup
    lang="ts"
>
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const store = useSettingsStore();
const router = useRouter();

const search = ref<null | string>(null);
const loading = ref(false);
let debounceTimeout: ReturnType<typeof setTimeout>;

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
      label: "Продукты",
      to: { name: "reference" }
    },
    {
      label: "Типы продуктов",
      isActionable: true
    }
  ]);
};

onMounted(() => {
  refresh();
});

const refresh = async () => {
  loading.value = true;
  try {
    await store.GET_TYPE_PRODUCT({ search: search.value });
  } catch (e: any) {
    ElNotification({ title: e, type: "error" });
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

const changeInput = (): void => {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    await refresh();
  }, 500);
};

watchEffect(() => {
  setBreadCrumbFn();
});

const tableCurrentChange = (value: Record<string, any>) => {
  router.push(`/reference-type-product-view/${value.id}`);
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{$t('typeProduct.title')}}</h1>

      <div class="flex items-center">
        <el-input
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search as any"
            class="w-[300px]"
            v-model="search"
            @input="changeInput"
        />

        <button
          v-if="$can('create', 'Button')"
            class="custom-apply-btn ml-[16px]"
            @click="router.push('/reference-type-product-create')"
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
        v-loading="loading"
        :data="store.typeProduct.product_categories"
        stripe
        class="custom-element-table mt-[24px]"
        :empty-text="$t('Нет доступных данных')"
        highlight-current-row
        @current-change="tableCurrentChange"
    >
      <el-table-column
          prop="index"
          label="№"
          width="80"
      >
        <template #default="{ $index}">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          :label="$t('Наименование типа продукта')"
          sortable
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('common.action')"
          align="right"
      >
        <template #default="scope">
          <button
            v-if="$can('read', 'Button')"
              class="action-btn"
              @click.stop="router.push(`/reference-type-product-view/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
            v-if="$can('update', 'Button')"
              class="action-btn ml-[8px]"
              @click.stop="router.push(`/reference-type-product-edit/${scope.row.id}`)"
          >
            <img
                src="@/assets/images/icons/edit.svg"
                alt="edit"
            />
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
