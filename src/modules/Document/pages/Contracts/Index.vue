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
import { ActType, ContractsParamsType, ContractType } from "@/modules/Document/document.types";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { filterObjectValues, formatNumber, setTableColumnIndex, validateNumber } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import { useCommonStore } from "@/stores/common.store";

const route = useRoute();
const router = useRouter();

const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();
const commonStore = useCommonStore();

const form = reactive<ContractsParamsType>({
  page: null,
  from_date: "",
  to_date: "",
  number: "",
  from_id: "",
  total_price: null,
  product_category_id: "",
  product_type_id: "",
  quantity: null,
  unit_id: "",
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const validationErrors = ref<Record<string, any> | null>(null);

const isOpenFilter = ref<boolean>(false);

const tableCurrentChange = (value: ContractType) => {
  router.push({ name: "contracts-view-view", params: { id: value.id } });
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы",
    },
    {
      label: "Контракты",
      isActionable: true,
    },
  ]);
};

const validate = async () => {
  if (!v$.value) return;

  const value = await v$.value.validate();

  if (!value) {
    commonStore.errorToast("Validation error");
  }

  return value;
};

const fetchContracts = async () => {
  const query = route.query as Record<string, any>;

  const page = parseInt(query.page as string);
  const fromId = parseInt(query.from_id as string);
  const totalPrice = parseInt(query.total_price as string);
  const productCategoryId = parseInt(query.product_category_id as string);
  const productTypeId = parseInt(query.product_type_id as string);
  const quantity = validateNumber(query.quantity as string);
  const unitId = parseInt(query.unit_id as string);

  form.page = !isNaN(page) ? page : null;
  form.from_id = !isNaN(fromId) ? fromId : "";
  form.total_price = !isNaN(totalPrice) ? totalPrice : null;
  form.product_category_id = !isNaN(productCategoryId) ? productCategoryId : "";
  form.product_type_id = !isNaN(productTypeId) ? productTypeId : "";
  form.quantity = !isNaN(quantity) ? quantity : null;
  form.unit_id = !isNaN(unitId) ? unitId : "";

  await fetchVidProductsList();

  try {
    await documentStore.fetchContracts(filterObjectValues(form));
    validationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};


const fetchVidProductsList = async () => {
  if (!form.product_category_id) return;

  await settingsStore.GET_VID_PRODUCT({
    parent_id: form.product_category_id,
    per_page: 100,
  });
};

const changeProductCategory = async () => {
  await fetchVidProductsList();
  form.product_type_id = "";
};

const changeProductType = async () => {
  form.unit_id = "";
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

const filterForm = async () => {
  if (!(await validate())) return;

  const query = { ...filterObjectValues(form) };
  delete query.page;

  router.push({ query });
};

const clearForm = () => {
  router.push({ query: {} });
  isOpenFilter.value = false;
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.fetchRespondents();
  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_UNITS();
});

watch(() => route.query, (newQuery) => {
  fetchContracts();
}, { immediate: true });

watch(() => documentStore.documentsIsRefresh, (newValue) => {
  if (newValue) fetchContracts();
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 p-0 font-semibold text-[32px] leading-[36px]">Контракты</h1>

      <div class="flex items-center">
        <RouterLink
          :to="{name: 'contracts-create'}"
          class="custom-apply-btn !font-medium !gap-x-2 !text-bae"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            alt="add"
          >
          Добавить
        </RouterLink>

        <button
          class="custom-filter-btn font-medium !text-base ml-[16px]"
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
    </div>

    <CollapseFilter v-model="isOpenFilter">
      <template #body>
        <AppForm
          :value="form"
          @validation="setValidation"
          :validation-errors
          :submit="filterForm"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-1">
            <AppDatePicker
              v-model="form.from_date"
              prop="from_date"
              placeholder="С этой даты"
              label="С этой даты"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />
            <AppDatePicker
              v-model="form.to_date"
              prop="to_date"
              placeholder="По эту дату"
              label="По эту дату"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />
            <AppInput
              v-model="form.number"
              prop="number"
              placeholder="Номер документа"
              label="Номер документа"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />
            <AppSelect
              v-model="form.from_id"
              prop="from_id"
              label-class="text-[#A8AAAE] text-xs font-medium"
              label="Поставщик"
              :items="settingsStore.respondents"
              item-label="name"
              item-value="id"
              :loading="settingsStore.respondentsLoading"
            />
            <AppInput
              v-model.number="form.total_price"
              prop="total_price"
              type="number"
              placeholder="Общая сумма контракта"
              label="Общая сумма контракта"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />
          </div>
          <div class="grid grid-cols-4 gap-x-4 gap-y-2 mt-1">
            <AppSelect
              v-model="form.product_category_id"
              prop="product_category_id"
              label="Тип продукта"
              label-class="text-[#A8AAAE] text-xs font-medium"
              :items="settingsStore.typeProduct.product_categories"
              item-value="id"
              item-label="name"
              @change="changeProductCategory"
            />
            <AppSelect
              v-model="form.product_type_id"
              prop="product_type_id"
              placeholder=" Вид продукта"
              label=" Вид продукта"
              label-class="text-[#A8AAAE] text-xs font-medium"
              :items="settingsStore.vidProduct.product_types"
              item-label="name"
              item-value="id"
              :disabled="!form.product_category_id"
              @change="changeProductType"
            />
            <AppInput
              v-model="form.quantity"
              prop="quantity"
              custom-type="number"
              placeholder="Количество"
              label="Количество"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />
            <AppSelect
              v-model="form.unit_id"
              prop="unit_id"
              placeholder="Ед. измерения"
              label="Ед. измерения"
              label-class="text-[#A8AAAE] text-xs font-medium"
              :items="settingsStore.units.units"
              item-label="name"
              item-value="id"
            />
          </div>
        </AppForm>
        <div class="flex items-center mt-[10px] justify-between">
          <div class="text-[#8F9194] text-[14px]">Найдено: {{ documentStore.contracts?.paginator.total_count }}</div>
          <div class="flex items-center gap-x-4">
            <button
              @click="clearForm"
              class="custom-reset-btn"
            >
              Сбросить
            </button>
            <ElButton
              :loading="documentStore.contractsLoading"
              type="primary"
              size="large"
              class="custom-apply-btn"
              @click="filterForm"
            >
              Применить
            </ElButton>
          </div>
        </div>
      </template>
    </CollapseFilter>
    <el-table
      v-loading="documentStore.contractsLoading"
      :data="documentStore.contracts?.contracts ?? []"
      stripe
      class="custom-element-table"
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
              documentStore.acts?.paginator.per_page ?? 0,
            )
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="Дата"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.date || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="№ контракта"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.number || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="from_name"
        label="Поставщик"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.from_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_parent_name"
        label="Тип продукта"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.product_parent_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="Вид продукта"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.product_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="Количество"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.quantity || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="unit_name"
        label="Ед. измерения"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.unit_name || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="total_price"
        label="Общая сумма"
      >
        <template #default="{row}:{row:ContractType}">
          {{ row.total_price ? `${formatNumber(row.total_price)} сум` : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="Действие">
        <template #default="{row}:{row:ContractType}">
          <div class="flex items-center gap-x-2">
            <RouterLink
              class="action-btn"
              :to="{name: 'contracts-view-view', params: {id:row.id}}"
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
      v-if="documentStore.contracts"
      v-model="form.page"
      :pagination="documentStore.contracts.paginator"
      class="mt-6"
      @current-change="changePage"
    />
  </div>
</template>
