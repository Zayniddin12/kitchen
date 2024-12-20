<script setup lang="ts">
import { computed, nextTick, reactive, ref, useTemplateRef, watch } from "vue";
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
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { useSidebarStore } from "@/layout/Bars/sidebar.store";

interface ProductItemType {
  id: number;
  price: number;
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

const setBreadCrumbFn = async () => {
  await kitchenStore.fetchPart(
    +route.params.department_id,
    route.params.part_name as string
  );

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
  }))
);

const allTabTableData = computed(() => [
  {
    id: 1,
    idx: 1,
    type: "Рацион 1",
    time: "08:00-10:00",
    date: "23.08.2024",
    action: true,
  },
  {
    id: 2,
    idx: 2,
    type: "Рацион 2",
    time: "12:00-13:00",
    date: "23.08.2024",
    action: true,
  },
  {
    id: 3,
    idx: 3,
    type: "Рацион 3",
    time: "18:00-20:00",
    date: "23.08.2024",
    action: true,
  },
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

const products = ref<ProductType[] | []>([
  {
    category: { id: 1, name: "Напитки" },
    data: [
      {
        id: 1,
        price: 14000,
        weight: 1.5,
        name: "Coca Cola",
        photo: ColaImg,
      },
      {
        id: 2,
        price: 12000,
        weight: 1,
        name: "Coca Cola",
        photo: ColaImg,
      },
      {
        id: 3,
        price: 8000,
        weight: 0.5,
        name: "Coca Cola",
        photo: ColaImg,
      },
    ],
  },
  {
    category: { id: 2, name: "Блюда" },
    data: [
      {
        id: 4,
        price: 12000,
        weight: 0.5,
        name: "Блюда 1",
        photo: DishesImg,
      },
      {
        id: 5,
        price: 14000,
        weight: 1,
        name: "Блюда 2",
        photo: DishesImg,
      },
      {
        id: 6,
        price: 15000,
        weight: 1.5,
        name: "Блюда 3",
        photo: DishesImg,
      },
      {
        id: 7,
        price: 18000,
        weight: 2,
        name: "Блюда 4",
        photo: DishesImg,
      },
      {
        id: 8,
        price: 12000,
        weight: 0.5,
        name: "Блюда 5",
        photo: DishesImg,
      },
      {
        id: 9,
        price: 14000,
        weight: 1,
        name: "Блюда 6",
        photo: DishesImg,
      },
      {
        id: 10,
        price: 15000,
        weight: 1.5,
        name: "Блюда 7",
        photo: DishesImg,
      },
      {
        id: 11,
        price: 18000,
        weight: 2,
        name: "Блюда 8",
        photo: DishesImg,
      },
      {
        id: 12,
        price: 12000,
        weight: 0.5,
        name: "Блюда 9",
        photo: DishesImg,
      },
      {
        id: 13,
        price: 14000,
        weight: 1,
        name: "Блюда 10",
        photo: DishesImg,
      },
      {
        id: 13,
        price: 15000,
        weight: 1.5,
        name: "Блюда 11",
        photo: DishesImg,
      },
      {
        id: 15,
        price: 18000,
        weight: 2,
        name: "Блюда 12",
        photo: DishesImg,
      },
      {
        id: 16,
        price: 12000,
        weight: 0.5,
        name: "Блюда 13",
        photo: DishesImg,
      },
      {
        id: 17,
        price: 14000,
        weight: 1,
        name: "Блюда 14",
        photo: DishesImg,
      },
      {
        id: 18,
        price: 15000,
        weight: 1.5,
        name: "Блюда 15",
        photo: DishesImg,
      },
      {
        id: 19,
        price: 18000,
        weight: 2,
        name: "Блюда 16",
        photo: DishesImg,
      },
    ],
  },
]);

const sideBarStore = useSidebarStore();

const productsWrapperClassName = computed<string[]>(() => {
  const className = ["grid gap-6 mt-3"];

  if (!sideBarStore.childSideBarOpen && !ordersModal.value) {
    className.push("grid-cols-9");
  } else if (sideBarStore.childSideBarOpen && !ordersModal.value) {
    className.push("grid-cols-8");
  } else if (!sideBarStore.childSideBarOpen && ordersModal.value) {
    className.push("grid-cols-7");
  } else {
    className.push("grid-cols-6");
  }

  return className;
});

const ordersModal = ref(false);
const ordersWrapper = useTemplateRef<HTMLDivElement>("ordersWrapper");
const menuSection = useTemplateRef("menuSection");

const orders = reactive<Map<number, number>>(new Map());

const selectedProducts = computed(() => {
  const selected = [] as ProductItemType[];

  const productMap = new Map<number, ProductItemType>();

  products.value.forEach(productCategory => {
    productCategory.data.forEach(product => {
      productMap.set(product.id, product);
    });
  });

  orders.forEach((quantity, product_id) => {
    const product = productMap.get(product_id);
    if (product) {
      selected.push(product);
    }
  });

  return selected;
});

const updateQuantity = (product_id: number, increment = true) => {
  const currentQuantity = orders.get(product_id) || 0;

  if (increment) {
    orders.set(product_id, currentQuantity + 1);
    ordersModal.value = true;
  } else if (currentQuantity > 0) {
    if (currentQuantity > 1) {
      orders.set(product_id, currentQuantity - 1);
    } else {
      orders.delete(product_id);

      if (orders.size === 0) ordersModal.value = false;
    }
  }
};

const ordersSum = computed(() => {
  let totalSum = 0;

  orders.forEach((quantity, product_id) => {
    products.value.forEach(productCategory => {
      productCategory.data.forEach(product => {
        if (product.id === product_id) {
          totalSum += product.price * quantity;
        }
      });
    });
  });

  return totalSum;
});

const { confirm } = useConfirm();

const clearOrders = () => {
  confirm.cancel().then(response => {
    if (response !== "confirm") return;
    orders.clear();
    ordersModal.value = false;
  });
};

const oldPaddingRight = ref<number>(0);

const updateMenuSectionWidth = (modalOpened: boolean = true) => {
  const menuEl = menuSection.value;
  const ordersEl = ordersWrapper.value;

  if (!menuEl) return;

  if (!modalOpened) {
    menuEl.style.removeProperty("padding-right");
    return;
  }

  if (!ordersEl) {
    if (oldPaddingRight.value)
      menuEl.style.paddingRight = `${oldPaddingRight}px`;
    return;
  }

  oldPaddingRight.value = ordersEl.offsetWidth;

  menuEl.style.paddingRight = `${oldPaddingRight.value}px`;
};

watch(ordersModal, async newValue => {
  await nextTick();
  updateMenuSectionWidth(newValue);
});

const changeTab = async () => {
  const tab = Number(route.query.tab);
  activeTab.value = [TABS.CURRENT, TABS.ALL].includes(tab) ? tab : TABS.CURRENT;

  if (ordersModal.value)
    await updateMenuSectionWidth(activeTab.value === TABS.CURRENT);
};

watch(
  route,
  async () => {
    await nextTick();
    await setBreadCrumbFn();
    changeTab();
  },
  { immediate: true }
);
</script>

<template>
  <section
    class="menu transition-all duration-200"
    ref="menuSection"
  >
    <div>
      <h1 class="font-semibold text-[32px] text-dark">Меню</h1>
      <div class="mt-6 flex items-center justify-between gap-x-5">
        <div class="app-tabs !inline-flex">
          <RouterLink
            v-for="item in tabItems"
            :key="item.value"
            :class="[
              'app-tab',
              { 'app-tab--active': activeTab === item.value },
            ]"
            :to="{ query: { ...route.query, ...{ tab: item.value } } }"
          >
            {{ item.name }}
          </RouterLink>
        </div>
        <div
          v-if="hasData"
          class="flex items-center"
        >
          <template
            v-if="activeTab === TABS.CURRENT && kitchenStore.activeMenuPart"
          >
            <ElButton
              class="!bg-blue-500 min-h-12 w-[253px]"
              type="primary"
              size="large"
              tag="RouterLink"
              :to="{ name: 'KitchenMenuCookingDishCreate' }"
            >
              <div class="flex items-center gap-x-2">
                <svg
                  :data-src="PlusIcon"
                  class="size-6"
                />
                <span class="text-lg font-medium">Приготовить блюды</span>
              </div>
            </ElButton>
            <ElButton
              class="!bg-[#28C76F] min-h-12 w-[149px]"
              size="large"
              type="success"
              tag="RouterLink"
              :to="{ name: 'KitchenMenuSellCreate' }"
            >
              <div class="flex items-center gap-x-2">
                <svg
                  :data-src="SellIcon"
                  class="size-6"
                />
                <span class="text-lg font-medium">Продать</span>
              </div>
            </ElButton>
          </template>
          <template v-else-if="activeTab === TABS.ALL">
            <ElButton
              class="min-h-12 w-[253px] !bg-[#E2E6F3] border-none"
              size="large"
              tag="RouterLink"
              :to="{ name: 'KitchenMenuEdit' }"
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
                      Рацион {{ n }} R-{{
                        Math.floor(Math.random() * 1001) + 1000
                      }}
                    </h3>
                    <div
                      class="flex items-center gap-x-3 font-medium text-sm text-cool-gray"
                    >
                      <div class="flex items-center gap-x-1">
                        <svg
                          :data-src="ClockIcon"
                          class="size-5"
                        />
                        <span>08:00-10:00</span>
                      </div>
                      <span>Завтрак</span>
                    </div>
                  </div>
                  <h3 class="font-semibold text-lg text-dark">25 000 UZS</h3>
                </div>
                <ElTable
                  :data="currentTabTableData"
                  stripe
                  class="custom-element-table custom-element-table-normal mt-6"
                >
                  <ElTableColumn
                    v-for="column in currentTabTableColumns"
                    :key="column.prop"
                    :label="column.label"
                    :prop="column.prop"
                  />
                </ElTable>
                <div
                  class="rounded-2xl p-4 bg-white-blue flex justify-between gap-x-24 mt-6"
                >
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">Всего порций:</span>
                      <strong class="font-semibold text-dark">200</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">Выданние:</span>
                      <strong class="font-semibold text-dark">200</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">Проданние:</span>
                      <strong class="font-semibold text-dark">200</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        5 000 000 UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray">Остатки порций:</span>
                      <strong class="font-semibold text-[#EA5455]">8</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray">Сумма:</span>
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
                <div :class="productsWrapperClassName">
                  <div
                    v-for="productItem in product.data"
                    :key="productItem.id"
                    class="menu__card"
                  >
                    <h5 class="menu__card-title">
                      {{ productItem.name }}
                    </h5>
                    <img
                      :src="productItem.photo as any"
                      :alt="productItem.name"
                      class="menu__card-img"
                    />
                    <div class="menu__card-subtitles">
                      <span>{{ productItem.weight }} литр</span>
                      <span>{{ formatNumber(productItem.price) }} UZS</span>
                    </div>
                    <div class="menu__card__actions">
                      <button
                        @click="updateQuantity(productItem.id, false)"
                        :disabled="!orders.has(productItem.id)"
                        class="menu__card__action-btn"
                      >
                        <svg
                          :data-src="MinusIcon"
                          class="menu__card__action-btn__icon"
                        />
                      </button>
                      <span>
                        {{ orders.get(productItem.id) ?? 0 }}
                      </span>
                      <button
                        @click="updateQuantity(productItem.id)"
                        class="menu__card__action-btn"
                      >
                        <svg
                          :data-src="Plus3Icon"
                          class="menu__card__action-btn__icon"
                        />
                      </button>
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
                  :class="[
                    'py-2 px-4 text-center rounded-lg text-xs font-medium text-dark-gray transition duration-200 ease-in',
                    { 'bg-[#E2E6F3]': activeDate === item.value },
                  ]"
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
                  <h2 class="font-semibold text-2xl text-black">Завтрак</h2>
                  <ElTable
                    :data="allTabTableData"
                    stripe
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
                      <template
                        #default="{ row }: { row: Record<string, any> }"
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
                <div>
                  <h2 class="font-semibold text-2xl text-black">Обед</h2>
                  <ElTable
                    :data="allTabTableData"
                    stripe
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
                      <template
                        #default="{ row }: { row: Record<string, any> }"
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
                <div>
                  <h2 class="font-semibold text-2xl text-black">Ужин</h2>
                  <ElTable
                    :data="allTabTableData"
                    stripe
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
                      <template
                        #default="{ row }: { row: Record<string, any> }"
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
                <div>
                  <h2 class="font-semibold text-2xl text-black">
                    Сухой питания
                  </h2>
                  <ElTable
                    :data="allTabTableData"
                    stripe
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
                      <template
                        #default="{ row }: { row: Record<string, any> }"
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
              <div v-else-if="kitchenStore.activeSalesPart">
                <h4 class="font-semibold text-2xl text-black">Меню</h4>
                <ElTable
                  :data="salesAllTabTableData"
                  stripe
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
                      #default="{ row }: { row: Record<string, any> }"
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
                      #default="{ row }: { row: Record<string, any> }"
                    >
                      <div
                        v-if="row.action"
                        class="flex items-center justify-end gap-x-2"
                      >
                        <RouterLink
                          :to="{
                            name: 'KitchenMenuShow',
                            params: { id: row.idx },
                          }"
                          class="action-btn"
                        >
                          <img
                            src="@/assets/images/eye.svg"
                            alt="eye"
                          />
                        </RouterLink>

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
            tag="index-link"
            :to="{ name: 'KitchenMenuCreate' }"
          >
            <div class="flex items-center gap-x-2">
              <svg
                :data-src="PlusIcon"
                class="size-6"
              />
              <span class="text-lg font-medium">Добавить</span>
            </div>
          </ElButton>
        </div>
      </div>
    </div>
    <Transition name="nested">
      <Teleport to="body">
        <div
          v-if="activeTab === TABS.CURRENT && ordersModal"
          ref="ordersWrapper"
          class="fixed top-0 right-0 pt-8 pb-6 w-[21%] h-screen flex flex-col justify-between z-10 bg-white shadow-[-32px_72px_96px_0_#0926450F] rounded-l-[32px]"
        >
          <div>
            <h4 class="text-xl text-black font-semibold px-8">Заказы</h4>
            <div
              v-if="selectedProducts.length > 0"
              class="grid grid-cols-2 gap-6 mt-6 px-8 max-h-[76vh] overflow-y-auto"
            >
              <div
                class="menu__card"
                v-for="productItem in selectedProducts"
                :key="productItem.id"
              >
                <h5 class="menu__card-title">
                  {{ productItem.name }}
                </h5>
                <img
                  :src="productItem.photo as any"
                  :alt="productItem.name"
                  class="menu__card-img"
                />
                <div class="menu__card-subtitles">
                  <span>{{ productItem.weight }} литр</span>
                  <span>{{ formatNumber(productItem.price) }} UZS</span>
                </div>
                <div class="menu__card__actions">
                  <button
                    @click="updateQuantity(productItem.id, false)"
                    :disabled="!orders.has(productItem.id)"
                    class="menu__card__action-btn"
                  >
                    <svg
                      :data-src="MinusIcon"
                      class="menu__card__action-btn__icon"
                    />
                  </button>
                  <span>
                    {{ orders.get(productItem.id) }}
                  </span>
                  <button
                    @click="updateQuantity(productItem.id)"
                    class="menu__card__action-btn"
                  >
                    <svg
                      :data-src="Plus3Icon"
                      class="menu__card__action-btn__icon"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 px-8">
            <div class="flex items-center justify-between gap-x-4 text-lg">
              <span class="font-medium text-[#A8AAAE]">Общая сумма:</span>
              <strong class="font-semibold text-dark">
                {{ formatNumber(ordersSum) }} сум
              </strong>
            </div>
            <div class="grid grid-cols-2 mt-6">
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
        </div>
      </Teleport>
    </Transition>
  </section>
</template>

<style lang="scss">
.menu {
  &__card {
    @apply rounded-2xl border border-[#E2E6F3] p-4 bg-[#F8F9FC] flex flex-col gap-x-3 text-center;

    &-img {
      @apply rounded-xl object-contain w-full mt-3;
    }

    &-title {
      @apply text-dark font-semibold text-xl;
    }

    &-subtitles {
      @apply flex flex-col gap-y-1 text-sm font-medium text-cool-gray mt-3;
    }

    &__actions {
      @apply mt-3.5 flex items-center justify-center gap-x-2 text-base font-medium text-dark-gray;
    }

    &__action {
      &-btn {
        @apply size-7 text-[#292D324D] rounded-lg shadow-[0_2px_8.4px_0_#292D3214] bg-white flex items-center justify-center;

        &__icon {
          @apply size-4;
        }
      }
    }
  }
}
</style>
