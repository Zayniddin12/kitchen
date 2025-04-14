<script
  setup
  lang="ts"
>

import { useRoute, useRouter } from "vue-router";
import { useWorkshopsStore } from "@/modules/WorkShops/workshops.store";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import filterIcon from "@/assets/images/filter.svg";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {
  WarehouseBasesInvoicesParamsType,
  WarehouseBasesInvoiceType,
  WarehouseBasesProductsParamsType,
  WarehouseBasesProductType,
} from "@/modules/WarehouseBases/warehouse-bases.types";
import { filterObjectValues, getRouteQuery, setTableColumnIndex } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { useDocumentStore } from "@/modules/Document/document.store";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";

const workshopsStore = useWorkshopsStore();
const settingsStore = useSettingsStore();
const documentStore = useDocumentStore();


const route = useRoute();
const router = useRouter();

const filterFormOpened = ref(false);


const districtId = computed(() => +route.params.district_id);

const productId = computed(() => +route.params.workshop_id);

const productsForm = reactive<WarehouseBasesProductsParamsType>({
  page: null,
  product_id: "",
  measurement_unit_id: "",
  quantity: null,
  price: null,
});

const productsFormV$ = ref<ValidationType | null>(null);

const productsFormErrors = ref<Record<string, string> | null>(null);

const fetchProducts = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_id: "number",
    measurement_unit_id: "number",
    quantity: "number",
    price: "number",
  });

  productsForm.price = query.price ?? null;
  productsForm.page = query.page ?? null;
  productsForm.product_id = query.product_id ?? "";
  productsForm.measurement_unit_id = query.measurement_unit_id ?? "";
  productsForm.quantity = query.quantity ?? null;

  try {

    if (route.params.workshop_id) await workshopsStore.fetchProducts(Number(route.params.workshop_id), filterObjectValues(productsForm));
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
  net_price: null,
  to: "",
  from: "",
  document_id: "",
});

const invoicesFormV$ = ref<ValidationType | null>(null);

const invoicesFormErrors = ref<Record<string, string> | null>(null);

const fetchInvoices = async () => {
  const query = getRouteQuery(route.query, {
    page: "number",
    product_id: "number",
    measurement_unit_id: "number",
    quantity: "number",
    price: "number",
    net_price: "number",
    to: "string",
    from: "string",
    document_id: "number",
  });

  invoicesForm.net_price = query.net_price ?? null;
  invoicesForm.to = query.to ?? "";
  invoicesForm.price = query.price ?? null;
  invoicesForm.from = query.from ?? "";
  invoicesForm.page = query.page ?? null;
  invoicesForm.product_id = query.product_id ?? "";
  invoicesForm.measurement_unit_id = query.measurement_unit_id ?? "";
  invoicesForm.quantity = query.quantity ?? null;
  invoicesForm.document_id = query.document_id ?? "";

  try {
    if (id.value) workshopsStore.fetchInvoices(id.value, filterObjectValues(invoicesForm));
  } catch (error: any) {
    if (error?.error?.code === 422) {
      invoicesFormErrors.value = error.meta.validation_errors;
    }
  }
};

const filterForm = () => {
  const query = { ...route.query, ...filterObjectValues(productsForm) };
  delete query.page;

  router.push({ query });
};

const clearForm = async () => {
  filterFormOpened.value = false;
  await productsFormV$.value.resetForm();

};

const changePage = (value: number) => {
  router.push({ query: { ...route.query, page: value } });
};

const id = ref<number | "">("");

