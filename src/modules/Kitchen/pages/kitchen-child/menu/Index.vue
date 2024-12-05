<script
  setup
  lang="ts"
>
import { computed, nextTick, reactive, ref, useTemplateRef, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { TableColumnType } from "@/types/common.type";
import { formatDate, formatNumber } from "@/utils/helper";
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
const router = useRouter();

enum TABS {
  CURRENT = 1,
  ALL,
}

const activeTab = ref<number>(TABS.CURRENT);
const tabItems = computed(() => [
  { value: TABS.CURRENT, name: "Текущее меню" },
  { value: TABS.ALL, name: "Все меню" },
]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      isActionable: false,
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
      isActionable: false,
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
  { label: "Ед. измерения", prop: "unit" },
  { label: "Цена", prop: "price" },
  { label: "Сумма", prop: "total_price" },
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

const salesTableCurrentChange = (value: Record<string, any>) => {
  router.push({ name: "KitchenMenuShow", params: { id: value.idx } });
};

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

const activeDate = ref("");
const activeListDate = ref("");

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
  { immediate: true },
);
const fullscreenLoading = ref(false);
watch(() => route.params, async () => {
  fullscreenLoading.value = true;

  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });

  await kitchenStore.GET_CURRENT_MENU_LIST(route.params.child_id as string);
  await kitchenStore.GET_WEEKLY_MENU_LIST(route.params.child_id as string);

  fullscreenLoading.value = false;

  setBreadCrumbFn();
}, { immediate: true });

watchEffect(() => {
  setBreadCrumbFn();
});

const scheduledDates = computed(() => {
  // Object.keys(kitchenStore.menuWeekly)
  if (!kitchenStore.menuWeekly || !Object.keys(kitchenStore.menuWeekly).length) return [];
  const formattedDates = [];
  for (let i = 0; i < Object.keys(kitchenStore.menuWeekly).length; i++) {
    const date = new Date(Object.keys(kitchenStore.menuWeekly)[i]);
    console.log(date);
    // date.setDate(date.getDate() + i);
    // console.log(date);
    const formattedDate = formatDate(date);
    formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
  }
  return formattedDates;
});


watch(scheduledDates, (newValue) => {
  if (newValue.length > 0) {
    activeDate.value = newValue[0].date;

    const [day, month, year] = activeDate.value.split(".");
    activeListDate.value = `${year}-${month}-${day}`;

  } else {
    activeDate.value = "";
    activeListDate.value = "";
  }
});

watch(activeDate, (newValue) => {
  if (newValue) {
    const [day, month, year] = activeDate.value.split(".");
    activeListDate.value = `${year}-${month}-${day}`;

  } else {
    activeDate.value = "";
    activeListDate.value = "";
  }
});

const mealTextFilter = (index: string): string => {
  switch (index) {
    case "1":
      return "Завтрак";
    case "2":
      return "Обед";
    case "3":
      return "Ужин";
    case "4":
      return "Сухой питания";
    default:
      return "";
  }
};
</script>

