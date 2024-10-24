<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";

interface Params {
  search: string | null;
  page: number;
  per_page: number;
}

const store = useSettingsStore()
const router = useRouter();
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
      label: "Рационы и блюда",
      to: {name: "reference"},
    },
    {
      label: "Блюда",
      isActionable: true,
    },
  ]);
};

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
})

const refresh = async () => {
  loading.value = true

  try {
    await store.GET_MEALS(params.value)
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

const setDefaultImage = (event) => {
  event.target.src = 'https://www.landuse-ca.org/wp-content/uploads/2019/04/no-photo-available.png';
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px] text-[#000D24]">Блюда</h1>

      <div class="flex items-center">
        <el-input
            v-model="params.search"
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search"
            class="w-[300px]"
            @input="handleSearch"
        />

        <button class="custom-apply-btn ml-[16px]" @click="router.push('/reference-dish-create')">
          <img src="@/assets/images/icons/plus.svg" alt="plus" class="mr-[8px]"/>
          Добавить
        </button>
      </div>
    </div>

    <el-table
        :data="store.meals.meals"
        stripe class="custom-element-table mt-[24px]"
        v-loading="loading"
        :empty-text="'Нет доступных данных'"
    >
      <el-table-column prop="id" label="№" width="80"/>
      <el-table-column prop="image" label="Картинка блюды" sortable>
        <template #default="scope">
          <img @error="setDefaultImage" :src="scope.row.image" class="h-[32px] w-[32px] object-cover rounded-full" alt="photo"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Наименование блюда" sortable/>
      <el-table-column prop="number" label="Уникальный номер" sortable/>
      <el-table-column prop="unit" label="Ед. измерения" sortable/>
      <el-table-column label="Действие">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/reference-dish-view/${scope.row.id}`)">
            <img src="@/assets/images/eye.svg" alt="eye"/>
          </button>

          <button class="action-btn ml-[8px]" @click="router.push(`/reference-dish-edit/${scope.row.id}`)">
            <img src="@/assets/images/icons/edit.svg" alt="edit"/>
          </button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-[24px] flex items-center justify-between">
      <div class="text-cool-gray text-[14px]">
        Показано 1–10 из {{ store.meals.pagination.total_count }} результатов
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
