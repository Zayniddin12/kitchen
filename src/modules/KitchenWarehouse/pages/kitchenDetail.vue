<script
  setup
  lang="ts"
>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";

import filterIcon from "@/assets/images/filter.svg";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";
import { useCommonStore } from "@/stores/common.store";
import {
  GroupProductType, ListInvoicesParamsType, ListInvoiceType, ListProductsParamsType, ListProductType,
  UpdatePriceDataType,
} from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { filterObjectValues, getRouteQuery, setTableColumnIndex } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";
import { useI18n } from "vue-i18n";
import { ProductType } from "@/modules/WorkShops/workshops.types";
import useComp from "@/mixins";

interface Tabs {
  title: string;
  value: number;
}

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const {num_format} = useComp();

const commonStore = useCommonStore();
const kitchenWarehouseStore = useKitchenWarehouseStore();
const settingsStore = useSettingsStore();

enum TABS {
  PRODUCTS = 1, INVOICES,
}

const defaultTab = TABS.PRODUCTS;

const tabs = computed<Tabs[]>(() => [{
  title: t("kitchenWarehouse.byProducts"),
  value: TABS.PRODUCTS,
}, {
  title: t("kitchenWarehouse.byInvoices"),
  value: TABS.INVOICES,
}]);

const validTabs = tabs.value.map(tab => tab.value);

const validRouteTab = (tab: string | null): TABS => {
  const newTab = Number(tab);
  console.log(tab, "newTab");
  return validTabs.includes(newTab as TABS) ? (newTab as TABS) : defaultTab;
};

const activeTab = computed(() => validRouteTab(route.query.tab as string | null));

const getQueryTab = (tab: TABS) => {
  const form = filterObjectValues(tab === TABS.PRODUCTS ? productsForm : invoicesForm);

  return { tab, ...form };
};

const id = computed(() => +route.params.id4);

const filterFormOpened = ref(false);

const productsForm = reactive<ListProductsParamsType>({
  page: null,
  quantity: null,
  unit_id: "",
  total_price: null,
});

const productsFormV$ = ref<ValidationType | null>(null);

const productsFormErrors = ref<Record<string, string> | null>(null);

const fetchListProducts = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_type_id: "number",
    quantity: "number",
    unit_id: "number",
    total_price: "number",
  });

  for (const key of Object.keys(productsForm)) {
    if (typeof key === "string" && query[key]) productsForm[key] = query[key] as any;
  }

  try {
    kitchenWarehouseStore.fetchListProducts(id.value, filterObjectValues(productsForm));
  } catch (error: any) {
    if (error?.error?.code === 422) {
      productsFormErrors.value = error.meta.validation_errors;
    }
  }
};

const activeProductForm = reactive<UpdatePriceDataType>({
  transportation_costs_percent: 0,
  markup_percent: 0,
  profitability_percent: 0,
  vat_percent: 0,
});

const activeProductFormErrors = ref<Record<string, string> | null>(null);

const activeProductFormV$ = ref<ValidationType | null>(null);

const permissionProductEdit = (product: ListProductType, group_product: GroupProductType) => {
  if (!kitchenWarehouseStore.listProducts) return;

  const activeEditProduct = group_product.products.find(el => el?.isEdit);
  if (activeEditProduct) activeEditProduct.isEdit = false;

  for (const key in activeProductForm) {
    if (Object.prototype.hasOwnProperty.call(product, key)) {
      activeProductForm[key] = product[key];
    }
  }

  product.isEdit = true;
};


