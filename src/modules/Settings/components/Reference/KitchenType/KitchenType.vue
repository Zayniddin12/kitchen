<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import {useI18n} from "vue-i18n";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Params {
  search: string | null;
  page: number;
  per_page: number;
}

const store = useSettingsStore();
const i18 = useI18n()
const route = useRoute();
const {setBreadCrumb} = useBreadcrumb();

const params = ref<Params>({
  search: null,
  page: 1,
  per_page: 10,
});
const loading = ref<boolean>(false);
let debounceTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  setBreadCrumbFn();

  refresh()
});


const refresh = async () => {
  loading.value = true
  try {
    await store.GET_KITCHEN_TYPE(params.value)
  } catch (e) {
    ElNotification({title: e, type: 'error'})
    loading.value = false
  } finally {
    loading.value = false
  }
};

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
      label: "Управ, комбинаты и склады",
      to: {name: "reference"},
    },

    {
      label: "Типы кухни",
      isActionable: true,
    },
  ]);
};

const handleSearch = (): void => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(async () => {
    params.value.page = 1;

    await refresh();
  }, 500);
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
            :prefix-icon="Search as string"
            class="w-[300px] mr-[16px]"
            @input="handleSearch"
        />

        <button
            @click="$router.push({name: 'reference-kitchen-type-add'})"
            class="flex items-center justify-center gap-3 custom-apply-btn"
        >
          <img src="@/assets/images/icons/plus.svg" alt="#"/>
          Добавить
        </button>
      </div>
    </div>

    <pre>{{ store.kitchenTypes }}</pre>

    <el-table
        :data="[]"
        stripe class="custom-element-table mt-[24px]"
        v-loading="loading"
        :empty-text="'Нет доступных данных'"
    >
      <el-table-column prop="id" label="№" width="80"/>
      <el-table-column prop="name" label="Наименование кухни" sortable width="400">
        <template #default="scope">
           <span v-if="scope.row.name">
             {{i18.locale === 'ru' ? scope.row.name.ru : scope.row.name.uz}}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="Действие" align="right">
        <template #default="scope">
          <button class="action-btn mr-[8px]" @click="$router.push({name: 'reference-kitchen-type-view', query: {type: 'view'}, params: {id: scope.row.id}})">
            <img src="../../../../../assets/images/eye.svg" alt="download"/>
          </button>

          <button class="action-btn" @click="$router.push({name: 'reference-kitchen-type-edit', params: {id: scope.row.id}})">
            <img src="../../../../../assets/images/icons/edit.svg" alt="eye"/>
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

