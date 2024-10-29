<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Params {
  search: null | string;
  page: number;
  per_page: number;
}

const store = useSettingsStore()
const router = useRouter();
const {setBreadCrumb} = useBreadcrumb();

const params = ref<Params>({
  search: null,
  page: 1,
  per_page: 10
})
const loading = ref<boolean>(false)
let debounceTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  setBreadCrumbFn();

  refresh()
});

const refresh = async () => {
  loading.value = true
  try {
    await store.GET_RATION_LIST(params.value)
  } catch (e) {
    loading.value = false
    ElNotification({title: e, type: 'error'})
  } finally {
    loading.value = false
  }
}

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

  refresh()
}

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
      label: "Рационы и блюда",
      to: {name: "reference"},
    },
    {
      label: "Рационы",
      isActionable: true,
    },
  ]);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Рационы</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search as string"
            class="w-[300px]"
            @input="handleSearch"
        />

        <button class="custom-apply-btn ml-[16px]" @click="router.push('/reference-ration-create')">
          <img src="@/assets/images/icons/plus.svg" alt="plus"/>
          Добавить
        </button>
      </div>
    </div>

    <el-table
        stripe
        :data="store.rationList.rations"
        class="custom-element-table mt-[24px]"
        v-loading="loading"
        :empty-text="'Нет доступных данных'"
    >
      <el-table-column prop="id" label="№" width="80"/>
      <el-table-column prop="name" label="Наименование рациона" sortable/>
      <el-table-column prop="number" label="Уникальный номер" sortable/>
      <el-table-column prop="kitchen_type_names" label="Тип кухни" sortable/>
      <el-table-column prop="duration_in_days" label="Длительность" sortable/>
      <el-table-column label="Действие" align="right">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/reference-ration-view/${scope.row.id}`)">
            <img src="@/assets/images/eye.svg" alt="eye"/>
          </button>

          <button class="action-btn ml-[8px]" @click="router.push(`/reference-ration-edit/${scope.row.id}`)">
            <img src="@/assets/images/icons/edit.svg" alt="edit"/>
          </button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-[24px] flex items-center justify-between">
      <div class="text-cool-gray text-[14px]">
        Показано 1–10 из {{ store.rationList?.pagination?.total_count }} результатов
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
