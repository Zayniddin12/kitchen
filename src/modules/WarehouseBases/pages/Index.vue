<script
    setup
    lang="ts"
>

import { RouterLink, useRoute, useRouter } from "vue-router";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import filterIcon from "@/assets/images/filter.svg";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {
  WarehouseBasesInvoicesParamsType,
  WarehouseBasesProductsParamsType, WarehouseBasesProductType
} from "@/modules/WarehouseBases/warehouse-bases.types";
import { filterObjectValues, getRouteQuery, setTableColumnIndex } from "@/utils/helper";
import { ListInvoicesParamsType, ListProductsParamsType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import { useSettingsStore } from "@/modules/Settings/store";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";

const warehouseBasesStore = useWarehouseBasesStore();
const settingsStore = useSettingsStore();


const route = useRoute();
const router = useRouter();

enum TABS {
  PRODUCTS = 1,
  INVOICES
}

const tabItems = computed(() => {
  return [
    {
      value: TABS.PRODUCTS,
      name: "По продуктам"
    },
    {
      value: TABS.INVOICES,
      name: "По накладным"
    }
  ];
});

const filterFormOpened = ref(false);

const defaultTab = TABS.PRODUCTS;

const validTabs = tabItems.value.map(tab => tab.value);

const validRouteTab = (tab: string | null): TABS => {
  const newTab = Number(tab);
  return validTabs.includes(newTab as TABS) ? (newTab as TABS) : defaultTab;
};

const activeTab = computed(() =>
    validRouteTab(route.query.tab as string | null)
);

const getQueryTab = (tab: TABS) => {
  const form = filterObjectValues(
      tab === TABS.PRODUCTS ? productsForm : invoicesForm
  );

  return { tab, ...form };
};

const productTableData = computed(() => {
  const data = [];

  for (let i = 1; i <= 10; i++) {
    data.push({
      idx: i,
      product_name: "Говядина",
      quantity: Math.floor(Math.random() * 11) + 90,
      unit_measurement: "кг",
      sum: "6 400 000 сум",
      action: true
    });
  }

  return data;
});

const invoiceTableData = computed(() => {
  const data = [];

  for (let i = 1; i <= 10; i++) {
    data.push({
      idx: i,
      product_name: "Говядина",
      invoice: "NK-00000",
      invoice_date: "23.08.2024",
      quantity: Math.floor(Math.random() * 11) + 90,
      unit_measurement: "кг",
      price: "80 000 сум",
      sum: "6 400 000 сум"
    });
  }

  return data;
});

const districtId = computed(() => +route.params.district_id);

const productId = computed(() => +route.params.product_id);

const productsForm = reactive<WarehouseBasesProductsParamsType>({
  page: null,
  product_id: "",
  measurement_unit_id: "",
  quantity: null,
  price: null
});

const productsFormErrors = ref<Record<string, string> | null>(null);

const fetchProducts = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_id: "number",
    measurement_unit_id: "number",
    quantity: "number",
    price: "number"
  });

  for (const key of Object.keys(productsForm)) {
    if (typeof key === "string" && query[key])
      productsForm[key] = query[key] as any;
  }

  try {
    warehouseBasesStore.fetchProducts(productId.value, filterObjectValues(productsForm));
  } catch (error: any) {
    if (error?.error?.code === 422) {
      productsFormErrors.value = error.meta.validation_errors;
    }
  }
};

const invoicesForm = reactive<WarehouseBasesInvoicesParamsType>({
  page: null,
  product_id: "",
  measurement_unit_id: "",
  quantity: null,
  price: null,
  to_date: "",
  from_date: "",
  document_id: ""
});

const invoicesFormErrors = ref<Record<string, string> | null>(null);

const fetchInvoices = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_id: "number",
    measurement_unit_id: "number",
    quantity: "number",
    price: "number",
    to_date: "string",
    from_date: "string",
    document_id: "number"
  });

  for (const key of Object.keys(invoicesForm)) {
    if (typeof key === "string" && query[key])
      invoicesForm[key] = query[key] as any;
  }

  try {
    warehouseBasesStore.fetchInvoices(productId.value, filterObjectValues(invoicesForm));
  } catch (error: any) {
    if (error?.error?.code === 422) {
      invoicesFormErrors.value = error.meta.validation_errors;
    }
  }
};

const filterForm = () => {
  const data = activeTab.value === TABS.PRODUCTS ? productsForm : invoicesForm;

  const query = { ...route.query, ...filterObjectValues(data) };
  delete query.page;

  router.push({ query });
};

