<script
  setup
  lang="ts"
>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import { TableColumnType } from "@/types/common.type";
import { formatNumber } from "@/utils/helper";
import ColaImg from "@/assets/images/kitchen/test/cola.png";
import DishesImg from "@/assets/images/kitchen/test/dishes.png";
import mailPlanImg from "@/assets/images/mail-plan.png";
import PlusIcon from "@/assets/images/icons/plus.svg";
import SellIcon from "@/assets/images/icons/sell-icon.svg";
import ClockIcon from "@/assets/images/icons/clock.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
import MinusIcon from "@/assets/images/icons/minus.svg";
import Plus3Icon from "@/assets/images/icons/plus3.svg";
import RefreshIcon from "@/assets/images/icons/refresh.svg";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface ProductItemType {
  id: number;
  price: number;
  quantity: number;
  weight: number;
  name: string;
  photo: string | object;
}

interface ProductCategoryType {
  id: number;
  name: string;
}

interface ProductType {
  category: ProductCategoryType;
  data: ProductItemType[];
}

const { setBreadCrumb } = useBreadcrumb();

const kitchenStore = useKitchenStore();
const route = useRoute();

enum TABS {
  CURRENT = 1,
  ALL,
}

const activeTab = ref<number>(TABS.CURRENT);
const tabItems = computed(() => [
  { value: TABS.CURRENT, name: "Текущее меню" },
  { value: TABS.ALL, name: "Все меню" },
]);

watch(
  () => route.query.tab,
  () => {
    const tab = Number(route.query.tab);
    activeTab.value = [TABS.CURRENT, TABS.ALL].includes(tab) ? tab : TABS.CURRENT;
  },
  { immediate: true },
);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.name,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: "Лагерь",
      to: { name: "KitchenShowIndex" },
    },
    {
      label: "Паҳлавон",
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: "Меню",
      isActionable: true,
    },
  ]);
};

const currentTabTableColumns = computed<TableColumnType[]>(() => [
  { label: "Название", prop: "name" },
  { label: "Количество", prop: "quantity" },
  { label: "Ед. измерения", prop: "unit_measurement" },
  { label: "Цена", prop: "price" },
  { label: "Сумма", prop: "sum" },
]);

const salesAllTabTableColumns = computed<TableColumnType[]>(() => [
  {
    label: "№",
    prop: "idx",
    sortable: false,
  },
  {
    label: "Тип рациона",
    prop: "type",
    sortable: true,
  },
  {
    label: "Время",
    prop: "time",
    sortable: true,
    align: "center",
  },
  {
    label: "Порция",
    prop: "portion",
    sortable: true,
    align: "center",
  },
  {
    label: "Дата",
    prop: "date",
    sortable: true,
    align: "center",
  },
  {
    label: "Себестоимость",
    prop: "cost_price",
    sortable: true,
    align: "center",
  },
  {
    label: "Цена",
    prop: "price",
    sortable: true,
    align: "center",
  },
  {
    label: "Действие",
    prop: "action",
    sortable: false,
    align: "right",
  },
]);

const salesAllTabTableData = computed(() => {
  const data = [];
  for (let i = 1; i <= 4; i++) {
    data.push({
      idx: i,
      type: "Плов",
      time: "08:00-10:00",
      portion: 20,
      date: "23.08.2024",
      cost_price: "18 000 сум",
      price: "25 000 сум",
      action: true,
    });
  }

  return data;
});

const currentTabTableData = computed(() =>
  Array.from({ length: 4 }, () => ({
    name: "Кабачки",
    quantity: 0.8,
    unit_measurement: "грамм",
    price: "1 800 сум",
    sum: "15 000 сум",
  })),
);

const allTabTableData = computed(() => [
  { id: 1, idx: 1, type: "Рацион 1", time: "08:00-10:00", date: "23.08.2024", action: true },
  { id: 2, idx: 2, type: "Рацион 2", time: "12:00-13:00", date: "23.08.2024", action: true },
  { id: 3, idx: 3, type: "Рацион 3", time: "18:00-20:00", date: "23.08.2024", action: true },
]);

const dateList = ref([
  { value: "06.09.2024", title: "Понедельник - 06.09.2024" },
  { value: "07.09.2024", title: "Вторник - 07.09.2024" },
  { value: "08.09.2024", title: "Среда - 08.09.2024" },
  { value: "09.09.2024", title: "Четверг - 09.09.2024" },
  { value: "10.09.2024", title: "Пятница - 10.09.2024" },
  { value: "11.09.2024", title: "Суббота - 11.09.2024" },
  { value: "12.09.2024", title: "Воскресенье - 12.09.2024" },
]);

