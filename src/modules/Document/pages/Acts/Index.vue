<script
  setup
  lang="ts"
>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useDocumentStore } from "@/modules/Document/document.store";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ActType, DraftsParamsType } from "@/modules/Document/document.types";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import { useI18n } from "vue-i18n";

const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

const { t } = useI18n();

const form = reactive<DraftsParamsType>({
  page: null,
  from_date: "",
  to_date: "",
  number: "",
  subject: "",
  to_id: "",
  from_id: "",
});

const v$ = ref<ValidationType | null>(null);
const validationErrors = ref<Record<string, any> | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const filterForm = () => {
  const query = { ...filterObjectValues(form) };
  delete query.page;

  router.push({ query });
};

const clearForm = () => {
  router.push({ query: {} });
  isOpenFilter.value = false;
};

const route = useRoute();
const router = useRouter();
const isOpenFilter = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "document.title1",
      isTranslate: true,
    },
    {
      label: title.value,
      isTranslate: isTranslate.value,
      isActionable: true,
    },
  ]);
};

const fetchActs = async () => {
  const query = route.query as Record<string, any>;

  const page = parseInt(query.page as string);
  const fromId = parseInt(query.from_id as string);
  const toId = parseInt(query.to_id as string);

  form.page = !isNaN(page) ? page : null;
  form.from_id = !isNaN(fromId) ? fromId : "";
  form.to_id = !isNaN(toId) ? toId : "";
  form.to_date = String(query.to_date ?? "");
  form.from_date = String(query.from_date ?? "");
  form.number = String(query.number ?? "");
  form.subject = String(query.subject ?? "");

  try {
    await documentStore.fetchActs(filterObjectValues(form));
    validationErrors.value = null;
  } catch (error: any) {
    console.log(error, 'rere');
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

watch(() => route.query, () => {
  fetchActs();
}, { immediate: true });

watch(() => documentStore.documentsIsRefresh, (newValue) => {
  if (newValue) fetchActs();
});

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.fetchRespondents();
});

const tableCurrentChange = (value: ActType) => {
  router.push({ name: "acts-id", params: { id: value.id } });
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1
        v-if="title"
        class="m-0 font-semibold text-[32px]"
      >
        {{ isTranslate ? t(title) : title }}
      </h1>

      <button
        class="custom-filter-btn font-medium"
        :class="isOpenFilter ? '!bg-blue !text-white' : ''"
        @click="isOpenFilter =! isOpenFilter"
      >
        <img
          :src="isOpenFilter ? white : filter"
          alt="filter"
          class="mr-[12px]"
        />
        {{ t("common.filter") }}
      </button>
    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <AppForm
          :value="form"
          :validation-errors
          @validation="setValidation"
          class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1"
        >
          <AppDatePicker
            v-model="form.from_date"
            prop="from_date"
            :placeholder="t('common.fromDate')"
            :label="t('common.fromDate')"
            label-class="text-[#7F7D83]"
          />
          <AppDatePicker
            v-model="form.to_date"
            prop="to_date"
            :placeholder="t('common.endDate')"
            :label="t('common.endDate')"
            label-class="text-[#7F7D83]"
          />

          <AppInput
            v-model="form.number"
            prop="number"
            :placeholder="t('document.number2')"
            :label="t('document.number2')"
            label-class="text-[#7F7D83]"
          />
          <AppInput
            v-model="form.subject"
            prop="subject"
            :placeholder="t('document.potatoDelivery')"
            :label="t('document.potatoDelivery')"
            label-class="text-[#7F7D83]"
          />
          <AppSelect
            v-model="form.to_id"
            prop="to_id"
            :items="settingsStore.respondents"
            item-label="name"
            item-value="id"
            :loading="settingsStore.respondentsLoading"
            class="col-span-2"
            :placeholder="t('document.whom.to')"
            :label="t('document.whom.to')"
            label-class="text-[#7F7D83]"
          />
          <AppSelect
            v-model="form.from_id"
            prop="from_id"
            :items="settingsStore.respondents"
            item-label="name"
            item-value="id"
            :loading="settingsStore.respondentsLoading"
            class="col-span-2"
            :placeholder="t('common.sender')"
            :label="t('common.sender')"
            label-class="text-[#7F7D83]"
          />
        </AppForm>

        <div class="flex items-center mt-[10px] justify-between">
          <div class="text-[#8F9194] text-[14px]">
            {{ t("common.found") }}: {{ documentStore.drafts?.paginator.total_count }}
          </div>
          <div class="flex items-center">
            <button
              @click="clearForm"
              class="custom-reset-btn"
            >
              {{ t("method.reset") }}
            </button>
            <ElButton
              :loading="documentStore.draftsLoading"
              type="primary"
              size="large"
              class="custom-apply-btn ml-4"
              @click="filterForm"
            >
              {{ t("method.apply") }}
            </ElButton>
          </div>
        </div>
      </template>
    </CollapseFilter>

    <el-table
      v-loading="documentStore.actsLoading"
      :data="documentStore.acts?.acts ?? []"
      class="custom-element-table"
      stripe
      highlight-current-row
      :empty-text="t('common.empty')"
      @current-change="tableCurrentChange"
    >
      <el-table-column
        prop="idx"
        label="№"
        width="80"
        align="center"
      >
        <template #default="{ $index }">
          {{
            setTableColumnIndex(
              $index,
              form.page as number,
              documentStore.acts?.paginator.per_page ?? 0,
            )
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        :label="t('common.date')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          {{ row.date || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        :label="t('document.shortNum')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          {{ row.number || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_parent_name"
        :label="t('product.type')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          {{ row.product_parent_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        :label="t('product.view')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          {{ row.product_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="warehouse"
        :label="t('title')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          {{ row.warehouse || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.action')"
        align="center"
      >
        <template #default="{row}:{row:ActType}">
          <div class="flex items-center justify-center gap-x-2.5">
            <RouterLink
              v-if="$can('read', 'Button')"
              class="action-btn"
              :to="{name: 'acts-id', params: {id: row.id}}"
            >
              <img
                src="@/assets/images/eye.svg"
                alt="eye"
              />
            </RouterLink>
            <ElButton
              :loading="documentStore.pdfLoading"
              plain
              @click.stop="documentStore.getPdf(row.id)"
              class="action-btn"
              text
              bg
            >
              <img
                src="@/assets/images/download.svg"
                alt="download"
              />
            </ElButton>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <AppPagination
      v-if="documentStore.acts"
      v-model="form.page"
      :pagination="documentStore.acts.paginator"
      class="mt-6"
      @current-change="changePage"
    />
  </div>
</template>
