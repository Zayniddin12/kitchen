<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";

import filterIcon from "@/assets/images/filter.svg";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import CollapseFilter from "@/components/collapseFilter/index.vue";

import ByProducts from '../components/Products.vue'
import ByInvoices from '../components/Invoices.vue'
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";

interface Tabs {
  title: string;
  value: number;
}

const route = useRoute();

const activeTab = ref<number>(0);
const filterFormOpened = ref<boolean>(false);
const tabs = ref<Tabs[]>([
  {
    title: "По продуктам",
    value: 0,
  },
  {
    title: "По накладным",
    value: 1,
  },
]);

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
  filterFormOpened.value = false;
};

const { setBreadCrumb } = useBreadcrumb();
const kitchenWarehouseStore = useKitchenWarehouseStore();

const setBreadCrumbFn = () => {
  kitchenWarehouseStore.fetchDynamicItemState(+route.params.id);

  if (!kitchenWarehouseStore.dynamicItemState) return;

  setBreadCrumb([
    {
      label: "Склад кухни",
      isActionable: false,
    },
    {
      label: kitchenWarehouseStore.dynamicItemState.title,
      to: { name: "kitchen-warehouse-title-id" },
    },
    {
      label: "Кухня",
      to: {name: "kitchen-warehouse-id-id3"}
    },
    {
      label: "Табассум",
      isActionable: true
    }
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">Табассум</h1>

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
      />
      <p class="mt-4 text-xs text-[#A8AAAE]">
        Этот элемент показывает процент заполненности склада, помогая вам следить за остатками и эффективно управлять запасами.
      </p>
    </div>

    <div class="flex items-center justify-between my-[24px]">
      <div class="app-tabs">
        <div
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
          @click="setActiveTab(item)"
        >
          {{ item.title }}
        </div>
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
            <span class="text-sm font-medium">Фильтр</span>
          </div>
        </ElButton>
      </div>
    </div>

    <div>
      <CollapseFilter v-model="filterFormOpened">
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" v-if="activeTab === 0">
            <AppSelect placeholder="Название продукта" label="Название продукта" label-class="text-[#7F7D83]"/>
            <AppInput placeholder="Количество" label="Количество" label-class="text-[#7F7D83]"/>

            <AppSelect placeholder="Ед. измерения" label="Ед. измерения" label-class="text-[#7F7D83]"/>
            <AppInput placeholder="Сумма" label="Сумма" label-class="text-[#7F7D83]"/>
          </div>

          <template v-else>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <app-date-picker placeholder="С этой даты" label="С этой даты" label-class="text-[#7F7D83]"/>
              <app-date-picker placeholder="По эту дату" label="По эту дату" label-class="text-[#7F7D83]"/>

              <AppInput placeholder="Номер накладной" label="Номер накладной" label-class="text-[#7F7D83]"/>
              <AppInput placeholder="Сумма" label="Сумма" label-class="text-[#7F7D83]"/>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              <AppSelect placeholder="Название продукта" label="Название продукта" label-class="text-[#7F7D83]"/>
              <AppInput placeholder="Количество" label="Количество" label-class="text-[#7F7D83]"/>
              <AppSelect placeholder="Ед. измерения" label="Ед. измерения" label-class="text-[#7F7D83]"/>
              <AppInput placeholder="Цена" label="Цена" label-class="text-[#7F7D83]"/>
            </div>
          </template>

          <div class="flex items-center mt-[10px] justify-between">
            <div class="text-[#8F9194] text-[14px]">Найдено: 56</div>
            <div class="flex items-center">
              <button class="custom-reset-btn">Сбросить</button>
              <button class="custom-apply-btn ml-[16px]">Применить</button>
            </div>
          </div>
        </template>
      </CollapseFilter>

      <ByProducts v-if="activeTab === 0"/>

      <ByInvoices v-if="activeTab === 1"/>
    </div>
  </div>
</template>
