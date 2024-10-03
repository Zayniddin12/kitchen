<script
    setup
    lang="ts"
>

import {computed, ref, watch} from "vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useKitchenStore} from "@/modules/Kitchen/store/kitchen.store";
import mailPlanImg from "@/assets/images/mail-plan.png";
import PlusIcon from "@/assets/images/icons/plus.svg";

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
}, {immediate: true});

onBeforeRouteUpdate((to, from, next) => {
  kitchenStore.fetchPart(+to.params.department_id, +to.params.part_id);

  if (!kitchenStore.part) return next({name: "notFound"});

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

const hasData = ref(false);

</script>

<template>
  <section class="meal-plan">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Меню
      </h1>
      <div class="app-tabs mt-6 !inline-flex">
        <RouterLink
            v-for="item in tabItems"
            :key="item.value"
            :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
            :to="{query: {...route.query, ...{tab: item.value}}}"
        >
          {{ item.name }}
        </RouterLink>
      </div>
      <div class="mt-6">
        <div
            v-if="!hasData"
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
        <TransitionGroup
            name="nested"
            :duration="{ enter: 500, leave: 1500 }"
            tag="div"
            class="relative overflow-x-hidden"
        >
          <div
              v-if="activeTab === TABS.CURRENT"
              class="inner"
          >

          </div>
          <div
              v-else-if="activeTab === TABS.ALL"
              class="inner"
          >

          </div>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<style lang="scss">

</style>