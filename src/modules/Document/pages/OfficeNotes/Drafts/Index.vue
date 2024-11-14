<script
    setup
    lang="ts"
>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import white from "@/assets/images/filter2.svg";
import filter from "@/assets/images/filter.svg";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useDocumentStore } from "@/modules/Document/document.store";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import { DraftsParamsType, DraftType } from "@/modules/Document/document.types";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import MemoModal from "@/layout/Create/components/MemoModal.vue";

const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

const router = useRouter();
const route = useRoute();

enum DOCTYPES {
  SIMPLEDEMAND = "simple_demand",
  MONTHLYDEMAND = "monthly_demand",
  YEARLYDEMAND = "yearly_demand"
}

const defaultDocType = DOCTYPES.SIMPLEDEMAND;

const form = reactive<DraftsParamsType>({
  page: null,
  search: "",
  from_date: "",
  to_date: "",
  number: "",
  subject: "",
  to_id: "",
  from_id: "",
  doc_type: defaultDocType
});

const validationErrors = ref<Record<string, any> | null>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
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
const editModal = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Служебные записки"
    },
    {
      label: String(route.meta.breadcrumbItemTitle ?? ""),
      isActionable: true
    }
  ]);
};

const fetchDrafts = async () => {
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
  form.doc_type = !!route.meta?.hasTabs ? String(query.doc_type ?? defaultDocType) : String(route.meta?.doc_type ?? "");

  try {
    await documentStore.fetchDrafts(
        route.meta?.apiUrl ?? "",
        filterObjectValues(form)
    );
    validationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

onMounted(() => {
  settingsStore.fetchRespondents();
});

interface Tab {
  title: string;
  value: string;
}

const tabItems = ref<Tab[]>([
  {
    title: "Единоразовый",
    value: DOCTYPES.SIMPLEDEMAND
  },
  {
    title: "Месячный",
    value: DOCTYPES.MONTHLYDEMAND
  },
  {
    title: "Годовой",
    value: DOCTYPES.YEARLYDEMAND
  }
]);

const changeDocType = async () => {
  const doc_type = route.query.doc_type as string || defaultDocType;

  const isValidDocType = [
    DOCTYPES.SIMPLEDEMAND,
    DOCTYPES.MONTHLYDEMAND,
    DOCTYPES.YEARLYDEMAND
  ].includes(doc_type as DOCTYPES);

  form.doc_type = isValidDocType ? (doc_type as DOCTYPES) : defaultDocType;
};


watch(
    () => route.query,
    () => {
      fetchDrafts();
      changeDocType();
    },
    { immediate: true }
);

watch(
    () => route.name,
    () => {
      setBreadCrumbFn();
      isOpenFilter.value = false;
      validationErrors.value = null;
      if (v$.value) v$.value.clear();
    }, { immediate: true }
);

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

const tableCurrentChange = (value: DraftType) => {
  if (!route.meta.permissionView) return;

  router.push({ name: `${route.name as string}-id`, params: { id: value.id } });
};

const draftID = ref("");

const editModalHandler = (id: string) => {
  draftID.value = id;
  editModal.value = true;
};

</script>

<template>
  <div>
    <div class="flex justify-between items-end">
      <div class="flex flex-col gap-y-6">
        <h1
            v-if="route.meta.title"
            class="m-0 font-semibold text-[32px]"
        >
          {{ route.meta.title }}
        </h1>
        <div
            v-if="route.meta?.hasTabs"
            class="app-tabs !inline-flex"
        >
          <RouterLink
              v-for="item in tabItems"
              :key="item.value"
              :class="[
              'app-tab',
              { 'app-tab--active': form.doc_type === item.value },
            ]"
              :to="{ query: { ...route.query, ...{ doc_type: item.value } } }"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </div>
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
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1"
        >
          <AppDatePicker
              v-model="form.from_date"
              prop="from_date"
              placeholder="С этой даты"
              label="С этой даты"
              label-class="text-[#7F7D83]"
          />
          <AppDatePicker
              v-model="form.to_date"
              prop="to_date"
              placeholder="По эту дату"
              label="По эту дату"
              label-class="text-[#7F7D83]"
          />

          <AppInput
              v-model="form.number"
              prop="number"
              placeholder="Номер документа"
              label="Номер документа"
              label-class="text-[#7F7D83]"
          />
          <AppInput
              v-model="form.subject"
              prop="subject"
              placeholder="Доставка картофеля"
              label="Доставка картофеля"
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
              placeholder="Кому"
              label="Кому"
              label-class="text-[#7F7D83]"
          />
          <AppSelect
              v-model="form.from_id"
              :items="settingsStore.respondents"
              item-label="name"
              item-value="id"
              :loading="settingsStore.respondentsLoading"
              class="col-span-2"
              placeholder="Отправитель"
              label="Отправитель"
              label-class="text-[#7F7D83]"
          />
        </AppForm>

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
    <el-table
        v-loading="documentStore.draftsLoading"
        :data="documentStore.draftsLoading ? [] : documentStore.drafts?.documents"
        class="custom-element-table"
        stripe
        :highlight-current-row="!!route.meta.permissionView"
        @current-change="tableCurrentChange"
    >
      <el-table-column
          prop="num"
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
      </el-table-column>
      <el-table-column
          prop="date"
          label="Дата"
      />
      <el-table-column
          prop="number"
          label="№ документа"
      />
      <el-table-column
          prop="subject"
          label="Тема"
      >
        <template #default="{ row }: { row: DraftType }">
          {{ row.subject ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column
          prop="from_name"
          label="Отправитель"
      >
        <template #default="{ row }: { row: DraftType }">
          {{ row.from_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
          prop="to_name"
          label="Получатель"
      >
        <template #default="{ row }: { row: DraftType }">
          {{ row.to_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="Действие">
        <template #default="{ row }: { row: DraftType }">
          <div class="flex items-center gap-x-2.5">
            <button
                v-if="route.meta.permissionEdit"
                class="action-btn ml-[20px]"
                @click="editModalHandler(row.id)"
            >
              <img
                  src="@/assets/images/icons/edit.svg"
                  alt="edit"
              />
            </button>
            <RouterLink
                v-if="route.meta.permissionView"
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
      </el-table-column>
    </el-table>

    <AppPagination
        v-if="documentStore.drafts"
        v-model="form.page"
        :pagination="documentStore.drafts.paginator"
        class="mt-6"
        @current-change="changePage"
    />

    <MemoModal
        v-model="editModal"
        :uuid="draftID"
        title="Редактировать служебную записку"
    />
  </div>
</template>