const clearForm = () => {
  router.push({ query: { tab: activeTab.value } });
};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

const fetchData = () => {
  if (activeTab.value === TABS.PRODUCTS) {
    fetchProducts();
  } else {
    fetchInvoices();
  }
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = async () => {
  warehouseBasesStore.getProduct(districtId.value, productId.value);

  if (!warehouseBasesStore.district || !warehouseBasesStore.product) return;

  setBreadCrumb([
    {
      label: "Базы складов"
    },
    {
      label: warehouseBasesStore.district?.title ?? ""
    },
    {
      label: warehouseBasesStore.product?.title ?? "",
      isActionable: true
    }
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

watch(
    () => route.query,
    () => {
      fetchData();
    },
    { immediate: true }
);

watch(() => route.params, () => {
  warehouseBasesStore.fetchFillingPercentage(districtId.value);
});

onMounted(() => {
  settingsStore.GET_VID_PRODUCT({ per_page: 100 });
  settingsStore.GET_UNITS();
});

</script>

<template>
  <section class="warehouse">
    <div v-if="warehouseBasesStore.product">
      <h1 class="font-semibold text-[32px] text-dark">
        {{ warehouseBasesStore.product?.title ?? "" }}
      </h1>
      <div class="rounded-2xl py-3 px-4 border mt-6">
        <h3 class="text-dark font-medium text-lg">
          Заполнение склада
        </h3>
        <h2 class="text-dark text-[32px] font-semibold mt-3">
          {{ warehouseBasesStore.fillingPercentage?.percentage ?? 0 }}%
        </h2>
        <ElProgress
            :stroke-width="16"
            :percentage="warehouseBasesStore.fillingPercentage?.percentage ?? 0"
            :show-text="false"
            status="success"
            class="mt-2"
            striped
        />
        <p class="mt-4 text-xs text-black-sub">
          Этот элемент показывает процент заполненности склада, помогая вам следить за остатками и эффективно управлять
          запасами.
        </p>
      </div>
      <div class="mt-6">
        <div class="flex items-center gap-4 justify-between">
          <div class="app-tabs">
            <RouterLink
                v-for="item in tabItems"
                :key="item.value"
                :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
                :to="{ query: getQueryTab(item.value) }"
            >
              {{ item.name }}
            </RouterLink>
          </div>
          <div class="grid grid-cols-3 gap-4 w-[486px]">
            <AppSelect
                size="large"
                class="mb-0"
            />
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
                  <span class="font-medium text-dark-gray">Скачать</span>
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
                    PDF файл
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
                    Excel файл
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
                    1C файл
                  </span>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
            <ElButton
                @click="filterFormOpened = !filterFormOpened"
                size="large"
                :class="['app-filter-btn h-12 w-full', `${filterFormOpened ? '!bg-blue !text-white app-filter-btn--active' : '!bg-white-blue !border-white-blue !text-dark-gray'}`]"
            >
              <div class="flex items-center gap-x-3">
                <svg
                    :data-src="filterIcon"
                    class="app-filter-btn__icon"
                />
                <span class="text-sm font-medium">
                  Фильтр
                </span>
              </div>
            </ElButton>
          </div>
        </div>
      </div>
      <CollapseFilter v-model="filterFormOpened">
        <template #body>
          <TransitionGroup
              name="nested"
              :duration="{ enter: 500, leave: 1500 }"
              tag="div"
              class="mt-4 relative"
          >
            <AppForm
                v-if="activeTab === TABS.PRODUCTS"
                :value="productsForm"
                :validation-errors="productsFormErrors"
                class="grid gap-x-4 grid-cols-4"
            >
              <AppSelect
                  v-model="productsForm.product_id"
                  :items="settingsStore.vidProduct.product_types"
                  item-label="name"
                  item-value="id"
                  label="Название продукта"
                  placeholder="Название продукта"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                  clearable
              />
              <AppInput
                  v-model.number="productsForm.quantity"
                  property="quantity"
                  type="number"
                  label="Количество"
                  placeholder="Количество"
                  label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppSelect
                  v-model="productsForm.measurement_unit_id"
                  :items="settingsStore.units.units"
                  item-label="name"
                  item-value="id"
                  property="measurement_unit_id"
                  label="Ед. измерения"
                  placeholder="Ед. измерения"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  clearable
              />
              <AppInput
                  v-model.number="productsForm.price"
                  property="price"
                  label="Сумма"
                  placeholder="Сумма"
                  label-class="text-[#A8AAAE] text-xs font-medium"
              />
            </AppForm>
            <template v-else>
              <div class="grid gap-4 grid-cols-6">
                <AppDatePicker
                    label="С этой даты"
                    placeholder="С этой даты"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppDatePicker
                    label="По эту дату"
                    placeholder="По эту дату"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppSelect
                    class="col-span-2"
                    label="№ накладной"
                    placeholder="№ накладной"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppInput
                    class="col-span-2"
                    placeholder="Сумма"
                    label="Сумма"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
              </div>
              <div class="grid grid-cols-4 gap-4 mt-1">
                <AppSelect
                    label="Название продукта"
                    placeholder="Название продукта"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppInput
                    label="Количество"
                    placeholder="Количество"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppSelect
                    label="Ед. измерения"
                    placeholder="Ед. измерения"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
                <AppInput
                    label="Цена"
                    placeholder="Цена"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
              </div>
            </template>
          </TransitionGroup>
          <div class="flex items-center mt-[10px] justify-between">
            <div class="text-[#8F9194] text-[14px]">Найдено:
              {{
                (activeTab === TABS.PRODUCTS ? warehouseBasesStore.products?.paginator.total_count : warehouseBasesStore.invoices?.pagination.total_count) ?? 0
              }}
            </div>
            <div class="flex items-center">
              <button
                  @click="clearForm"
                  class="custom-reset-btn"
              >
                Сбросить
              </button>
              <button
                  @click="filterForm"
                  class="custom-apply-btn ml-[16px]"
              >
                Применить
              </button>
            </div>
          </div>
        </template>
      </CollapseFilter>
      <TransitionGroup
          name="nested"
          :duration="{ enter: 500, leave: 1500 }"
          tag="div"
          class="relative overflow-x-hidden"
      >
        <div
            v-if="activeTab === TABS.PRODUCTS"
            class="inner"
        >
          <ElTable
              v-loading="warehouseBasesStore.productsLoading"
              :data="warehouseBasesStore.products?.warehouse_products"
              stripe
              class="custom-element-table"
          >
            <ElTableColumn
                prop="idx"
                label="№"
                :width="150"
            >
              <template #default="{$index}">
                {{
                  setTableColumnIndex($index, productsForm.page ?? 0, warehouseBasesStore.products?.paginator.per_page ?? 0)
                }}
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="product_name"
                label="Название продукта"
            >
              <template #default="{row}:{row:WarehouseBasesProductType}">
                {{ row.product.name || "—" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="quantity"
                label="Количество"
            >
              <template #default="{row}:{row:WarehouseBasesProductType}">
                {{ row.quantity || "—" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="measure"
                label="Ед. измерения"
            >
              <template #default="{row}:{row:WarehouseBasesProductType}">
                {{ row.product.measure || "—" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="price_formatted"
                label="Сумма"
            >
              <template #default="{row}:{row:WarehouseBasesProductType}">
                {{ row.price_formatted || "—" }}
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="action"
                align="right"
                label="Действие"
            >
              <template #default="{row}">
                <button class="action-btn">
                  <img
                      src="@/assets/images/download.svg"
                      alt="download"
                  />
                </button>
              </template>
            </ElTableColumn>
          </ElTable>
          <AppPagination
              v-if="warehouseBasesStore.products"
              :pagination="warehouseBasesStore.products.paginator"
              class="mt-6"
              @current-change="changePage"
          />
        </div>
        <div
            v-else-if="activeTab === TABS.INVOICES"
            class="inner"
        >
          <ElTable
              :data="invoiceTableData"
              class="custom-element-table"
              stripe
          >
            <ElTableColumn
                prop="idx"
                label="№"
                :width="150"
            />
            <ElTableColumn
                prop="product_name"
                label="Название продукта"
            />
            <ElTableColumn
                prop="invoice"
                label="№ накладной"
            />
            <ElTableColumn
                prop="invoice_date"
                label="Дата накладной"
            />
            <ElTableColumn
                prop="quantity"
                label="Количество"
            />
            <ElTableColumn
                prop="unit_measurement"
                label="Ед. измерения"
            />
            <ElTableColumn
                prop="price"
                label="Цена"
            />
            <ElTableColumn
                prop="sum"
                label="Сумма"
            />
          </ElTable>
          <div class="mt-6 flex items-center justify-between">
            <div class="text-cool-gray text-xs">
              Показано 1–12 из 100 результатов
            </div>

            <el-pagination
                class="float-right"
                background
                layout="prev, pager, next"
                :total="1000"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style lang="scss">

</style>