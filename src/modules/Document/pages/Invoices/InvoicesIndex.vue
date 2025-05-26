<script
  setup
  lang="ts"
>

import { useDocumentStore } from "@/modules/Document/document.store";
import { useSettingsStore } from "@/modules/Settings/store";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { filterObjectValues, formatDate2, setTableColumnIndex } from "@/utils/helper";
import { DraftsParamsType, DraftType } from "@/modules/Document/document.types";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { useI18n } from "vue-i18n";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const { confirm } = useConfirm();
const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

const { t } = useI18n();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

interface FormType extends DraftsParamsType {
  basis?: string;
  created_at?: string,
  date?: string,
  shipping_method?: string,
  generated_number?: string,
  status?: string,
}

const form = reactive<FormType>({
  page: null,
  number: "",
  basis: "",
  from_id: "",
  to_id: "",
  created_at: "",
  date: "",
  shipping_method: "",
  generated_number: "",
  status: "",
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
  form.from_id = undefined;
  form.to_id = undefined;
  form.number = undefined;
  form.basis = undefined;
  form.created_at = undefined;
  form.date = undefined;
  form.shipping_method = undefined;
  form.generated_number = undefined;
  isOpenFilter.value = false;
};

const isOpenFilter = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "document.title1",
      isTranslate: true,
    },
    {
      label: "document.overhead2",
      isTranslate: true,
    },
    {
      label: String(route.meta.breadcrumbItemTitle ?? ""),
      isTranslate: route.meta.breadcrumbItemIsTranslate,
      isActionable: true,
    },
  ]);
};

