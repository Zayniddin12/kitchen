<script
  setup
  lang="ts"
>
import { computed, nextTick, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from "vue";
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
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";
import { useI18n } from "vue-i18n";
import { WarehouseCapacityParamsType } from "@/modules/Home/statistics.types";
import tokenManager from "@/utils/token.manager";

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

const { t } = useI18n();

enum TABS {
  CURRENT = 1,
  ALL,
}

const activeTab = ref<number>(TABS.CURRENT);
const tabItems = computed(() => [
  {
    value: TABS.CURRENT,
    name: t("kitchen.currentMenu"),
  },
  {
    value: TABS.ALL,
    name: t("kitchen.allMenu"),
  },
]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
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
      label: t("common.menu"),
      isTranslate: true,
      isActionable: true,
    },
  ]);
};

const currentTabTableColumns = computed<TableColumnType[]>(() => [
  {
    label: t("common.name"),
    prop: "name",
  },
  {
    label: t("common.quantity"),
    prop: "quantity",
  },
  {
    label: t("common.measurement"),
    prop: "unit",
  },
  {
    label: t("common.price"),
    prop: "price",
  },
  {
    label: t("common.sum"),
    prop: "total_price",
  },
]);

const salesAllTabTableColumns = computed<TableColumnType[]>(() => [
  {
    label: "№",
    prop: "idx",
    sortable: false,
  },
  {
    label: t("kitchen.rationType"),
    prop: "type",
    sortable: true,
  },
  {
    label: t("kitchen.portion"),
    prop: "amount",
    sortable: true,
    align: "center",
  },
  {
    label: t("common.date"),
    prop: "date",
    sortable: true,
    align: "center",
  },
  {
    label: t("common.costPrice"),
    prop: "net_price",
    sortable: true,
    align: "center",
  },
  {
    label: t("common.price"),
    prop: "price",
    sortable: true,
    align: "center",
  },
  // {
  //   label: "Действие",
  //   prop: "action",
  //   sortable: false,
  //   align: "right",
  // },
]);

const salesTableCurrentChange = (value: Record<string, any>) => {
  router.push({ name: "KitchenMenuShow", params: { id: value.idx } });
};

const activeDate = ref("");
const activeListDate = ref("");

const sideBarStore = useSidebarStore();

const productsWrapperClassName = computed<string[]>(() => {
  const className = ["grid gap-6 mt-3"];

  if (!sideBarStore.childSideBarOpen && !ordersModal.value) {
    className.push("grid-cols-7");
  } else if (sideBarStore.childSideBarOpen && !ordersModal.value) {
    className.push("grid-cols-8");
  } else if (!sideBarStore.childSideBarOpen && ordersModal.value) {
    className.push("grid-cols-5");
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

  Object.keys(kitchenStore.menuTodaySales.elements).forEach(key => {
    if (key == "product") {
      Object.keys(kitchenStore.menuTodaySales.elements.product).forEach((key2) => {
        kitchenStore.menuTodaySales.elements.product[key2].forEach(product => {
          productMap.set(product.id, product);
        });
      });
    } else {
      kitchenStore.menuTodaySales.elements.meal.forEach(product => {
        productMap.set(product.id, product);
      });
    }
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
    selectedProducts.value.forEach(product => {
      if (product.id === product_id) {
        totalSum += product.price * quantity;
      }
    });
  });

  return totalSum;
});

const createOrder = async () => {


  let payload = {
    kitchen_id: Number(route.params.child_id),
    products: [],
    meals: [],
  };
  try {
    selectedProducts.value.forEach(product => {
      if (product.product_type == "product") {
        payload.products.push({
          menu_id: Number(product.id),
          id: Number(product.product_id),
          price: Number(product.price),
          quantity: Number(orders.get(product.id)),
        });
      } else {
        payload.meals.push({
          menu_id: Number(product.id),
          id: Number(product.product_id),
          price: Number(product.price),
          quantity: Number(orders.get(product.id)),
        });
      }
    });

    await kitchenStore.CREATE_ORDER(payload);
    await kitchenStore.GET_CURRENT_MENU_SALES_LIST(route.params.child_id as string);
    orders.clear();
    ordersModal.value = false;
  } catch (error) {

  }

};

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

  if (kitchenStore.activeSalesPart) {
    await kitchenStore.GET_CURRENT_MENU_SALES_LIST(route.params.child_id as string);
  }

  if (kitchenStore.activeMenuPart) {
    await kitchenStore.GET_CURRENT_MENU_LIST(route.params.child_id as string);

  }

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
      return t("mealTime.breakfast");
    case "2":
      return t("mealTime.first");
    case "3":
      return t("mealTime.second");
    case "4":
      return t("mealTime.salads");
    case "5":
      return t("mealTime.desserts");
    case "6":
      return t("mealTime.supplements");
    case "7":
      return t("mealTime.drinks");
    default:
      return "";
  }
};

