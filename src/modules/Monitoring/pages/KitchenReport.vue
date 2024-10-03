<script
    lang="ts"
    setup
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { TableColumnType } from "@/types/common.type";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

enum TABS {
  ATTENDANCE = 1,
  DISHES
}

const defaultTab = TABS.ATTENDANCE;

const activeTab = ref<number | null>(null);

const tabItems = computed(() => {
  return [
    {
      value: TABS.ATTENDANCE,
      label: "Посещаемость"
    },
    {
      value: TABS.DISHES,
      label: "Блюда"
    }
  ];
});

const getActiveTab = () => {
  const tab = Number(route.query?.tab);

  const isValidTab = !isNaN(tab) && [TABS.ATTENDANCE, TABS.DISHES].includes(tab);

  activeTab.value = isValidTab ? tab : defaultTab;
};


const attendanceTableColumns = computed<TableColumnType>(() => {
  return [
    {
      label: "№",
      prop: "num",
      width: 150,
      sortable: false
    },
    {
      label: "Регионы",
      prop: "region",
      sortable: true
    },
    {
      label: "Посетители",
      prop: "visitors",
      sortable: true
    },
    {
      label: "Кухни ЛПП",
      prop: "kitchens",
      sortable: true
    },
    {
      label: "Св. продажа",
      prop: "holy_sale",
      sortable: true
    },
    {
      label: "Буфет",
      prop: "buffet",
      sortable: true
    },
    {
      label: "Поликлиника",
      prop: "polyclinic",
      sortable: true
    },
    {
      label: "Профилакторий",
      prop: "health_resort",
      sortable: true
    },
    {
      label: "Лагерь",
      prop: "camp",
      sortable: true
    }
  ];
});

const attendanceTableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 10; i++) {
    const data = {
      num: i + 1,
      region: "Зарафшан",
      visitors: Math.floor(Math.random() * 1001) + 1000,
      kitchens: Math.floor(Math.random() * 51) + 1000,
      holy_sale: Math.floor(Math.random() * 51) + 1000,
      buffet: Math.floor(Math.random() * 51) + 1000,
      polyclinic: Math.floor(Math.random() * 51) + 1000,
      health_resort: Math.floor(Math.random() * 51) + 1000,
      camp: 0
    };

    dataList.push(data);
  }

  return dataList;
});

const dishesTableColumns = computed<TableColumnType>(() => {
  return [
    {
      label: "№",
      prop: "num",
      width: 150,
      sortable: false
    },
    {
      label: "Регионы",
      prop: "region",
      sortable: true
    },
    {
      label: "Всего порций",
      prop: "total_servings",
      sortable: true
    },
    {
      label: "Кухни ЛПП",
      prop: "lpp_kitchens",
      sortable: true
    },
    {
      label: "Св. продажа",
      prop: "holy_sale",
      sortable: true
    },
    {
      label: "Буфет",
      prop: "buffet",
      sortable: true
    },
    {
      label: "Поликлиника",
      prop: "polyclinic",
      sortable: true
    },
    {
      label: "Профилакторий",
      prop: "health_resort",
      sortable: true
    },
    {
      label: "Лагерь",
      prop: "camp",
      sortable: true
    }
  ];
});

const dishesTableData = computed(() => {
  const dataList = [];

  for (let i = 0; i < 10; i++) {
    const data = {
      num: i + 1,
      region: "Зарафшан",
      total_servings: Math.floor(Math.random() * 1001) + 1000,
      lpp_kitchens: Math.floor(Math.random() * 51) + 1000,
      holy_sale: Math.floor(Math.random() * 51) + 1000,
      buffet: Math.floor(Math.random() * 51) + 1000,
      polyclinic: Math.floor(Math.random() * 51) + 1000,
      health_resort: Math.floor(Math.random() * 51) + 1000,
      camp: 0
    };

    dataList.push(data);
  }

  return dataList;
});

watch(() => route.query, () => {
  getActiveTab();
}, { immediate: true });

</script>
<template>
  <section class="kitchen-report">
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Отчет о кухне
      </h1>
      <div class="flex justify-between items-start gap-5 mt-6">
        <div class="app-tabs">
          <RouterLink
              v-for="item in tabItems"
              :key="item.value"
              :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
              :to="{query: {...route.query, ...{tab: item.value}}}"
          >
            {{ item.label }}
          </RouterLink>
        </div>
        <div class="grid grid-cols-4 gap-2 max-w-[645px]">
          <AppDatePicker
              format="DD.MM.YYYY"
              size="large"
          />
          <AppDatePicker
              format="DD.MM.YYYY"
              size="large"
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
              size="large"
              class="h-12 !bg-white-blue !border-white-blue"
          >
            <div class="flex items-center gap-x-2">
              <img
                  src="@/assets/images/icons/share.svg"
                  class="size-5"
              />
              <span class="font-medium text-dark-gray">Поделиться</span>
            </div>
          </ElButton>
        </div>
      </div>
      <TransitionGroup
          name="nested"
          :duration="{ enter: 500, leave: 1500 }"
          tag="div"
          class="relative overflow-x-hidden"
      >
        <div
            class="inner"
            v-if="activeTab === TABS.ATTENDANCE"
        >
          <ElTable
              :data="attendanceTableData"
              class="custom-element-table"
          >
            <ElTableColumn
                v-for="column in attendanceTableColumns"
                :key="column.prop"
                :width="column.width"
                :sortable="column.sortable"
                :prop="column.prop"
            >
              <template #header>
                <strong class="font-medium">
                  {{ column.label }}
                </strong>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <div
            class="inner"
            v-else-if="activeTab === TABS.DISHES"
        >
          <div>
            <h2 class="font-semibold text-black text-2xl">
              Приготовленных
            </h2>
            <ElTable
                :data="dishesTableData"
                class="custom-element-table mt-4"
            >
              <ElTableColumn
                  v-for="column in dishesTableColumns"
                  :key="column.prop"
                  :width="column.width"
                  :sortable="column.sortable"
                  :prop="column.prop"
              >
                <template #header>
                  <strong class="font-medium">
                    {{ column.label }}
                  </strong>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
          <div class="mt-6">
            <h2 class="font-semibold text-black text-2xl">
              Раздаваемых
            </h2>
            <ElTable
                :data="dishesTableData"
                class="custom-element-table mt-4"
            >
              <ElTableColumn
                  v-for="column in dishesTableColumns"
                  :key="column.prop"
                  :width="column.width"
                  :sortable="column.sortable"
                  :prop="column.prop"
              >
                <template #header>
                  <strong class="font-medium">
                    {{ column.label }}
                  </strong>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>