const fetchInvoices = async () => {
  const query = route.query as Record<string, string>;

  const page = parseInt(query.page);
  const from_id = parseInt(query.from_id);
  const to_id = parseInt(query.to_id);

  form.page = !isNaN(page) ? page : null;
  form.number = query.number ?? "";
  form.basis = query.basis ?? "";
  form.from_id = !isNaN(from_id) ? from_id : "";
  form.to_id = !isNaN(to_id) ? to_id : "";
  form.created_at = query.created_at ?? "";
  form.date = query.date ?? "";
  form.shipping_method = query.shipping_method ?? "";
  form.generated_number = query.generated_number ?? "";

  const newForm = { ...form, doc_type: "invoice" };


  try {
    await documentStore.fetchDrafts(route.meta?.apiUrl ?? "", filterObjectValues(newForm));
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
  { immediate: true },
);

watch(() => documentStore.documentsIsRefresh, (newValue) => {
  if (newValue) fetchInvoices();
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const fromList = ref<any>([]);
const toList = ref<any>([]);

onMounted(async () => {
  fromList.value = await settingsStore.fetchRespondents({ type: ["provider", "baseWarehouse", "pantryWarehouse", "kitchenWarehouse", "workshopWarehouse"]});
  toList.value = await settingsStore.fetchRespondents();
});

const tableCurrentChange = (value: DraftType) => {
  router.push({ name: `${route.name as string}-id`, params: { id: value.id } });
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

const statusColorsTailwind: Record<string, string> = {
  draft: 'text-gray-400',
  sent: 'text-blue-500',
  pending: 'text-amber-500',
  approved: 'text-green-500',
  rejected: 'text-red-500',
  signed: 'text-emerald-500',
  cancelled: 'text-gray-600',
};

const statusBorderTailwind: Record<string, string> = {
  draft: 'border-gray-400',
  sent: 'border-blue-500',
  pending: 'border-amber-500',
  approved: 'border-green-500',
  rejected: 'border-red-500',
  signed: 'border-emerald-500',
  cancelled: 'border-gray-600',
};


const deleteModalHandler = async (item: any) => {
  confirm.delete().then(async () => {
    await documentStore.deleteDocument(item.id);
    await fetchInvoices();
  });
};
const statusList = ref([
  {
    id:'draft',
    name:{ru:'Черновики', uz:'Qoralamalar'},
  },
  {
    id:'sent',
    name:{ru:'Новый', uz:'Yangi'},
  },
  {
    id:'pending',
    name:{ru:'В ожидании', uz:'Kutilmoqda'},
  },
  {
    id:'approved',
    name:{ru:'Одобрено', uz:'Tasdiqlangan'},
  },
  {
    id:'rejected',
    name:{ru:'Отклонено', uz:'Rad etildi'},
  },
  {
    id:'signed',
    name:{ru:'Подписано', uz:'Imzolangan'},
  },
  {
    id:'cancelled',
    name:{ru:'Отменено', uz:'Bekor qilindi'},
  }
])
</script>

<template>
  <section class="invoices">
    <div>
      <div class="flex items-center justify-between">
        <h1 class="m-0 font-semibold text-[32px]">{{ isTranslate ? t(title) : title }}</h1>

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
            <AppInput
              v-model="form.generated_number"
              prop="generated_number"
              :placeholder="t('document.invoiceNumberSystem')"
              :label="t('document.invoiceNumberSystem')"
              label-class="text-[#7F7D83]"
            />
            <AppDatePicker
              v-model="form.created_at"
              prop="created_at"
              :placeholder="t('document.dateCreatedSystem')"
              :label="t('document.dateCreatedSystem')"
              label-class="text-[#7F7D83]"
            />

            <AppInput
              v-model="form.number"
              prop="number"
              :placeholder="t('document.invoiceNumber')"
              :label="t('document.invoiceNumber')"
              label-class="text-[#7F7D83]"
            />
            <AppDatePicker
              v-model="form.date"
              prop="date"
              :placeholder="t('document.invoiceDate')"
              :label="t('document.invoiceDate')"
              label-class="text-[#7F7D83]"
            />
            <AppSelect
              v-model="form.from_id"
              prop="from_id"
              :items="fromList"
              item-label="name"
              item-value="id"
              :loading="settingsStore.respondentsLoading"
              :placeholder="t('document.whom.from')"
              :label="t('document.whom.from')"
              label-class="text-[#7F7D83]"
              filterable
            />
            <AppSelect
              v-model="form.to_id"
              prop="to_id"
              :items="toList"
              item-label="name"
              item-value="id"
              :loading="settingsStore.respondentsLoading"
              :placeholder="t('document.whom.to')"
              :label="t('document.whom.to')"
              label-class="text-[#7F7D83]"
              filterable
            />
            <AppInput
              v-model="form.basis"
              prop="basis"
              :placeholder="t('document.base')"
              :label="t('document.base')"
              label-class="text-[#7F7D83]"
            />
            <AppInput
              v-model="form.shipping_method"
              prop="shipping_method"
              :placeholder="t('document.shippingMethod')"
              :label="t('document.shippingMethod')"
              label-class="text-[#7F7D83]"
            />
            <AppSelect
              v-model="form.status"
              prop="status"
              :items="statusList"
              item-label="name"
              item-value="id"
              :placeholder="t('document.status')"
              :label="t('document.status')"
              label-class="text-[#7F7D83]"
              filterable
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
      <ElTable
        v-loading="documentStore.draftsLoading"
        :data="documentStore.drafts?.documents ?? []"
        class="custom-element-table"
        stripe
        highlight-current-row
        :empty-text="t('common.empty')"
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
                documentStore.drafts?.paginator.per_page ?? 0,
              )
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="generated_number"
          :label="t('system.number')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.generated_number || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="created_at"
          :label="t('system.date')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.created_at ? formatDate2(new Date(row.created_at)) : "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="number"
          :label="t('document.shortNum')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.number || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="date"
          :label="t('document.shortInvoiceDate')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.date || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="basis"
          :label="t('document.base')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.basis || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="from_name"
          :label="t('document.whom.from')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.from_name || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="to_name"
          :label="t('document.whom.to')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.to_name || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="payType"
          :label="t('document.shortShippingMethod')"
        >
          <template #default="{ row }:{row: DraftType}">
            {{ row.shipping_method || "-" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="status"
          width="180px"
          :label="t('document.status')"
        >
          <template #default="{ row }:{row: DraftType}">
            <span :class="`inline-block border-2 ${statusBorderTailwind[row.status]} rounded-md px-1 ${statusColorsTailwind[row.status]}`">
              {{ t(`document.${row.status}`) || "-" }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="action"
          :label="t('common.action')"
        >
          <template #default="{row}:{row:DraftType}">
            <div class="flex items-center gap-x-2.5 p">
              <RouterLink
                class="action-btn"
                :to="{name: `${route.name as string}-id`, params: {id:row.id}}"
              >
                <img
                  src="@/assets/images/eye.svg"
                  alt="eye"
                />
              </RouterLink>

              <button
                v-if="$can('delete', 'Button')"
                class="action-btn"
                @click="deleteModalHandler(row)"
              >
                <img
                  src="@/assets/images/icons/delete-danger-icon.svg"
                  alt="delete"
                />
              </button>
              <!--              <ElButton-->
              <!--                :loading="documentStore.pdfLoading"-->
              <!--                plain-->
              <!--                @click.stop="documentStore.getPdf(row.id)"-->
              <!--                class="action-btn"-->
              <!--                text-->
              <!--                bg-->
              <!--              >-->
              <!--                <img-->
              <!--                  src="@/assets/images/download.svg"-->
              <!--                  alt="download"-->
              <!--                />-->
              <!--              </ElButton>-->
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