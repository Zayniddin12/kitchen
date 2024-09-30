<script
    setup
    lang="ts"
>

import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useDistrictStore } from "@/modules/WarehouseBases/store/district.store";
import { computed, ref, watch } from "vue";
import filterIcon from "@/assets/images/filter.svg";

const districtStore = useDistrictStore();
const route = useRoute();

onBeforeRouteUpdate((to, from, next) => {

  districtStore.getProduct(+to.params.district_id, +to.params.product_id);

  if(!districtStore.district || !districtStore.product) return next({name: 'notFound'});


  to.meta.breadcrumb = [
    {
      label: "Базы складов"
    },
    {
      label: districtStore.district.name
    },
    {
      label: districtStore.product.name,
      isActionable: true,
    }
  ]

  next();
});

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
  ]
});

const defaultTab = TABS.PRODUCTS;

const activeTab = ref<number | null>(null);

const getActiveTab = () => {
  const tab = +route.query?.tab;

  const isValidTab = !isNaN(tab) && [TABS.PRODUCTS, TABS.INVOICES].includes(tab);

  activeTab.value = isValidTab ? tab : defaultTab;
}

watch(() => route.query.tab, () => {
  getActiveTab();
}, {immediate: true});

const filterFormOpened = ref(false);

</script>

<template>
  <section class="warehouse">
    <div v-if="districtStore.product">
      <h1 class="font-semibold text-[32px] text-dark">
        {{districtStore.product.name}}
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
        />
        <p class="mt-4 text-xs text-[#A8AAAE]">
          Этот элемент показывает процент заполненности склада, помогая вам следить за остатками и эффективно управлять запасами.
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
            {{item.name}}
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
    </div>
  </section>
</template>

<style lang="scss">

</style>