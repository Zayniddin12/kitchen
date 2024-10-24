<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { watchDebounced } from "@vueuse/core";

const settingsStore = useSettingsStore();

interface TableData {
  id: number;
  name: string;
}

const search = ref<null | string>(null);
const loading = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

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
      label: "Виды документов",
      to: { name: "reference" },
    },
    {
      label: "Типы документов",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  refresh();

  setBreadCrumbFn();
});

const refresh = async () => {
  loading.value = true;
  try {
    await settingsStore.GET_VID_DOCUMENT({ search: search.value });
  } catch (e: any) {
    ElNotification({ title: e, type: "error" });
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

watchDebounced(search, () => {
  refresh();
}, { debounce: 1000, maxWait: 5000 });
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Виды документов</h1>

      <el-input
        v-model="search"
        size="large"
        placeholder="Поиск"
        :prefix-icon="Search"
        class="w-[300px]"
      />
    </div>

    <div class="mt-[24px]">
      <el-table v-loading="loading"
                :empty-text="'Нет доступных данных'" :data="settingsStore.vidDocument.documents" stripe
                class="custom-element-table">
        <el-table-column prop="id" label="№" width="80" />
        <el-table-column prop="name" label="Наименование вида" sortable width="400" />
        <el-table-column prop="name" label="Типы документов" sortable />
      </el-table>
    </div>
  </div>
</template>