const activeDate = ref(dateList.value[0].value);

const hasData = ref(true);

const products = ref<ProductType[]>([
  {
    category: { id: 1, name: "Напитки" },
    data: [
      { id: 1, price: 14000, quantity: 0, weight: 1.5, name: "Coca Cola", photo: ColaImg },
      { id: 2, price: 12000, quantity: 0, weight: 1, name: "Coca Cola", photo: ColaImg },
      { id: 3, price: 8000, quantity: 0, weight: 0.5, name: "Coca Cola", photo: ColaImg },
    ],
  },
  {
    category: { id: 2, name: "Блюда" },
    data: [
      { id: 4, price: 12000, quantity: 0, weight: 0.5, name: "Блюда 1", photo: DishesImg },
      { id: 5, price: 14000, quantity: 0, weight: 1, name: "Блюда 2", photo: DishesImg },
      { id: 6, price: 15000, quantity: 0, weight: 1.5, name: "Блюда 3", photo: DishesImg },
      { id: 7, price: 18000, quantity: 0, weight: 2, name: "Блюда 4", photo: DishesImg },
      { id: 8, price: 12000, quantity: 0, weight: 0.5, name: "Блюда 5", photo: DishesImg },
      { id: 9, price: 14000, quantity: 0, weight: 1, name: "Блюда 6", photo: DishesImg },
      { id: 10, price: 15000, quantity: 0, weight: 1.5, name: "Блюда 7", photo: DishesImg },
      { id: 11, price: 18000, quantity: 0, weight: 2, name: "Блюда 8", photo: DishesImg },
    ],
  },
]);

const ordersModal = ref(false);

const updateQuantity = (product, increment = true) => {
  if (increment) {
    product.quantity++;
    ordersModal.value = true;
  } else if (product.quantity > 0) {
    product.quantity--;
    if (orders.value.length === 0) ordersModal.value = false;
  }
};

const orders = computed(() =>
  products.value.reduce((acc, product) => acc.concat(product.data.filter(item => item.quantity > 0)), []),
);

const ordersSum = computed(() => orders.value.reduce((sum, order) => sum + order.price * order.quantity, 0));

const clearOrders = () => {
  products.value = products.value.map(product => ({
    ...product,
    data: product.data.map(el => ({ ...el, quantity: 0 })),
  }));
  ordersModal.value = false;
};

const ordersWrapper = useTemplateRef<HTMLDivElement>("ordersWrapper");
const menuSection = useTemplateRef("menuSection");

const updateMenuSectionPadding = () => {
  if (ordersWrapper.value && menuSection.value) {
    const height = ordersWrapper.value.offsetHeight;
    menuSection.value.style.paddingBottom = `${height}px`;
  }
};

