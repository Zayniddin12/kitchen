<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {useSettingsStore} from "@/modules/Settings/store";
import {useI18n} from "vue-i18n";
import {ElNotification} from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Params {
  search: string | null;
  per_page: number;
  page: number;
}

const store = useSettingsStore()
const i18 = useI18n()
const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

const params = ref<Params>({
  search: null,
  per_page: 10,
  page: 1,
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
    await store.GET_REGIONAL(params.value)
  } catch (e: any) {
    ElNotification({title: e, type: 'error'})
    loading.value = false
  }
  loading.value = false
}

const handleSearch = (): void => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(async () => {
    params.value.page = 1;

    await refresh();
  }, 500);
};

const changePagination = (e: any) => {
  params.value.page = e;

  refresh()
}

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
      label: "Управ, комбинаты и склады",
      isActionable: false,
      to: { name: "reference" },
    },

    {
      label: "Региональные управления",
      isActionable: true,
    },
  ]);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

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
          @click="$router.push({name: 'reference-regional-directorates-add'})"
          class="flex items-center justify-center gap-3 custom-apply-btn">
          <li
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
          ></li>
          Добавить
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
          v-loading="loading"
          :data="store.regional.managements"
          stripe class="custom-element-table"
          :empty-text="'Нет доступных данных'"
      >
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование" sortable width="400"/>
        <el-table-column prop="responsible_position" label="Подчинение" sortable />
        <el-table-column label="Действие" align="right">
          <template #default="scope">
            <button class="action-btn mr-[8px]" @click="router.push({name: 'reference-regional-directorates-view', query: {type: 'view'}, params: {id: scope.row.id}})">
              <img src="../../../../../assets/images/eye.svg" alt="download" />
            </button>

            <button class="action-btn" @click="router.push(`/reference-regional-directorates-detail/${scope.row.id}`)">
              <img src="../../../../../assets/images/icons/edit.svg" alt="eye" />
            </button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-[24px] flex items-center justify-between">
        <div class="text-cool-gray text-[14px]">
          Показано 1–10 из {{ store.regional.paginator.total_count }} результатов
        </div>

        <el-pagination
            v-model:current-page="params.page"
            :page-size="params.per_page"
            class="float-right"
            background
            layout="prev, pager, next"
            :total="store.regional.paginator.total_count"
            @change="changePagination"
        />
      </div>
    </div>
  </div>
</template>

