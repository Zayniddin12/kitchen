<script
    setup
    lang="ts"
>

import { useDocumentStore } from "@/modules/Document/document.store";
import { useSettingsStore } from "@/modules/Settings/store";
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import { ActType, DraftsParamsType, DraftType } from "@/modules/Document/document.types";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";

const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

const form = reactive<DraftsParamsType>({
  page: null,
  doc_type: "invoice"
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

const isOpenFilter = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Накладные"
    },
    {
      label: String(route.meta.breadcrumbItemTitle ?? ""),
      isActionable: true
    }
  ]);
};

const fetchInvoices = async () => {
  const query = route.query as Record<string, any>;

  const page = parseInt(query.page as string);

  form.page = !isNaN(page) ? page : null;

  try {
    await documentStore.fetchDrafts(route.meta?.apiUrl ?? "", filterObjectValues(form));
    validationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

watch(
    () => route.query,
    () => {
      fetchInvoices();
    },
    { immediate: true }
);

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const tableCurrentChange = (value: DraftType) => {
  router.push({ name: `${route.name as string}-id`, params: { id: value.id } });
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

</script>

<template>
  <section class="invoices">
    <div>
      <div class="flex items-center justify-between">
        <h1 class="m-0 font-semibold text-[32px]">{{ route.meta?.title ?? "" }}</h1>

        <button
            class="custom-filter-btn font-medium"
            :class="isOpenFilter ? '!bg-blue !text-white' : ''"
            @click="isOpenFilter = !isOpenFilter"
        >
          <img
              :src="isOpenFilter ? white : filter"
              alt="filter"
              class="mr-[12px]"
          />
          Фильтр
        </button>
      </div>
      <CollapseFilter v-model="isOpenFilter">
        <template #body>
          <AppForm
              :value="form"
              :validation-errors
              @validation="setValidation"
              class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AppInput
                placeholder="№ накладной в системе"
                label="№ накладной в системе"
                label-class="text-[#7F7D83]"
            />
            <AppInput
                placeholder="Дата создания в системе"
                label="Дата создания в системе"
                label-class="text-[#7F7D83]"
            />

            <AppInput
                placeholder="№ накладной"
                label="№ накладной"
                label-class="text-[#7F7D83]"
            />
            <AppInput
                placeholder="Дата накладной"
                label="Дата накладной"
                label-class="text-[#7F7D83]"
            />
          </AppForm>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AppSelect
                placeholder="От кого"
                label="От кого"
                label-class="text-[#7F7D83]"
            />
            <AppSelect
                placeholder="Кому"
                label="Кому"
                label-class="text-[#7F7D83]"
            />

            <AppInput
                placeholder="Основание"
                label="Основание"
                label-class="text-[#7F7D83]"
            />
            <AppInput
                placeholder="Способ отправления"
                label="Способ отправления"
                label-class="text-[#7F7D83]"
            />
          </div>

          <div class="flex items-center mt-[10px] justify-between">
            <div class="text-[#8F9194] text-[14px]">
              Найдено: {{ documentStore.drafts?.paginator.total_count }}
            </div>
            <div class="flex items-center">
              <button
                  @click="clearForm"
                  class="custom-reset-btn"
              >
                Сбросить
              </button>
              <ElButton
                  :loading="documentStore.draftsLoading"
                  type="primary"
                  size="large"
                  class="custom-apply-btn ml-4"
                  @click="filterForm"
              >
                Применить
              </ElButton>
            </div>
          </div>
        </template>
      </CollapseFilter>
      <pre>
        {{ documentStore.drafts?.documents }}
      </pre>
      <ElTable
          v-loading="documentStore.draftsLoading"
          :data="documentStore.drafts?.documents ?? []"
          class="custom-element-table"
          stripe
          highlight-current-row
          @current-change="tableCurrentChange"
      >
        <ElTableColumn
            prop="idx"
            label="№"
            width="80"
        >
          <template #default="{ $index }">
            {{
              setTableColumnIndex(
                  $index,
                  form.page as number,
                  documentStore.drafts?.paginator.per_page ?? 0
              )
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            prop="system"
            label="№ в системе"
        />
        <ElTableColumn
            prop="dateSystem"
            label="Дата в системе"
        />
        <ElTableColumn
            prop="doc"
            label="№ док..."
        />
        <ElTableColumn
            prop="nak"
            label="Дата нак..."
        />
        <ElTableColumn
            prop="basis"
            label="Основание"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.basis || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            prop="from_name"
            label="От кого"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.from_name || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            prop="to_name"
            label="Кому"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.to_name || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            prop="payType"
            label="Способ отп..."
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.payment_method || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="Действие">
          <template #default="{row}:{row:DraftType}">
            <div class="flex items-center gap-x-2.5">
              <RouterLink
                  class="action-btn"
                  :to="{name: `${route.name as string}-id`, params: {id:row.id}}"
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
        </ElTableColumn>
      </ElTable>
      <AppPagination
          v-if="documentStore.drafts"
          v-model="form.page"
          :pagination="documentStore.drafts.paginator"
          class="mt-6"
          @current-change="changePage"
      />
    </div>
  </section>
</template>

<style lang="scss">

</style>