const updateProductPrice = async (product: ListProductType | ListInvoiceType) => {

  if (!activeProductFormV$.value) return;

  if (!(await activeProductFormV$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  try {
    await kitchenWarehouseStore.updatePrice(product.id, activeProductForm);
    product.isEdit = false;

    for (const key in activeProductForm) {
      if (Object.prototype.hasOwnProperty.call(product, key)) {
        product[key] = activeProductForm[key];
      }
    }

    commonStore.successToast();

  } catch (error: any) {
    if (error?.error?.code === 422) {
      activeProductFormErrors.value = error.meta.validation_errors;
    }
  }
};


const invoicesForm = reactive<ListInvoicesParamsType>({
  page: null,
  product_type_id: "",
  quantity: null,
  unit_id: "",
  total_price: null,
  from_date: "",
  to_date: "",
  doc_number: "",
  price: null,
});

const invoicesFormV$ = ref<ValidationType | null>(null);

const invoicesFormErrors = ref<Record<string, string> | null>(null);

const fetchListInvoices = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_type_id: "number",
    quantity: "number",
    unit_id: "number",
    total_price: "number",
    from_date: "string",
    to_date: "string",
    doc_number: "string",
    price: "number",
  });

  for (const key of Object.keys(invoicesForm)) {
    if (typeof key === "string" && query[key]) invoicesForm[key] = query[key] as any;
  }

  try {
    kitchenWarehouseStore.fetchListInvoices(id.value, filterObjectValues(invoicesForm));
  } catch (error: any) {
    if (error?.error?.code === 422) {
      invoicesFormErrors.value = error.meta.validation_errors;
    }
  }
};

const permissionInvoiceEdit = (invoice: ListInvoiceType) => {
  if (!kitchenWarehouseStore.listInvoices?.invoices.length) return;
  const activeInvoice = kitchenWarehouseStore.listInvoices.invoices.find(el => el?.isEdit);
  if (activeInvoice) activeInvoice.isEdit = false;

  invoice.isEdit = true;
};

const filterForm = (data: ListProductsParamsType | ListInvoicesParamsType) => {
  const query = { ...route.query, ...filterObjectValues(data) };
  delete query.page;

  router.push({ query });
};

const clearForm = async () => {
  filterFormOpened.value = false;
  if (activeTab.value === TABS.PRODUCTS && productsFormV$.value) await productsFormV$.value.resetForm(); else if (activeTab.value === TABS.INVOICES && invoicesFormV$.value) await invoicesFormV$.value.resetForm();
  router.push({ query: { tab: activeTab.value } });
};

const changePage = (value: number) => {
  router.push({
    query: {
      ...route.query,
      page: value,
    },
  });
};

const { setBreadCrumb } = useBreadcrumb();

const title = computed(() => {
  return commonStore.getTitle(`kitchen_warehouse_id-${id.value}`);
});