const form = reactive<WarehouseCapacityParamsType>({
  management_id: 1,
});

onMounted(() => {
  route.query.management_id = form.management_id ? form.management_id.toString() : null;
});

watch(() => route.query.management_id, (newId) => {
  const management_id = newId ? parseInt(newId as string) : null;
  form.management_id = management_id && !isNaN(management_id) ? management_id : null;

}, { immediate: true });


const managements = ref<object[]>([
  {
    id: 1,
    name: "Завтрак",
  },
  {
    id: 2,
    name: "Первое",
  },
  {
    id: 3,
    name: "Второе",
  },
  {
    id: 4,
    name: "Салаты",
  },
  {
    id: 5,
    name: "Десерты",
  },
  {
    id: 6,
    name: "Добавки",
  },
  {
    id: 7,
    name: "Напитки",
  },

]);

const clearBasket = () => {
  confirm.delete().then(response => {
    orders.clear();
    ordersModal.value = false;
  });
};
</script>

<template>
  <section
    v-loading.fullscreen.lock="fullscreenLoading"
    class="menu transition-all duration-200"
    ref="menuSection"
  >
    <div>
      <h1 class="font-semibold text-[32px] text-dark">{{ t("common.menu") }}</h1>
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
          v-if="(kitchenStore.menuToday.elements && kitchenStore.menuToday.elements.length) || (kitchenStore.menuTodaySales.elements && Object.keys(kitchenStore.menuTodaySales.elements).length) || (kitchenStore.menuWeekly && Object.keys(kitchenStore.menuWeekly).length)"
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
                <span class="text-lg font-medium">{{ t("kitchen.prepareDishes") }}</span>
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
                <span class="text-lg font-medium">{{ t("common.sell") }}</span>
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
                  {{ t("method.edit") }}
                </span>
              </div>
            </ElButton>
          </template>
        </div>
      </div>
      <div class="mt-6">

        <TransitionGroup
          v-if="(kitchenStore.menuToday.elements && kitchenStore.menuToday.elements.length) || (kitchenStore.menuTodaySales.elements && Object.keys(kitchenStore.menuTodaySales.elements).length || (kitchenStore.menuWeekly && Object.keys(kitchenStore.menuWeekly).length))"
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
              v-if="kitchenStore.activeMenuPart"
              class="flex flex-col gap-y-8"
            >

              <div
                v-if="kitchenStore.menuToday.elements && kitchenStore.menuToday.elements.length"
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
                  :empty-text="t('common.empty')"
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
                      <strong class="font-semibold text-dark">{{ n.amount_served && n.amount_served }}</strong>
                    </p>
                    <p>
                      <span class="text-cool-gray mr-2">Сумма:</span>
                      <strong class="font-semibold text-dark">
                        {{ n.price_served && n.price_served.toLocaleString() }} UZS
                      </strong>
                    </p>
                  </div>

                  <div class="flex flex-col gap-y-2 text-sm">
                    <p>
                      <span class="text-cool-gray mr-2">Проданние:</span>
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

              <AppEmpty
                v-else
                class="h-[60vh]"
              />
            </div>
            <div
              v-else-if="kitchenStore.activeSalesPart"
              class="flex flex-col items-start gap-y-6"
            >

              <div
                class="app-tabs2 !text-sm mb-6"
              >
                <RouterLink
                  v-for="item in managements"
                  :key="item.id"
                  :to="{ query: { ...route.query, ...{ management_id: item.id } } }"
                  :class="[
                           'app-tab',
                           { 'app-tab--active': form.management_id == item.id },
                         ]"
                >
                  {{ item.name }}
                </RouterLink>
              </div>

              <div
                v-if="kitchenStore.menuTodaySales.elements && Object.keys(kitchenStore.menuTodaySales.elements).length"
                v-for="(dishe) in Object.keys(kitchenStore.menuTodaySales.elements)"
              >

                <div
                  v-if="dishe == 'product'"
                  v-for="(product, index) in Object.keys(kitchenStore.menuTodaySales.elements.product)"
                  :key="index"
                >
                  <h4 class="text-dark-gray font-semibold text-xl">
                    {{ product }}
                  </h4>
                  <div :class="productsWrapperClassName">
                    <div
                      v-for="productItem in kitchenStore.menuTodaySales.elements.product[product]"
                      :key="productItem.id"
                      class="menu__card !p-[8px] !bg-white"
                    >

                      <img
                        :src="ColaImg"
                        :alt="productItem.name"
                        class="object-cover rounded-[12px] w-full h-[120px]"
                      />

                      <div class="menu__card-subtitles text-start mt-[12px] mb-[16px]">
                        <span
                          class="text-[#000D24] font-semibold text-[20px] mb-[4px]">{{ formatNumber(productItem.price)
                          }} UZS</span>
                        <span class="text-[#000D24] font-medium text-[14px]">{{ productItem.name }} </span>
                      </div>

                      <h5 class="text-start text-[#A8AAAE]">
                        {{ productItem.unit_name }}
                      </h5>

                      <div
                        v-if="orders.get(productItem.id)"
                        class="menu__card__actions !justify-between  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]">
                        <button
                          @click="updateQuantity(productItem.id, false)"
                          :disabled="!orders.has(productItem.id)"
                          class=""
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16602 9.99967H15.8327" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                        <span>
                        {{ orders.get(productItem.id) ?? 0 }}
                        </span>
                        <button
                          @click="updateQuantity(productItem.id)"
                          class=""
                          :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"
                        >
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2"
                                  stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                      </div>
                      <!--                      :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"-->
                      <button v-else
                              @click="updateQuantity(productItem.id)"

                              class="menu__card__actions  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                          <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>


                        Добавить
                      </button>
                    </div>
