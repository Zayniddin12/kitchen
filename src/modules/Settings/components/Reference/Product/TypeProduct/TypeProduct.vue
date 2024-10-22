<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import {onMounted, ref, watchEffect} from "vue";
import {useRouter} from "vue-router";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const store = useSettingsStore()
const router = useRouter();

const search = ref<null | string>(null)
const loading = ref(false);
let debounceTimeout;

const {setBreadCrumb} = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: {name: "reference"},
    },
    {
      label: "Продукты",
      to: {name: "reference"},
    },
    {
      label: "Типы продуктов",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  refresh()
})

const refresh = async () => {
  loading.value = true
  try {
    await store.GET_TYPE_PRODUCT({search: search.value})
  } catch (e) {
    ElNotification({title: e, type: 'error'})
    loading.value = false
  } finally {
    loading.value = false
  }
}

const changeInput = () => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(async () => {
    await refresh()
  }, 500);
};

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Типы продуктов</h1>

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
            class="custom-apply-btn ml-[16px]"
            @click="router.push('/reference-type-product-create')"
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
        v-loading="loading"
        :data="store.typeProduct"
        stripe
        class="custom-element-table mt-[24px]"
        :empty-text="'Нет доступных данных'"
    >
      <el-table-column prop="id" label="№" width="80"/>
      <el-table-column prop="name" label="Наименование типа продукта" sortable>
        <template #default="scope">
          {{ scope.row?.name?.[$i18n.locale] }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" align="right">
        <template #default="scope">
          <button
              class="action-btn"
              @click="router.push(`/reference-type-product-view/${scope.row.id}`)"
          >
            <img
                src="../../../../../../assets/images/eye.svg"
                alt="eye"
            />
          </button>

          <button
              class="action-btn ml-[8px]"
              @click="router.push(`/reference-type-product-edit/${scope.row.id}`)"
          >
            <img
                src="../../../../../../assets/images/icons/edit.svg"
                alt="edit"
            />
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