const setBreadCrumbFn = () => {
  kitchenWarehouseStore.fetchDynamicItemState(+route.params.id);

  if (!kitchenWarehouseStore.dynamicItemState) return;

  const title1 = commonStore.getTitle(`kitchen_type_id-${route.params.id3}`);

  setBreadCrumb([{
    label: "kitchenWarehouse.title",
    isTranslate: true,
    isActionable: false,
  }, {
    label: kitchenWarehouseStore.dynamicItemState.title,
    to: { name: "kitchen-warehouse-title-id" },
  }, {
    label: title1,
    to: { name: "kitchen-warehouse-id-id3" },
  }, {
    label: title.value,
    isActionable: true,
  }]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

const fetchData = () => {
  if (activeTab.value === TABS.PRODUCTS) {
    fetchListProducts();
  } else {
    fetchListInvoices();
  }
};

watch(() => route.query, () => {
  fetchData();
}, { immediate: true });

watch(() => route.params.id4, () => {
  kitchenWarehouseStore.fetchFillingPercentage(id.value);
}, { immediate: true });

onMounted(() => {
  settingsStore.GET_VID_PRODUCT({ per_page: 200 });
  settingsStore.GET_UNITS();
});

const packagingPage = () => {
  router.push({
    name: "kitchen-warehouse-packaging-id-id3-id4",
    params: {
      id: route.params.id,
      id3: route.params.id3,
      id4: route.params.id4,
    },
  });
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px]">{{ title }}</h1>

      <button class="custom-light-btn" @click="packagingPage">Расфасовка</button>
    </div>
    <div class="rounded-2xl py-3 px-4 border mt-6">
      <h3 class="text-dark font-medium text-lg">{{ t("kitchenWarehouse.filling") }}</h3>
      <h2 class="text-dark text-[32px] font-semibold mt-3">
        {{ kitchenWarehouseStore.fillingPercentage?.percentage ?? 0 }}%
      </h2>
      <ElProgress
        :stroke-width="16"
        :percentage="kitchenWarehouseStore.fillingPercentage?.percentage ?? 0"
        :show-text="false"
        status="success"
        class="mt-2"
      />
      <p class="mt-4 text-xs text-[#A8AAAE]">
        {{ t("kitchenWarehouse.description") }}
      </p>
    </div>

    <div class="flex items-center justify-between my-[24px]">
      <div class="app-tabs">
        <RouterLink
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="['app-tab', { 'app-tab--active': activeTab === item.value }]"
          :to="{ query: getQueryTab(item.value) }"
        >
          {{ item.title }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-4 max-w-[309px]">
        <ElDropdown
          placement="bottom"
          class="block w-full"
        >
          <ElButton
            size="large"
            class="h-12 !bg-white-blue w-full !border-white-blue"
          >
            <div class="flex items-center gap-x-2">
              <img
                src="@/assets/images/download.svg"
                class="size-5"
                alt="download img"
              />
              <span class="font-medium text-dark-gray">{{ t("method.download") }}</span>
            </div>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu class="p-3 rounded-lg">
              <ElDropdownItem
                class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
              >
                <img
                  src="@/assets/images/icons/pdf.svg"
                  alt="pdf"
                  class="w-[13px] h-[17px]"
                />
                <span class="text-sm text-dark-gray font-medium">
                  {{ t("common.файл", { format: "PDF" }) }}
                </span>
              </ElDropdownItem>
              <ElDropdownItem
                class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
              >
                <img
                  src="@/assets/images/icons/excel.svg"
                  alt="pdf"
                  class="w-[13px] h-[17px]"
                />
                <span class="text-sm text-dark-gray font-medium">
                  {{ t("common.файл", { format: "Excel" }) }}
                </span>
              </ElDropdownItem>
              <ElDropdownItem
                class="flex items-center gap-x-4 rounded-lg px-3 py-2.5"
              >
                <img
                  src="@/assets/images/icons/1c.svg"
                  alt="pdf"
                  class="w-[13px] h-[17px]"
                />
                <span class="text-sm text-dark-gray font-medium">
                  {{ t("common.файл", { format: "1C" }) }}
                </span>
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <ElButton
          @click="filterFormOpened = !filterFormOpened"
          size="large"
          :class="[
            'app-filter-btn h-12 w-full',
            `${
              filterFormOpened
                ? '!bg-blue !text-white app-filter-btn--active'
                : '!bg-white-blue !border-white-blue !text-dark-gray'
            }`,
          ]"
        >
          <div class="flex items-center gap-x-3">
            <svg
              :data-src="filterIcon"
              class="app-filter-btn__icon"
            />
            <span class="text-sm font-medium">
              {{ t("common.filter") }}
            </span>
          </div>
        </ElButton>
      </div>
    </div>

    <div>
      <CollapseFilter v-model="filterFormOpened">
        <template #body>
          <TransitionGroup
            :name="activeTab > defaultTab ? 'nested' : 'nested-reverse'"
            tag="div"
            class="relative"
          >
            <template v-if="activeTab === TABS.PRODUCTS">
              <AppForm
                :value="productsForm"
                @validation="value => productsFormV$ = value"
                :validation-errors="productsFormErrors"
                class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2"
              >
                <AppSelect
                  v-model="productsForm.product_type_id"
                  prop="product_type_id"
                  :placeholder="t('product.name')"
                  :label="t('product.name')"
                  filterable
                  label-class="text-[#7F7D83]"
                  :items="settingsStore.vidProduct.product_types"
                  item-label="name"
                  item-value="id"
                />
                <AppInput
                  v-model="productsForm.quantity"
                  prop="quantity"
                  custom-type="number"
                  :label="t('common.quantity')"
                  :placeholder="t('common.quantity')"
                  label-class="text-[#7F7D83]"
                />
                <AppSelect
                  v-model="productsForm.unit_id"
                  prop="unit_id"
                  :label="t('common.measurement')"
                  :placeholder="t('common.measurement')"
                  label-class="text-[#7F7D83]"
                  :items="settingsStore.units.units"
                  item-label="name"
                  item-value="id"
                />
                <AppInput
                  v-model.number="productsForm.total_price"
                  prop="total_price"
                  type="number"
                  :label="t('common.sum')"
                  :placeholder="t('common.sum')"
                  label-class="text-[#7F7D83]"
                />
              </AppForm>
              <div class="flex items-center mt-2.5 justify-between">
                <div class="text-[#8F9194] text-sm">
                  {{ t("common.found") }}:
                  {{
                    kitchenWarehouseStore.listProducts?.pagination.total_count ?? 0
                  }}
                </div>
                <div class="flex items-center gap-x-4">
                  <button
                    @click="clearForm"
                    class="custom-reset-btn"
                  >
                    {{ t("method.reset") }}
                  </button>
                  <button
                    @click="filterForm(productsForm)"
                    class="custom-apply-btn"
                  >
                    {{ t("method.apply") }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <AppForm
                :value="invoicesForm"
                @validation="(value) => invoicesFormV$ = value"
                :validation-errors="invoicesFormErrors"
                class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2"
              >
                <AppDatePicker
                  v-model="invoicesForm.from_date"
                  prop="from_date"
                  :placeholder="t('common.fromDate')"
                  :label="t('common.fromDate')"
                  label-class="text-[#7F7D83]"
                />
                <AppDatePicker
                  v-model="invoicesForm.to_date"
                  prop="to_date"
                  :placeholder="t('common.endDate')"
                  :label="t('common.endDate')"
                  label-class="text-[#7F7D83]"
                />

                <AppInput
                  v-model="invoicesForm.doc_number"
                  prop="doc_number"
                  :placeholder="t('document.invoiceNumber2')"
                  :label="t('document.invoiceNumber2')"
                  label-class="text-[#7F7D83]"
                />
                <AppInput
                  v-model.number="invoicesForm.total_price"
                  prop="total_price"
                  type="number"
                  :placeholder="t('common.sum')"
                  :label="t('common.sum')"
                  label-class="text-[#7F7D83]"
                />
                <AppSelect
                  v-model="invoicesForm.product_type_id"
                  prop="product_type_id"
                  :placeholder="t('product.name')"
                  :label="t('product.name')"
                  label-class="text-[#7F7D83]"
                  :items="settingsStore.vidProduct.product_types"
                  item-label="name"
                  item-value="id"
                />
                <AppInput
                  v-model="invoicesForm.quantity"
                  prop="quantity"
                  custom-type="number"
                  :placeholder="t('common.quantity')"
                  :label="t('common.quantity')"
                  label-class="text-[#7F7D83]"
                />
                <AppSelect
                  v-model="invoicesForm.unit_id"
                  prop="unit_id"
                  :placeholder="t('common.measurement')"
                  :label="t('common.measurement')"
                  label-class="text-[#7F7D83]"
                  :items="settingsStore.units.units"
                  item-label="name"
                  item-value="id"
                />
                <AppInput
                  v-model.number="invoicesForm.price"
                  prop="price"
                  type="number"
                  :placeholder="t('common.price')"
                  :label="t('common.price')"
                  label-class="text-[#7F7D83]"
                />
              </AppForm>
              <div class="flex items-center mt-2.5 justify-between">
                <div class="text-[#8F9194] text-sm">
                  {{ t("common.found") }}:
                  {{
                    kitchenWarehouseStore.listInvoices?.pagination.total_count ?? 0
                  }}
                </div>
                <div class="flex items-center gap-x-4">
                  <button
                    @click="clearForm"
                    class="custom-reset-btn"
                  >
                    {{ t("method.reset") }}
                  </button>
                  <button
                    @click="filterForm(invoicesForm)"
                    class="custom-apply-btn"
                  >
                    {{ t("method.apply") }}
                  </button>
                </div>
              </div>
            </template>
          </TransitionGroup>
        </template>
      </CollapseFilter>

      <AppForm
        :value="activeProductForm"
        :validation-errors="activeProductFormErrors"
        @validation="value => activeProductFormV$ = value"
      >
        <TransitionGroup
          :name="activeTab > defaultTab ? 'nested' : 'nested-reverse'"
          tag="div"
          class="relative"
        >
          <div
            v-if="activeTab === TABS.PRODUCTS"
            class="inner"
          >
            <ElTable
              v-loading="kitchenWarehouseStore.listProductsLoading"
              :data="kitchenWarehouseStore.listProducts?.products ?? []"
              stripe
              class="custom-element-table"
              :empty-text="$t('common.empty')"
            >
              <ElTableColumn
                prop="idx"
                label="№"
                width="100"
              >
                <template #default="{$index}">
                  {{
                    setTableColumnIndex($index, productsForm.page ?? 0, kitchenWarehouseStore.listProducts?.pagination?.per_page ?? 0)
                  }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="product_name"
                label="Название продукта"
                width="200"
              >
                <template #default="{row}">
                  {{ row.product_name || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="quantity"
                label="Количество"
                width="200"
              >
                <template #default="{row}:{row:ProductType}">
                  {{ num_format(row.quantity) || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="measure"
                label="Ед. измерения"
                width="200"
              >
                <template #default="{row}:{row:ProductType}">
                  {{ row.unit_name || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="price"
                label="Цена"
                width="200"
              >
                <template #default="{row}:{row:ProductType}">
                  {{ row.price ? row.price + " UZS" : "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="total_price"
                label="Сумма"
                width="200"
              >
                <template #default="{row}:{row:ProductType}">
                  {{ row.total_price ? row.total_price + " UZS" : "—" }}
                </template>
              </ElTableColumn>
              <!--            <ElTableColumn-->
              <!--              prop="action"-->
              <!--              align="right"-->
              <!--              label="Действие"-->
              <!--            >-->
              <!--              <template #default="{row}">-->
              <!--                <button class="action-btn">-->
              <!--                  <img-->
              <!--                    src="@/assets/images/download.svg"-->
              <!--                    alt="download"-->
              <!--                  />-->
              <!--                </button>-->
              <!--              </template>-->
              <!--            </ElTableColumn>-->
            </ElTable>

            <div class="my-4 flex items-center justify-between">
              <span class="text-2xl font-bold">{{ $t("common.totalSum") }}</span>
              <span
                class="text-xl font-medium">{{ kitchenWarehouseStore.listProducts?.total_price_formatted && kitchenWarehouseStore.listProducts?.total_price_formatted
                }}</span>
            </div>
            <AppPagination
              v-if="kitchenWarehouseStore.listProducts"
              v-model="productsForm.page"
              :pagination="kitchenWarehouseStore.listProducts?.pagination"
              class="mt-6"
              @current-change="changePage"
            />
          </div>
          <div v-else-if="activeTab === TABS.INVOICES">
            <ElTable
              v-loading="kitchenWarehouseStore.listInvoicesLoading"
              :data="kitchenWarehouseStore.listInvoices?.invoices ?? []"
              stripe
              class="custom-element-table"
            >
              <ElTableColumn
                prop="idx"
                label="№"
                width="80"
              >
                <template #default="{$index}">
                  {{
                    setTableColumnIndex($index, invoicesForm.page as number, kitchenWarehouseStore.listInvoices?.pagination.per_page ?? 0)
                  }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="product_name"
                :label="t('product.name')"
              >
                <template #default="{row}:{row: ListInvoiceType}">
                  {{ row.product_name || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="quantity"
                :label="t('common.quantity')"
              >
                <template #default="{row}:{row: ListInvoiceType}">
                  {{ row.quantity.toFixed(2) || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="unit_name"
                :label="t('common.measurement')"
              >
                <template #default="{row}:{row: ListInvoiceType}">
                  {{ row.unit_name || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="net_price"
                :label="t('Цена закупки')"
              >
                <template #default="{row}:{row: ListInvoiceType}">
                  {{ row.net_price || "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="transportation_costs_percent"
                :label="t('common.tzr')"
                width="130"
              >
                <template #default="{row}:{row: ListInvoiceType}">
                  <AppInput
                    v-if="row?.isEdit"
                    v-model="activeProductForm.transportation_costs_percent"
                    prop="transportation_costs_percent"
                    class="w-[50px] mb-0 py-0.5"
                    required
                  />
                  <template v-else>
                    {{ row.transportation_costs_percent }}%
                  </template>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="markup_percent"
                :label="t('kitchenWarehouse.markup')"
                width="130"
              >
                <template #default="{ row }: { row: ListInvoiceType }">
                  <AppInput
                    v-if="row.isEdit"
                    v-model="activeProductForm.markup_percent"
                    prop="markup_percent"
                    class="w-[50px] mb-0 py-0.5"
                    required
                  />
                  <template v-else>
                    {{ row.markup_percent }}%
                  </template>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="profitability_percent"
                :label="t('kitchenWarehouse.rentab')"
                width="120"
              >
                <template #default="{ row }: { row: ListInvoiceType }">
                  <AppInput
                    v-if="row.isEdit"
                    v-model="activeProductForm.profitability_percent"
                    prop="profitability_percent"
                    class="w-[50px] mb-0 py-0.5"
                    required
                  />
                  <template v-else>
                    {{ row.profitability_percent }}%
                  </template>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="vat_percent"
                :label="t('common.ndc')"
              >
                <template #default="{ row }: { row: ListInvoiceType }">
                  <AppInput
                    v-if="row.isEdit"
                    v-model="activeProductForm.vat_percent"
                    prop="vat_percent"
                    class="w-[50px] mb-0 py-0.5"
                    required
                  />
                  <template v-else>
                    {{ row.vat_percent }}%
                  </template>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="price"
                :label="t('Цена с наценкой')"
              >
                <template #default="{ row }: { row: ListProductType }">
                  {{ row.price ? `${row.price} ${t("currency.sum")}` : "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="total_price"
                :label="t('common.sum')"
              >
                <template #default="{ row }: { row: ListProductType }">
                  {{ row.total_price ? `${row.total_price} ${t("currency.sum")}` : "—" }}
                </template>
              </ElTableColumn>
              <ElTableColumn :label="t('common.action')">
                <template #default="{ row }: { row: ListInvoiceType }">
                  <template v-if="row.isEdit">
                    <button
                      v-if="$can('update', 'Button')"
                      class="action-btn"
                      @click="updateProductPrice(row)"
                    >
                      <img
                        src="@/assets/images/icons/check.svg"
                        alt="check"
                      />
                    </button>
                    <button
                      class="action-btn ml-[8px]"
                      @click="row.isEdit = false"
                    >
                      <img
                        src="@/assets/images/icons/x.svg"
                        alt="close icon"
                      />
                    </button>
                  </template>
                  <button
                    v-else
                    class="action-btn"
                    @click="permissionInvoiceEdit(row)"
                  >
                    <img
                      src="@/assets/images/icons/edit.svg"
                      alt="edit"
                    />
                  </button>
                </template>
              </ElTableColumn>

            </ElTable>
            <AppPagination
              v-if="kitchenWarehouseStore.listInvoices"
              v-model="invoicesForm.page"
              :pagination="kitchenWarehouseStore.listInvoices.pagination"
              class="mt-6"
              @current-change="changePage"
            />
          </div>
        </TransitionGroup>
      </AppForm>
    </div>
  </div>
</template>