const fetchData = () => {
  fetchProducts();

};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = async () => {

  workshopsStore.getManagementWorkshop(districtId.value, productId.value);

  if (!workshopsStore.activeManagementBase) return;

  setBreadCrumb([
    {
      label: "Цех",
    },
    {
      label: workshopsStore.activeManagementBase?.name ?? "",
    },
    {
      label: workshopsStore.activeManagementBase?.workshops?.name ?? "",
      isActionable: true,
    },
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
  { immediate: true },
);

watch(() => route.params.workshop_id, async (newId) => {
  if (newId) {
    await workshopsStore.fetchFillingPercentage(Number(newId));
  }
}, { immediate: true });


onMounted(() => {
  settingsStore.GET_VID_PRODUCT({ per_page: 100 });
  settingsStore.GET_UNITS();
  documentStore.fetchDrafts("received", { doc_type: "invoice", per_page: 100 });
});

const enterToFactory = () => {
  router.push({
    name: "warehouse-packaging",
    params: { district_id: route.params.district_id, product_id: route.params.product_id },
    query: { id: id.value },
  });
};

const packagingPage = () => {
  router.push({
    name: "workshop-packaging",
    params: {
      district_id: route.params.district_id,
      factory_id: route.params.workshop_id,
    },
  });
};
</script>

<template>
  <section class="warehouse">
    <div v-if="workshopsStore.activeManagementBase?.workshops">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-[32px] text-dark">
          {{ workshopsStore.product?.title ?? route.meta.title }}
        </h1>

        <button class="custom-light-btn" @click="packagingPage">Переработка</button>
      </div>

      <div class="rounded-2xl py-3 px-4 border mt-6">
        <h3 class="text-dark font-medium text-lg">
          Заполнение склада
        </h3>
        <h2 class="text-dark text-[32px] font-semibold mt-3">
          {{ workshopsStore.fillingPercentage?.percentage ?? 0 }}%
        </h2>
        <ElProgress
          :stroke-width="16"
          :percentage="workshopsStore.fillingPercentage?.percentage ?? 0"
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
        <div class="flex items-center gap-4 justify-end">

          <div class="grid grid-cols-2 gap-4 w-[386px]">
            <!--            <AppSelect-->
            <!--              v-model="id"-->
            <!--              size="large"-->
            <!--              class="mb-0"-->
            <!--              :items="settingsStore.baseWarehouses?.base_warehouses ?? []"-->
            <!--              item-value="id"-->
            <!--              item-label="name"-->
            <!--            />-->
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
              :value="productsForm"
              @validation="value => productsFormV$ = value"
              :validation-errors="productsFormErrors"
              class="grid gap-x-4 grid-cols-4"
            >
              <AppSelect
                v-model="productsForm.product_id"
                :items="settingsStore.vidProduct.product_types"
                item-label="name"
                item-value="id"
                filterable
                label="Название продукта"
                placeholder="Название продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                clearable
              />
              <AppInput
                v-model="productsForm.quantity"
                property="quantity"
                custom-type="number"
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
                prop="price"
                label="Сумма"
                placeholder="Сумма"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
            </AppForm>
          </TransitionGroup>
          <div class="flex items-center mt-[10px] justify-between">
            <div class="text-[#8F9194] text-[14px]">Найдено:
              {{
                workshopsStore.products?.pagination.total_count ?? 0
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
          class="inner"
        >
          <template v-if="workshopsStore.products?.grouped_products.length">
            <div
              v-for="item in workshopsStore.products.grouped_products"
              :key="item.parent_name"
            >
              <h2 class="text-dark font-medium text-lg mb-3">
                {{ item.parent_name }}
              </h2>
              <ElTable
                :data="item.products && item.products.length ? item.products : []"
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
                      setTableColumnIndex($index, productsForm.page ?? 0, workshopsStore.products?.pagination.per_page ?? 0)
                    }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="product_name"
                  label="Название продукта"
                  width="200"
                >
                  <template #default="{row}:{row:WarehouseBasesProductType}">
                    {{ row.product_name || "—" }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="quantity"
                  label="Количество"
                  width="200"
                >
                  <template #default="{row}:{row:WarehouseBasesProductType}">
                    {{ row.quantity || "—" }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="unit_name"
                  label="Ед. измерения"
                  width="200"
                >
                  <template #default="{row}:{row:WarehouseBasesProductType}">
                    {{ row.unit_name || "—" }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="price"
                  label="Цена"
                  width="200"
                >
                  <template #default="{row}:{row:WarehouseBasesProductType}">
                    {{ row.price || "—" }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="total_price"
                  label="Сумма"
                  width="200"
                >
                  <template #default="{row}:{row:WarehouseBasesProductType}">
                    {{ row.total_price || "—" }}
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
                  class="text-xl font-medium">{{ workshopsStore.products?.total_price_formatted && workshopsStore.products.total_price_formatted
                  }}</span>
              </div>
            </div>
            <AppPagination
              v-if="workshopsStore.products"
              v-model="productsForm.page"
              :pagination="workshopsStore.products.pagination"
              class="mt-6"
              @current-change="changePage"
            />
          </template>
          <AppEmpty
            class="min-h-0"
            v-else
          />
        </div>

      </TransitionGroup>
    </div>
  </section>
</template>

<style lang="scss">
.custom-element-table table {
  width: 100% !important;
}
</style>