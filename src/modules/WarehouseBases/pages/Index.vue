<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { computed, ref, watch, watchEffect } from "vue";
import filterIcon from "@/assets/images/filter.svg";
import CollapseFilter from "@/components/collapseFilter/index.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const warehouseBasesStore = useWarehouseBasesStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

enum TABS {
  PRODUCTS = 1,
  INVOICES
}

const tabItems = computed(() => {
  return [
    {
      value: TABS.PRODUCTS,
      name: "По продуктам",
    },
    {
      value: TABS.INVOICES,
      name: "По накладным",
    },
  ];
});

const filterFormOpened = ref(false);

const defaultTab = TABS.PRODUCTS;

const activeTab = ref<number | null>(null);

const getActiveTab = () => {
  const tab = +(route.query?.tab ?? defaultTab);

  const isValidTab = !isNaN(tab) && [TABS.PRODUCTS, TABS.INVOICES].includes(tab);

  activeTab.value = isValidTab ? tab : defaultTab;
};

watch(() => route.query.tab, () => {
  getActiveTab();
}, { immediate: true });

const productTableData = computed(() => {
  const data = [];

  for (let i = 1; i <= 10; i++) {
    data.push({
      idx: i,
      product_name: "Говядина",
      quantity: Math.floor(Math.random() * 11) + 90,
      unit_measurement: "кг",
      sum: "6 400 000 сум",
      action: true,
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
      sum: "6 400 000 сум",
    });
  }

  return data;
});

const setBreadCrumbFn = async () => {
  warehouseBasesStore.getProduct(+route.params.district_id, +route.params.product_id);

  if (!warehouseBasesStore.district || !warehouseBasesStore.product) return;

  setBreadCrumb([
    {
      label: "Базы складов",
    },
    {
      label: warehouseBasesStore.district.name,
    },
    {
      label: warehouseBasesStore.product.name,
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
})

</script>

<template>
  <section class="warehouse">
    <div v-if="warehouseBasesStore.product">
      <h1 class="font-semibold text-[32px] text-dark">
        {{ warehouseBasesStore.product.name }}
      </h1>
      <div class="rounded-2xl py-3 px-4 border mt-6">
        <h3 class="text-dark font-medium text-lg">
          Заполнение склада
        </h3>
        <h2 class="text-dark text-[32px] font-semibold mt-3">
          86.5%
        </h2>
        <ElProgress
          :stroke-width="16"
          :percentage="86.5"
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
              :to="{query: {...route.query, ...{tab: item.value}}}"
            >
              {{ item.name }}
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
            <div
              v-if="activeTab === TABS.PRODUCTS"
              class="grid gap-x-4 grid-cols-4"
            >
              <AppSelect placeholder="Название продукта" />
              <AppInput placeholder="Количество" />
              <AppSelect placeholder="Ед. измерения" />
              <AppInput placeholder="Сумма" />
            </div>
            <template v-else>
              <div class="grid gap-4 grid-cols-6">
                <AppDatePicker placeholder="с этой даты" />
                <AppDatePicker placeholder="По эту дату" />
                <AppSelect
                  class="col-span-2"
                  placeholder="№ накладной"
                />
                <AppInput
                  class="col-span-2"
                  placeholder="Сумма"
                />
              </div>
              <div class="grid grid-cols-4 gap-4 mt-1">
                <AppSelect placeholder="Название продукта" />
                <AppInput placeholder="Количество" />
                <AppSelect placeholder="Ед. измерения" />
                <AppInput placeholder="Цена" />
              </div>
            </template>
          </TransitionGroup>
          <div class="flex items-center mt-[10px] justify-between">
            <div class="text-[#8F9194] text-[14px]">Найдено: 56</div>
            <div class="flex items-center">
              <button class="custom-reset-btn">Сбросить</button>
              <button class="custom-apply-btn ml-[16px]">Применить</button>
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
            :data="productTableData"
            stripe
            class="custom-element-table"
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
              prop="quantity"
              label="Количество"
            />
            <ElTableColumn
              prop="unit_measurement"
              label="Ед. измерения"
            />
            <ElTableColumn
              prop="sum"
              label="Сумма"
            />
            <ElTableColumn
              prop="action"
              align="right"
              label="Действие"
            >
              <template #default="{row}">
                <div
                  v-if="row.action"
                  class="flex items-center justify-end gap-x-2"
                >
                  <button class="action-btn">
                    <img
                      src="@/assets/images/eye.svg"
                      alt="eye"
                    />
                  </button>

                  <button class="action-btn">
                    <img
                      src="@/assets/images/download.svg"
                      alt="download"
                    />
                  </button>
                </div>
              </template>
            </ElTableColumn>
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