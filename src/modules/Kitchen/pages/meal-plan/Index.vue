<script
    setup
    lang="ts"
>

import { computed, ref, watch } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import mailPlanImg from "@/assets/images/mail-plan.png";
import PlusIcon from "@/assets/images/icons/plus.svg";
import SellIcon from "@/assets/images/icons/sell-icon.svg";
import ClockIcon from "@/assets/images/icons/clock.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
import { TableColumnType } from "@/types/common.type";

const kitchenStore = useKitchenStore();

const route = useRoute();

enum TABS {
  CURRENT = 1,
  ALL
}

const defaultTab = TABS.CURRENT;

const activeTab = ref<number | null>(null);

const tabItems = computed(() => {
  return [
    {
      value: TABS.CURRENT,
      name: "Текущее меню"
    },
    {
      value: TABS.ALL,
      name: "Все меню"
    }
  ];
});

const getActiveTab = () => {
  const tab = Number(route.query.tab);

  const isValidTab = !isNaN(tab) && [TABS.CURRENT, TABS.ALL].includes(tab);

  activeTab.value = isValidTab ? tab : defaultTab;
};

watch(() => route.query.tab, () => {
  getActiveTab();
}, { immediate: true });

onBeforeRouteUpdate((to, from, next) => {
  kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

  if (!kitchenStore.part) return next({ name: "notFound" });

  to.meta.breadcrumb = [
    {
      label: "Кухня"
    },
    {
      label: kitchenStore.part.name
    },
    {
      label: kitchenStore.part.department_name
    },
    {
      label: "Лагерь"
    },
    {
      label: "Паҳлавон"
    },
    {
      label: "Меню",
      isActionable: true
    }
  ];

  next();
});

const hasData = ref(true);

const currentTabTableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      label: "Название",
      prop: "name"
    },
    {
      label: "Количество",
      prop: "quantity"
    },
    {
      label: "Ед. измерения",
      prop: "unit_measurement"
    },
    {
      label: "Цена",
      prop: "price"
    },
    {
      label: "Сумма",
      prop: "sum"
    }
  ];
});

const currentTabTableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 4; i++) {
    dataList.push({
      name: "Кабачки",
      quantity: 0.800,
      unit_measurement: "грамм",
      price: "1 800 сум",
      sum: "15 000 сум"
    });
  }

  return dataList;
});

</script>

<template>
  <section class="meal-plan">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Меню
      </h1>
      <div class="mt-6 flex items-center justify-between gap-x-5">
        <div class="app-tabs !inline-flex">
          <RouterLink
              v-for="item in tabItems"
              :key="item.value"
              :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
              :to="{query: {...route.query, ...{tab: item.value}}}"
          >
            {{ item.name }}
          </RouterLink>
        </div>
        <div
            v-if="hasData"
            class="flex items-center"
        >
          <template v-if="activeTab === TABS.CURRENT">
            <ElButton
                class="!bg-blue-500 min-h-12 w-[253px]"
                type="primary"
                size="large"
            >
              <div class="flex items-center gap-x-2">
                <svg
                    :data-src="PlusIcon"
                    class="size-6"
                />
                <span class="text-lg font-medium">
                Приготовить блюды
              </span>
              </div>
            </ElButton>
            <ElButton
                class="!bg-[#28C76F] min-h-12 w-[149px]"
                size="large"
                type="success"
            >
              <div class="flex items-center gap-x-2">
                <svg
                    :data-src="SellIcon"
                    class="size-6"
                />
                <span class="text-lg font-medium">
                Продать
              </span>
              </div>
            </ElButton>
          </template>
          <template v-else-if="activeTab === TABS.ALL">
            <ElButton
                class="min-h-12 w-[253px] !bg-[#E2E6F3] border-none"
                size="large"
            >
              <div class="flex items-center gap-x-2">
                <svg
                    :data-src="EditIcon"
                    class="size-6"
                />
                <span class="text-dark-gray font-medium text-lg">
                  Редактировать
                </span>
              </div>
            </ElButton>
          </template>
        </div>
      </div>
      <div class="mt-6">
        <TransitionGroup
            v-if="hasData"
            name="nested"
            :duration="{ enter: 500, leave: 1500 }"
            tag="div"
            class="relative overflow-x-hidden mt-6"
        >
          <div
              v-if="activeTab === TABS.CURRENT"
              class="inner"
          >
            <div class="flex flex-col gap-y-8">
              <div
                  v-for="n in 3"
                  :key="n"
                  class="border rounded-2xl p-4 pb-6 border-[#E2E6F3]"
              >
                <div class="flex justify-between gap-x-5">
                  <div class="flex flex-col gap-y-2">
                    <h3 class="font-semibold text-lg text-dark">
                      Рацион {{ n }} R-{{ Math.floor(Math.random() * 1001) + 1000 }}
                    </h3>
                    <div class="flex items-center gap-x-3 font-medium text-sm text-cool-gray">
                      <div class="flex items-center gap-x-1">
                        <svg
                            :data-src="ClockIcon"
                            class="size-5"
                        />
                        <span>
                          08:00-10:00
                        </span>
                      </div>
                      <span>
                        Завтрак
                      </span>
                    </div>
                  </div>
                  <h3 class="font-semibold text-lg text-dark">
                    25 000 UZS
                  </h3>
                </div>
                <ElTable
                    :data="currentTabTableData"
                    class="custom-element-table mt-6"
                >
                  <ElTableColumn
                      v-for="column in currentTabTableColumns"
                      :key="column.prop"
                      :label="column.label"
                      :prop="column.prop"
                  />
                </ElTable>
                <div class="rounded-2xl p-4 bg-white-blue flex justify-between gap-x-24 mt-6">
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">
                        Всего порций:
                      </span>
                      <strong class="font-semibold text-dark">
                        200
                      </strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">
                        Сумма:
                      </span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">
                        Выданние:
                      </span>
                      <strong class="font-semibold text-dark">
                        200
                      </strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">
                        Сумма:
                      </span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">
                        Проданние:
                      </span>
                      <strong class="font-semibold text-dark">
                        200
                      </strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">
                        Сумма:
                      </span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">
                        Остатки порций:
                      </span>
                      <strong class="font-semibold text-[#EA5455]">
                        8
                      </strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">
                        Сумма:
                      </span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
              v-else-if="activeTab === TABS.ALL"
              class="inner"
          >
           <ElScrollbar>
             <div class="flex">
               <div class="py-2 px-4 rounded-lg"></div>
             </div>
           </ElScrollbar>
          </div>
        </TransitionGroup>
        <div
            v-else
            class="mx-auto mt-[100px] w-[342px] text-center"
        >
          <img
              :src="mailPlanImg"
              alt="mail plan create img"
              class="w-full h-[264px]"
          />
          <p class="text-black font-medium text-sm mt-6">
            План питания еще не составлен
          </p>
          <ElButton
              class="!bg-blue-500 mt-6"
              type="primary"
              size="large"
              tag="router-link"
              :to="{name: 'KitchenMealPlanCreate'}"
          >
            <div class="flex items-center gap-x-2">
              <svg
                  :data-src="PlusIcon"
                  class="size-6"
              />
              <span class="text-lg font-medium">
                Добавить
              </span>
            </div>
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">

</style>