watch(ordersModal, async newValue => {
  if (newValue) {
    await nextTick();
    updateMenuSectionPadding();
  } else {
    if (menuSection.value) {
      menuSection.value.style.paddingBottom = "0px";
    }
  }
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  resizeObserver = new ResizeObserver(updateMenuSectionPadding);
  if (ordersWrapper.value) {
    resizeObserver.observe(ordersWrapper.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && ordersWrapper.value) {
    resizeObserver.unobserve(ordersWrapper.value);
    resizeObserver.disconnect();
  }
});

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section
    class="menu"
    ref="menuSection"
  >
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
          <template v-if="kitchenStore.activeMenuPart">
            <template v-if="activeTab === TABS.CURRENT">
              <ElButton
                class="!bg-blue-500 min-h-12 w-[253px]"
                type="primary"
                size="large"
                tag="RouterLink"
                :to="{name: 'KitchenMenuCookingDishCreate'}"
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
                tag="RouterLink"
                :to="{name: 'KitchenMenuSellCreate'}"
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
                tag="RouterLink"
                :to="{name: 'KitchenMenuEdit'}"
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
          </template>
          <template v-if="kitchenStore.activeSalesPart && activeTab === TABS.ALL">
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
            <ElButton
              class="min-h-12 w-[253px] !bg-blue-500"
              size="large"
              type="primary"
            >
              <div class="flex items-center gap-x-2">
                <svg
                  :data-src="RefreshIcon"
                  class="size-6"
                />
                <span class="text-white font-medium text-lg">
                  Начать сначала
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
            <div
              v-if="kitchenStore.activeMenuPart"
              class="flex flex-col gap-y-8"
            >
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
                  class="custom-element-table custom-element-table-normal mt-6"
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
            <div
              v-else-if="kitchenStore.activeSalesPart"
              class="flex flex-col gap-y-6"
            >
              <div
                v-for="product in products"
                :key="product.category.id"
              >
                <h4 class="text-dark-gray font-semibold text-xl">
                  {{ product.category.name }}
                </h4>
                <div class="grid grid-cols-4 gap-6 mt-3">
                  <div
                    v-for="productItem in product.data"
                    :key="productItem.id"
                    class="rounded-2xl border border-[#E2E6F3] p-4 bg-[#F8F9FC] flex gap-x-3"
                  >
                    <img
                      :src="productItem.photo"
                      :alt="productItem.name"
                      class="rounded-xl w-30 h-[114px] object-contain"
                    />
                    <div>
                      <h5 class="text-dark font-semibold text-xl">
                        {{ productItem.name }}
                      </h5>
                      <div class="flex flex-col gap-y-1 text-sm font-medium mt-1 text-cool-gray">
                        <span>
                        {{ productItem.weight }} литр
                      </span>
                        <span>
                        {{ formatNumber(productItem.price) }} UZS
                      </span>
                      </div>
                      <div class="mt-2.5 flex items-center gap-x-2">
                        <button
                          @click="updateQuantity(productItem, false)"
                          :disabled="productItem.quantity===0"
                          class="size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center"
                        >
                          <img
                            :src="MinusIcon"
                            alt="minus icon"
                            class="size-5"
                          />
                        </button>
                        <span class="text-base font-medium text-dark-gray">
                          {{ productItem.quantity }}
                        </span>
                        <button
                          @click="updateQuantity(productItem)"
                          class="size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center"
                        >
                          <img
                            :src="Plus3Icon"
                            alt="minus icon"
                            class="size-4"
                          />
                        </button>
                      </div>
                    </div>
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
                <button
                  v-for="item in dateList"
                  :key="item.value"
                  :class="['py-2 px-4 text-center rounded-lg text-xs font-medium text-dark-gray transition duration-200 ease-in', {'bg-[#E2E6F3]': activeDate === item.value}]"
                  @click="activeDate = item.value"
                >
                  {{ item.title }}
                </button>
              </div>
            </ElScrollbar>
            <div class="mt-6">
              <div
                v-if="kitchenStore.activeMenuPart"
                class="flex flex-col gap-y-6"
              >
                <div>
                  <h2 class="font-semibold text-2xl text-black">
                    Завтрак
                  </h2>
                  <ElTable
                    :data="allTabTableData"
                    class="custom-element-table custom-element-table-normal mt-4"
                  >
                    <ElTableColumn
                      prop="idx"
                      label="№"
                    />
                    <ElTableColumn
                      prop="type"
                      label="Тип рациона"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      label="Время"
                      sortable
                    />
                    <ElTableColumn
                      prop="date"
                      label="Дата"
                      sortable
                    />
                    <ElTableColumn
                      prop="action"
                      label="Действие"
                      align="right"
                    >
                      <template #default="{row}: {row: Record<string,any>}">
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
                              src="@/assets/images/icons/edit.svg"
                              alt="edit"
                            />
                          </button>
                        </div>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
                <div>
                  <h2 class="font-semibold text-2xl text-black">
                    Обед
                  </h2>
                  <ElTable
                    :data="allTabTableData"
                    class="custom-element-table custom-element-table-normal mt-4"
                  >
                    <ElTableColumn
                      prop="idx"
                      label="№"
                    />
                    <ElTableColumn
                      prop="type"
                      label="Тип рациона"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      label="Время"
                      sortable
                    />
                    <ElTableColumn
                      prop="date"
                      label="Дата"
                      sortable
                    />
                    <ElTableColumn
                      prop="action"
                      label="Действие"
                      align="right"
                    >
                      <template #default="{row}: {row: Record<string,any>}">
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
                              src="@/assets/images/icons/edit.svg"
                              alt="edit"
                            />
                          </button>
                        </div>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
                <div>
                  <h2 class="font-semibold text-2xl text-black">
                    Ужин
                  </h2>
                  <ElTable
                    :data="allTabTableData"
                    class="custom-element-table custom-element-table-normal mt-4"
                  >
                    <ElTableColumn
                      prop="idx"
                      label="№"
                    />
                    <ElTableColumn
                      prop="type"
                      label="Тип рациона"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      label="Время"
                      sortable
                    />
                    <ElTableColumn
                      prop="date"
                      label="Дата"
                      sortable
                    />
                    <ElTableColumn
                      prop="action"
                      label="Действие"
                      align="right"
                    >
                      <template #default="{row}: {row: Record<string,any>}">
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
                              src="@/assets/images/icons/edit.svg"
                              alt="edit"
                            />
                          </button>
                        </div>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
                <div>
                  <h2 class="font-semibold text-2xl text-black">
                    Сухой питания
                  </h2>
                  <ElTable
                    :data="allTabTableData"
                    class="custom-element-table custom-element-table-normal mt-4"
                  >
                    <ElTableColumn
                      prop="idx"
                      label="№"
                    />
                    <ElTableColumn
                      prop="type"
                      label="Тип рациона"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      label="Время"
                      sortable
                    />
                    <ElTableColumn
                      prop="date"
                      label="Дата"
                      sortable
                    />
                    <ElTableColumn
                      prop="action"
                      label="Действие"
                      align="right"
                    >
                      <template #default="{row}: {row: Record<string,any>}">
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
                              src="@/assets/images/icons/edit.svg"
                              alt="edit"
                            />
                          </button>
                        </div>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
              <div v-else-if="kitchenStore.activeSalesPart">
                <h4 class="font-semibold text-2xl text-black">
                  Меню
                </h4>
                <ElTable
                  :data="salesAllTabTableData"
                  class="custom-element-table custom-element-table-normal menu__sales-all-tab-table mt-4"
                >
                  <ElTableColumn
                    v-for="column in salesAllTabTableColumns"
                    :key="column.prop"
                    :prop="column.prop"
                    :label="column.label"
                    :sortable="!!column.sortable"
                    :align="column.align ?? 'left'"
                  >
                    <template
                      v-if="column.prop === 'type'"
                      #default="{row}: {row: Record<string,any>}"
                    >
                      <div class="flex items-center gap-x-3">
                        <img
                          :src="DishesImg"
                          :alt="row.type"
                          class="size-8 rounded-full object-contain"
                        />
                        <span>{{ row.type }}</span>
                      </div>
                    </template>
                    <template
                      v-if="column.prop === 'action'"
                      #default="{row}: {row: Record<string,any>}"
                    >
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
                            src="@/assets/images/icons/edit.svg"
                            alt="edit"
                          />
                        </button>
                      </div>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </div>
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
            :to="{name: 'KitchenMenuCreate'}"
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
    <Teleport to="body">
      <div
        v-show="activeTab === TABS.CURRENT && ordersModal"
        ref="ordersWrapper"
        class="fixed bottom-0 pt-6 right-0 w-full z-[100] bg-white shadow-[0_0_3px_-1px_#0A090B0A]"
      >
        <div class="flex items-center justify-between px-6 pb-4">
          <h4 class="text-2xl text-black font-semibold">Заказы</h4>
          <div class="flex items-center">
            <h6 class="text-lg text-dark font-semibold mr-6">
              Общая сумма: {{ formatNumber(ordersSum) }} сум
            </h6>
            <ElButton
              @click="clearOrders"
              class="!bg-[#E2E6F3] border-none text-sm !text-dark-gray"
              size="large"
            >
              Отменить
            </ElButton>
            <ElButton
              type="primary"
              size="large"
              class="!bg-blue"
            >
              Продать
            </ElButton>
          </div>
        </div>
        <div
          v-if="orders.length>0"
          class="grid grid-cols-5 gap-x-12 gap-y-10 max-h-[220px] overflow-y-auto px-6 pb-6 pt-4"
        >
          <div
            v-for="item in orders"
            :key="item.id"
          >
            <div class="flex gap-x-4 items-start">
              <img
                :src="item.photo"
                :alt="item.name"
                class="size-9 rounded-full"
              />
              <div>
                <div class="flex items-center gap-x-3">
                  <strong class="text-black font-medium text-xl">
                    {{ item.name }}
                  </strong>
                  <div class="bg-[#F8F9FC] p-1 rounded-lg flex items-center gap-x-2">
                    <button
                      @click="updateQuantity(item, false)"
                      :disabled="item.quantity===0"
                      class="size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center"
                    >
                      <img
                        :src="MinusIcon"
                        alt="minus icon"
                        class="size-5"
                      />
                    </button>
                    <span class="text-base font-medium text-dark-gray">
                  {{ item.quantity }}
                </span>
                    <button
                      @click="updateQuantity(item)"
                      class="size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center"
                    >
                      <img
                        :src="Plus3Icon"
                        alt="minus icon"
                        class="size-4"
                      />
                    </button>
                  </div>
                </div>
                <div class="flex flex-col mt-1.5 gap-x-1.5 font-medium text-base text-cool-gray">
              <span>
                {{ item.weight }} литр
              </span>
                  <span>
                {{ formatNumber(item.price) }} сум
              </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>