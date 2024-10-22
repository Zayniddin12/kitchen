<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useSettingsStore} from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {ElNotification} from "element-plus";

const store = useSettingsStore()
const router = useRouter()
const {setBreadCrumb} = useBreadcrumb();

const input1 = ref<null | string>(null);
const loading = ref<boolean>(false)
let time;


onMounted(() => {
  setBreadCrumbFn();
  refresh()
});

const refresh = async () => {
  loading.value = true

  try {
    await store.GET_VID_PRODUCT({search: input1.value})
  } catch (e) {
    ElNotification({title: e, type: 'error'})
    loading.value = false
  } finally {
    loading.value = false
  }
}

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: {name: "reference"},
    },
    {
      label: "Виды продуктов",
      to: {name: "reference"},
    },
    {
      label: "Типы продуктов",
      isActionable: true,
    },
  ]);
};

const changeSearch = () => {
  clearTimeout(time)

  time = setTimeout(() => {
    refresh()
  }, 500)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Виды продуктов</h1>

      <div class="flex items-center">
        <el-input
            v-model="input1"
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search"
            class="w-[300px]"
            @input="changeSearch"
        />

        <button class="custom-apply-btn ml-[16px]" @click="router.push('/reference-vid-add')">
          <img src="../../../../../../assets/images/icons/plus.svg" alt="plus"/>
          Добавить
        </button>
      </div>
    </div>

    <el-table
        :data="store.vidProduct"
        v-loading="loading"
        class="custom-element-table mt-[24px]"
        stripe
        empty-text="Нет доступных данных"
    >
      <el-table-column prop="id" label="№" width="80"/>
      <el-table-column prop="photo" label="Картинка вида продукта" sortable>
        <template #default="scope">
          <img src="https://avatar.iran.liara.run/public" alt="#" class="h-[32px]"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Наименование вида продукта" sortable>
        <template #default="scope">
          {{ scope.row?.name?.[$i18n.locale] }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Тип продукта" sortable/>
      <el-table-column label="Действие" align="right">
        <template #default="scope">
          <button class="action-btn" @click="router.push(`/reference-view-edit/${scope.row.id}`)">
            <img src="../../../../../../assets/images/eye.svg" alt="eye"/>
          </button>

          <button class="action-btn ml-[8px]" @click="router.push(`/reference-vid-edit/${scope.row.id}`)">
            <img src="../../../../../../assets/images/icons/edit.svg" alt="edit"/>
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