<!--                    <div-->
<!--                      v-for="productItem in kitchenStore.menuTodaySales.elements.product[product]"-->
<!--                      :key="productItem.id"-->
<!--                      class="menu__card"-->
<!--                    >-->
<!--                      <h5 class="menu__card-title">-->
<!--                        {{ productItem.name }}-->
<!--                      </h5>-->
<!--                      <img-->
<!--                        :src="ColaImg"-->
<!--                        :alt="productItem.name"-->
<!--                        class="menu__card-img"-->
<!--                      />-->
<!--                      <div class="menu__card-subtitles">-->
<!--                        <span>{{ productItem.unit_name }} </span>-->
<!--                        <span>{{ formatNumber(productItem.price) }} UZS</span>-->
<!--                      </div>-->
<!--                      <div class="menu__card__actions">-->
<!--                        <button-->
<!--                          @click="updateQuantity(productItem.id, false)"-->
<!--                          :disabled="!orders.has(productItem.id)"-->
<!--                          class="menu__card__action-btn"-->
<!--                        >-->
<!--                          <svg-->
<!--                            :data-src="MinusIcon"-->
<!--                            class="menu__card__action-btn__icon"-->
<!--                          />-->
<!--                        </button>-->
<!--                        <span>-->
<!--                        {{ orders.get(productItem.id) ?? 0 }}-->
<!--                      </span>-->
<!--                        <button-->
<!--                          @click="updateQuantity(productItem.id)"-->
<!--                          class="menu__card__action-btn"-->
<!--                          :disabled="orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"-->
<!--                        >-->
<!--                          <svg-->
<!--                            :data-src="Plus3Icon"-->
<!--                            class="menu__card__action-btn__icon"-->
<!--                          />-->
<!--                        </button>-->
<!--                      </div>-->
<!--                    </div>-->
                  </div>
                </div>
                <div
                  v-if="dishe == 'meal'"
                >
                  <h4 class="text-dark-gray font-semibold text-xl">
                    Блюда
                  </h4>
                  <div :class="productsWrapperClassName">
                    <div
                      v-for="productItem in kitchenStore.menuTodaySales.elements.meal"
                      :key="productItem.id"
                      class="menu__card !p-[8px] !bg-white"
                    >

                      <img
                        :src="ColaImg"
                        :alt="productItem.name"
                        class="object-cover rounded-[12px] w-full h-[120px]"
                      />

                      <div class="menu__card-subtitles text-start mt-[12px] mb-[16px]">
                        <span
                          class="text-[#000D24] font-semibold text-[20px] mb-[4px]"
                        >
                          {{ formatNumber(productItem.price) }} UZS</span>
                        <span class="text-[#000D24] font-medium text-[14px]">{{ productItem.name }} </span>
                      </div>

                      <h5 class="text-start text-[#A8AAAE]">
                        {{ productItem.unit_name }}
                      </h5>

                      <div
                        v-if="orders.get(productItem.id)"
                        class="menu__card__actions !justify-between  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]"
                      >
                        <button
                          @click="updateQuantity(productItem.id, false)"
                          :disabled="!orders.has(productItem.id)"
                          class=""
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.16602 9.99967H15.8327"
                              stroke="#4F5662"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                        </button>
                        <span>
                        {{ orders.get(productItem.id) ?? 0 }}
                        </span>
                        <button
                          @click="updateQuantity(productItem.id)"
                          class=""
                          :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"
                        >
                          <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.5007 4.16699V15.8337"
                              stroke="#4F5662"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.66602 9.99967H16.3327"
                              stroke="#4F5662"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                        </button>
                      </div>
                      <!--                      :disabled="productItem.amount == 0 || orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"-->
                      <button
                        v-else
                        @click="updateQuantity(productItem.id)"

                        class="menu__card__actions  bg-[#E2E6F3] px-[24px] py-[14px] rounded-[12px]"
                      >
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5007 4.16699V15.8337"
                            stroke="#4F5662"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.66602 9.99967H16.3327"
                            stroke="#4F5662"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        {{ t("method.add") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <AppEmpty
                v-else
                class="h-[60vh]"
              />
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
                    :empty-text="t('common.empty')"
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
                      :label="t('kitchen.rationType')"
                      sortable
                    />
                    <ElTableColumn
                      prop="time"
                      :label="t('common.time')"
                      sortable
                    />
                    <ElTableColumn
                      prop="price"
                      :label="t('common.sum')"
                      sortable
                    >
                      <template #default="{row, $index}">
                        <span>{{ row.price && row.price.toLocaleString() }} {{ t("currency.sum") }}</span>
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
                <h4 class="font-semibold text-2xl text-black">{{ t("common.menu") }}</h4>
                <ElTable
                  v-if="kitchenStore.menuWeekly && kitchenStore.menuWeekly[activeListDate] && kitchenStore.menuWeekly[activeListDate]"
                  :data="kitchenStore.menuWeekly[activeListDate].product ? kitchenStore.menuWeekly[activeListDate].product : kitchenStore.menuWeekly[activeListDate].meal"
                  stripe
                  class="custom-element-table custom-element-table-normal menu__sales-all-tab-table mt-4"
                  highlight-current-row
                  :empty-text="t('common.empty')"
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
                      v-if="column.prop === 'idx'"
                      #default="{ row, $index }: { row: Record<string, any>, $index: number }"
                    >
                      <div class="">
                        {{ $index + 1 }}
                      </div>
                    </template>
                    <template
                      v-if="column.prop === 'type'"
                      #default="{ row }: { row: Record<string, any> }"
                    >
                      <div class="flex items-center gap-x-3">
                        <img
                          :src="image"
                          :alt="row.name"
                          class="size-8 rounded-full object-contain"
                        />
                        <span>{{ row.name }}</span>
                      </div>
                    </template>

                    <template
                      v-if="column.prop === 'date'"
                      #default="{ row }: { row: Record<string, any> }"
                    >
                      <div class="text-center">
                        {{ activeListDate }}
                      </div>
                    </template>

                    <template
                      v-if="column.prop === 'net_price'"
                      #default="{ row }: { row: Record<string, any> }"
                    >
                      <div class="text-center">
                        {{ row.net_price && row.net_price.toLocaleString() }}
                      </div>
                    </template>

                    <template
                      v-if="column.prop === 'price'"
                      #default="{ row }: { row: Record<string, any> }"
                    >
                      <div class="text-center">
                        {{ row.price && row.price.toLocaleString() }}
                      </div>
                    </template>
                    <!--                    <template-->
                    <!--                      v-if="column.prop === 'action'"-->
                    <!--                      #default="{ row }: { row: Record<string, any> }"-->
                    <!--                    >-->
                    <!--                      <div-->
                    <!--                        v-if="row.action"-->
                    <!--                        class="flex items-center justify-end gap-x-2"-->
                    <!--                      >-->
                    <!--                        <RouterLink-->
                    <!--                          :to="{-->
                    <!--                            name: 'KitchenMenuShow',-->
                    <!--                            params: { id: row.idx },-->
                    <!--                          }"-->
                    <!--                          class="action-btn"-->
                    <!--                        >-->
                    <!--                          <img-->
                    <!--                            src="@/assets/images/eye.svg"-->
                    <!--                            alt="eye"-->
                    <!--                          />-->
                    <!--                        </RouterLink>-->

                    <!--                        <button-->
                    <!--                          @click.stop-->
                    <!--                          class="action-btn"-->
                    <!--                        >-->
                    <!--                          <img-->
                    <!--                            src="@/assets/images/icons/edit.svg"-->
                    <!--                            alt="edit"-->
                    <!--                          />-->
                    <!--                        </button>-->
                    <!--                      </div>-->
                    <!--                    </template>-->
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
            {{ t("kitchen.theMealPlanHasNotBeenMadeYet") }}
          </p>
          <ElButton
            class="!bg-blue-500 mt-6"
            type="primary"
            size="large"
            tag="index-link"
            @click="$router.push({name: 'KitchenMenuCreate'})"
          >
            <div class="flex items-center gap-x-2">
              <svg
                :data-src="PlusIcon"
                class="size-6"
              />
              <span class="text-lg font-medium">
                {{ t("method.add") }}
              </span>
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
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xl text-black font-semibold pl-8">Корзина</h4>
              <button v-if="orders.size" @click="clearBasket"
                      class="text-[#A8AAAE] text-[14px] bg-red-500 mr-6 text-white px-2 py-1 rounded-[8px]">
                Очистить
              </button>
            </div>
            <div
              v-if="selectedProducts.length > 0"
              class="grid gap-2 px-6"
            >
              <!--              menu__card-->
              <div
                class="h-auto xl:h-[136px] p-[8px] flex items-center xl:items-stretch gap-2 bg-[#F8F9FC] rounded-[16px]"
                v-for="(productItem, productIndex) in selectedProducts"
                :key="productIndex"
              >
                <!--                {{productItem}}-->
                <!--                menu__card-img-->
                <img
                  :src="ColaImg"
                  :alt="productItem.name"
                  class="lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] 2xl:w-[120px] 2xl:h-[120px] w-[100px] object-cover rounded-[12px]"
                />
                <div class="w-full flex flex-col">
                  <div class="flex 2xl:items-center justify-between flex-col 2xl:flex-row">
                    <!--                    menu__card-title-->
                    <h5 class="text-[#000D24] xl:text-[14px] 2xl:text-[20px] font-semibold">
                      {{ formatNumber(productItem.price) }} UZS
                    </h5>

                    <span class="text-[#A8AAAE]">{{ productItem.unit_name }} </span>
                  </div>
                  <h5
                    class="text-[#000D24] truncate w-full max-w-[200px] font-medium text-[12px] xl:text-[14px] mt-[4px]">
                    {{ productItem.name }}
                  </h5>

                  <div
                    v-if="orders.get(productItem.id)"
                    class="menu__card__actions !justify-between  bg-[#E2E6F3] 2xl:px-[24px] 2xl:py-[14px] xl:px-[20px] xl:py-[10px] px-[16px] py-[6px] rounded-[12px] !mt-auto">
                    <button
                      @click="updateQuantity(productItem.id, false)"
                      :disabled="!orders.has(productItem.id)"
                      class=""
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16602 9.99967H15.8327" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                    <span class="h-[20px]">
                        {{ orders.get(productItem.id) ?? 0 }}
                        </span>
                    <button
                      @click="updateQuantity(productItem.id)"
                      class=""
                      :disabled="orders.has(productItem.id) && (orders.get(productItem.id) == productItem.amount)"
                    >
                      <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5007 4.16699V15.8337" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.66602 9.99967H16.3327" stroke="#4F5662" stroke-width="1.2"
                              stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
<!--          <div class="mt-6 px-8">-->
<!--            <div class="flex items-center justify-between gap-x-4 text-lg">-->
<!--              <span class="font-medium text-[#A8AAAE]">-->
<!--                {{ t("common.totalSum") }}:-->
<!--              </span>-->
<!--              <strong class="font-semibold text-dark">-->
<!--                {{ formatNumber(ordersSum) }} {{ t("currency.sum") }}-->
<!--              </strong>-->
<!--            </div>-->
<!--            <div class="grid grid-cols-2 mt-6">-->
<!--              <ElButton-->
<!--                @click="clearOrders"-->
<!--                class="!bg-[#E2E6F3] border-none text-sm !text-dark-gray"-->
<!--                size="large"-->
<!--              >-->
<!--                {{ t("method.cancel") }}-->
<!--              </ElButton>-->
<!--              <ElButton-->
<!--                type="primary"-->
<!--                size="large"-->
<!--                class="!bg-blue"-->
<!--                @click="createOrder"-->
<!--              >-->
<!--                {{ t("common.sell") }}-->
<!--              </ElButton>-->
<!--            </div>-->
<!--          </div>-->

          <div v-if="orders.size" class="mt-6 px-8">
            <button
              class="!bg-blue w-full flex items-center justify-between px-[24px] py-[14px] rounded-[12px] text-white"
              @click="createOrder"
            >
              Далее

              <strong class="font-semibold ml-auto">
                {{ formatNumber(ordersSum) }} сум
              </strong>
            </button>

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