<template>
  <section
    v-loading.fullscreen.lock="fullscreenLoading"
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
          v-if="kitchenStore.menuToday.elements && kitchenStore.menuToday.elements.length"
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
          v-if="kitchenStore.menuToday.elements && kitchenStore.menuToday.elements.length"
          name="nested"
          :duration="{ enter: 500, leave: 1500 }"
          tag="div"
          class="relative overflow-x-hidden mt-6"
        >
          <div
            v-if="activeTab === TABS.CURRENT"
            class="inner"
          >
            <!--            {{ kitchenStore.menuWeekly.elements }}-->
            <div

              class="flex flex-col gap-y-8"
            >

              <div
                v-for="n in kitchenStore.menuToday.elements"
                :key="n"
                class="border rounded-2xl p-4 pb-6 border-[#E2E6F3]"
              >
                <div class="flex justify-between gap-x-5">
                  <div class="flex flex-col gap-y-2">
                    <h3 class="font-semibold text-lg text-dark">
                      {{ n.product_name }} {{
                        n.product_number
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
                        <span v-if="n.start_time && n.end_time">{{ n.start_time.slice(0, 5) }}-{{ n.end_time.slice(0, 5)
                          }}</span>
                      </div>
                      <span v-if="n.period">{{ mealTextFilter(n.period.toString()) }}</span>
                    </div>
                  </div>
                  <h3 class="font-semibold text-lg text-dark">{{ n.price && n.price.toLocaleString() }} UZS</h3>
                </div>
                <ElTable
                  :data="n.product"
                  empty-text="Нет данных"
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
                      <span class="text-cool-gray mr-2">Всего порций:</span>
                      <strong class="font-semibold text-dark">{{ n.amount }}</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray mr-2">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        {{ n.total_price && n.total_price.toLocaleString() }} UZS
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray mr-2">Выданние:</span>
                      <strong class="font-semibold text-dark">{{ n.amount_sold && n.amount_sold }}</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray mr-2">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        {{ n.price_sold && n.price_sold.toLocaleString() }} UZS
                      </strong>
                    </p>
                  </div>

                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray mr-2">Проданние:</span>
                      <strong class="font-semibold text-dark">{{ }}</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray mr-2">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        <!--                        {{ n.price_sold && n.price_sold.toLocaleString() }} UZS-->
                      </strong>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray mr-2">Остатки порций:</span>
                      <strong class="font-semibold text-[#EA5455]">{{ n.amount_left && n.amount_left }}</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray mr-2">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        {{ n.price_left && n.price_left.toLocaleString() }} UZS
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
            <!--            {{ kitchenStore.menuWeekly }}-->
            <!--            &lt;!&ndash;            {{ scheduledDates }}&ndash;&gt;-->
            <!--            {{ activeDate }}-->
            <!--            {{ activeListDate }}-->
            <ElScrollbar>
              <div class="flex flex-wrap">
                <button
                  v-for="item in scheduledDates"
                  :key="item.date"
                  :class="[
                    'py-2 px-4 text-center rounded-lg text-xs font-medium text-dark-gray transition duration-200 ease-in',
                    { 'bg-[#E2E6F3]': activeDate === item.date },
                  ]"
                  @click="activeDate = item.date"
                >
                  {{ item.title }}
                </button>
              </div>
            </ElScrollbar>
            <div class="mt-6">
              <div
                v-if="kitchenStore.activeMenuPart && kitchenStore.menuWeekly && Object.keys(kitchenStore.menuWeekly).length"
                class="flex flex-col gap-y-6"
              >
                <div v-for="(item, index) in kitchenStore.menuWeekly[activeListDate]">
                  <h2 class="font-semibold text-2xl text-black">{{ mealTextFilter(index) }}</h2>
                  <ElTable
                    :data="kitchenStore.menuWeekly[activeListDate][index]"
                    stripe
                    class="custom-element-table custom-element-table-normal mt-4"
                  >
                    <ElTableColumn
                      prop="idx"
                      label="№"
                    >
                      <template #default="{row, $index}">
                        <span>{{ $index + 1 }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="name"
                      label="Тип рациона"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      label="Время"
                      sortable
                    />
                    <ElTableColumn
                      prop="price"
                      label="Сумма"
                      sortable
                    >
                      <template #default="{row, $index}">
                        <span>{{ row.price && row.price.toLocaleString() }} сум</span>
                      </template>
                    </ElTableColumn>
                    <!--                    <ElTableColumn-->
                    <!--                      prop="action"-->
                    <!--                      label="Действие"-->
                    <!--                      align="right"-->
                    <!--                    >-->
                    <!--                      <template-->
                    <!--                        #default="{ row }: { row: Record<string, any> }"-->
                    <!--                      >-->
                    <!--                        <div-->
                    <!--                          v-if="row.action"-->
                    <!--                          class="flex items-center justify-end gap-x-2"-->
                    <!--                        >-->
                    <!--                          <button class="action-btn">-->
                    <!--                            <img-->
                    <!--                              src="@/assets/images/eye.svg"-->
                    <!--                              alt="eye"-->
                    <!--                            />-->
                    <!--                          </button>-->

                    <!--                          <button class="action-btn">-->
                    <!--                            <img-->
                    <!--                              src="@/assets/images/icons/edit.svg"-->
                    <!--                              alt="edit"-->
                    <!--                            />-->
                    <!--                          </button>-->
                    <!--                        </div>-->
                    <!--                      </template>-->
                    <!--                    </ElTableColumn>-->
                  </ElTable>
                </div>

              </div>
              <div v-else-if="kitchenStore.activeSalesPart">
                <h4 class="font-semibold text-2xl text-black">Меню</h4>
                <ElTable
                  :data="salesAllTabTableData"
                  stripe
                  class="custom-element-table custom-element-table-normal menu__sales-all-tab-table mt-4"
                  highlight-current-row
                  @current-change="salesTableCurrentChange"
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

                        <button
                          @click.stop
                          class="action-btn"
                        >
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
