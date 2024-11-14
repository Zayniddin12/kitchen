<script
    setup
    lang="ts"
>
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import appInput from "@/components/ui/form/app-input/AppInput.vue";
import appSelect from "@/components/ui/form/app-select/AppSelect.vue";
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

const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

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

const setValidation = (validation:ValidationType) => {
  v$.value = validation;
}

const filterForm = () => {
  const query = { ...filterObjectValues(form) };
  delete query.page;

  router.push({ query });
};

const clearForm = () => {
  router.push({ query: {} });
  isOpenFilter.value = false;
};

interface TableData {
  id: number,
  date: string,
  numDoc: string,
  vidDoc: string,
  type: string,
  vidPro: string,
  warehouse: string,
}

const route = useRoute();
const router = useRouter();
const isOpenFilter = ref<boolean>(false);

const tableData = ref<TableData[]>([
  {
    id: 1,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан"
  },
  {
    id: 2,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан"
  },
  {
    id: 3,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан"
  },
  {
    id: 4,
    date: "23.08.2024",
    numDoc: "852369",
    vidDoc: "Акт",
    type: "Мясные",
    vidPro: "Куриное мясо",
    warehouse: "Зарафшан"
  }
]);

const actionButton = (value: TableData): void => {
  console.log(value, "value");
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Акты",
      isActionable: true
    }
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
  }catch (error: any){
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
}

watch(
    () => route.query,
    () => {
      fetchActs();
    },
    { immediate: true }
);

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.fetchRespondents();
});

const tableCurrentChange = (value: TableData) => {
  router.push({ name: "acts-id", params: { id: value.id } });
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">Акты</h1>

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
        v-loading="documentStore.actsLoading"
        :data="documentStore.acts?.acts ?? []"
        class="custom-element-table"
        stripe
        highlight-current-row
        @current-change="tableCurrentChange"
    >
      <el-table-column
          prop="idx"
          label="№"
          width="80"
      >
        <template #default="{ $index }">
          {{
            setTableColumnIndex(
                $index,
                form.page as number,
                documentStore.acts?.paginator.per_page ?? 0
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
          label="№ док..."
      >
        <template #default="{row}:{row:ActType}">
          {{row.number || "-"}}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="Вид док..."
      />
      <el-table-column
          prop="product_parent_name"
          label="Тип продукта"
      >
        <template #default="{row}:{row:ActType}">
          {{row.product_parent_name || "-"}}
        </template>
      </el-table-column>
      <el-table-column
          prop="product_name"
          label="Вид продукта"
      >
        <template #default="{row}:{row:ActType}">
          {{row.product_name || "-"}}
        </template>
      </el-table-column>
      <el-table-column
          prop="warehouse"
          label="Склад"
      >
        <template #default="{row}:{row:ActType}">
          {{row.warehouse || "-"}}
        </template>
      </el-table-column>
      <el-table-column label="Действие">
        <template #default="{row}:{row:ActType}">
          <div class="flex items-center gap-x-2.5">
            <RouterLink
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
