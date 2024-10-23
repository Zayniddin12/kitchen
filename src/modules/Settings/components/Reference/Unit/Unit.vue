<script setup lang="ts">
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {Search} from "@element-plus/icons-vue";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";

const {setBreadCrumb} = useBreadcrumb();
const route = useRoute()
const store = useSettingsStore()

const input1 = ref<null>(null)
const loading = ref<boolean>(false)
let time;

onMounted(async () => {
  setBreadCrumbFn()

  await refresh()
})

const refresh = async () => {
  loading.value = true
  try {
    await store.GET_UNITS({search: input1.value})
  } catch (e) {
    ElNotification({title: e.message, type: 'error'})
    loading.value = false
  } finally {
    loading.value = false
  }
}

const changeSearch = () => {
  clearTimeout(time)

  time = setTimeout(() => {
    refresh()
  }, 500)
}

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
      to: 'reference'
    },
    {
      label: "Единицы измерения",
      isActionable: true,
    },
  ]);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

      <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
          class="w-[300px] mr-[16px]"
          @input="changeSearch"
      />
    </div>

    <el-table :data="store.units" stripe class="custom-element-table mt-[24px]" v-loading="loading">
      <el-table-column prop="id" label="№" width="80" :class-name="'tableHeadClass'"/>
      <el-table-column prop="name" label="Наименование единиц измерения" sortable width="400" :class-name="'tableHeadClass'"/>
      <el-table-column prop="type" label="Сокращение единиц" sortable :class-name="'tableHeadClass'"/>
    </el-table>
  </div>
</template>

