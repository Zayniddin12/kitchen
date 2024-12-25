<script
  setup
  lang="ts"
>
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";

const { setBreadCrumb } = useBreadcrumb();
const { t } = useI18n();

const route = useRoute();
const store = useSettingsStore();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

const input1 = ref<null>(null);
const loading = ref<boolean>(false);
let time: ReturnType<typeof setTimeout>;

onMounted(async () => {
  setBreadCrumbFn();

  await refresh();
});

const refresh = async () => {
  loading.value = true;
  try {
    await store.GET_UNITS({ search: input1.value });
  } finally {
    loading.value = false;
  }
};

const changeSearch = (): void => {
  clearTimeout(time);

  time = setTimeout(() => {
    refresh();
  }, 500);
};

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
    to: "reference",
  }, {
    label: title.value,
    isTranslate: isTranslate.value,
    isActionable: true,
  }]);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
      <el-input
        v-model="input1"
        size="large"
        :placeholder="t('form.search')"
        :prefix-icon="Search"
        class="w-[300px] mr-[16px]"
        @input="changeSearch"
      />
    </div>

    <el-table
      :data="store.units.units"
      stripe
      :empty-text="t('common.empty')"
      class="custom-element-table mt-[24px]"
      v-loading="loading"
    >
      <el-table-column
        prop="index"
        label="№"
        width="100"
      >
        <template #default="{ $index}">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="t('settings.nameUnitsMeasurement')"
        sortable
        width="400"
        :class-name="'tableHeadClass'"
      />
      <el-table-column
        prop="unit"
        :label="t('settings.abbreviationUnits')"
        sortable
        :class-name="'tableHeadClass'"
      />
    </el-table>
  </div>
</template>

