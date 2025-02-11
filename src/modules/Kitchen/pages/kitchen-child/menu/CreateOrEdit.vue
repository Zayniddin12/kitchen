<script
  setup
  lang="ts"
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { formatDate } from "@/utils/helper";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import PlusIcon from "@/assets/images/icons/plus.svg";
import { TableColumnType } from "@/types/common.type";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { useSettingsStore } from "@/modules/Settings/store";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import type { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";
import { useI18n } from "vue-i18n";
import ru from "element-plus/es/locale/lang/ru";
import { ElConfigProvider } from "element-plus";

interface MealDataType {
  period: number;
  start_time: string;
  end_time: string;
  amount: number | string;
  product_type: string;
  product_id: number | string;
  rationsList: any;
}

interface DataType {
  id: number | string;
  title: string;
  isChecked: boolean;
  mealData: MealDataType[];
}

interface MealType {
  date: string;
  data: DataType[];
}

interface ListDataType {
  id?: number | string;
  product: number | null;
  vid_product: number | null;
  meal: number | null;
  amount: number | null;
  vid_list: any[];
  meals_list: any[];
}

interface ListDishesType {
  date: string;
  data: ListDataType[];
}

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

// Store
const settingsStore = useSettingsStore();
const kitchenStore = useKitchenStore();

// State
const kitchenData = ref({
  startDate: null,
  intermediateDate1: true,
  endDate: null,
});

const activeScheduledDate = ref("");

const data = ref<MealType | []>([]);

// List dishes

const list_dishes = ref<ListDishesType | []>([]);

const mealTimesV$ = ref<ValidationType | null>(null);
const kitchenDatav$ = ref<ValidationType | null>(null);

// Table Columns
const tableColumns: TableColumnType[] = [
  {
    label: t("common.name"),
    prop: "name",
  },
  {
    label: t("common.quantity"),
    prop: "quantity",
    align: "center",
  },
  {
    label: t("common.measurement"),
    prop: "unit",
    align: "center",
  },
  {
    label: t("common.price"),
    prop: "net_price",
    align: "right",
  },
  {
    label: t("common.sum"),
    prop: "total_price",
    align: "right",
  },
];


function getDaysInterval(date1, date2) {
  // Parse the dates in DD.MM.YYYY format
  const d1 = new Date(date1.split(".").reverse().join("-"));
  const d2 = new Date(date2.split(".").reverse().join("-"));

  // Calculate the difference in milliseconds and convert to days
  return Math.abs((d2 - d1) / (1000 * 60 * 60 * 24));
}


// Computed
const scheduledDates = computed(() => {
  if (kitchenStore.activeMenuPart) {
    if (!kitchenData.value.startDate) return [];
    const intermediate = kitchenData.value.intermediateDate1 ? 7 : 10;
    const formattedDates = [];
    for (let i = 0; i < intermediate; i++) {
      const date = new Date(kitchenData.value.startDate.split(".").reverse().join("-"));
      date.setDate(date.getDate() + i);
      const formattedDate = formatDate(date);
      formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
    }
    return formattedDates;
  } else if (kitchenStore.activeSalesPart) {
    if (!kitchenData.value.startDate || !kitchenData.value.endDate) return [];
    const intermediate = getDaysInterval(kitchenData.value.startDate, kitchenData.value.endDate) + 1;
    const formattedDates = [];
    for (let i = 0; i < intermediate; i++) {
      const date = new Date(kitchenData.value.startDate.split(".").reverse().join("-"));
      date.setDate(date.getDate() + i);
      const formattedDate = formatDate(date);
      formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
    }
    return formattedDates;
  } else return [];
});

watch(() => kitchenData.value.startDate, (newValue, oldValue) => {

  if (newValue && oldValue) {
    kitchenData.value.endDate = null;
  }
});

// Watch
watch(scheduledDates, async (newValue) => {
  if (newValue.length > 0) {
    if (route.name === "KitchenMenuEdit") {
      await kitchenStore.GET_ELEMENT_LIST(route.params.child_id as string, { type: kitchenStore.activeSalesPart ? 1 : 0 });
    }

    if (kitchenStore.activeMenuPart) {
      data.value = [];

      if (route.name === "KitchenMenuEdit") {

        newValue.forEach(el => {
          data.value.push({
            date: el.date,
            data: [
              {
                id: 1,
                title: t("mealTime.breakfast"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"].map(item => {
                  return {
                    id: item.id,
                    period: 1,
                    start_time: item.start_time && item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time && item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      vat_price: item.vat_price,
                      price: item.price,
                      products: item.product,
                    },
                  };
                }) : [
                  {
                    period: 1,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 2,
                title: t("mealTime.lunch"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"].map(item => {
                  return {
                    id: item.id,
                    period: 2,
                    start_time: item.start_time && item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time && item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      vat_price: item.vat_price,
                      price: item.price,
                      products: item.product,
                    },
                  };
                }) : [
                  {
                    period: 2,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 3,
                title: t("mealTime.dinner"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"].map(item => {
                  return {
                    id: item.id,
                    period: 3,
                    start_time: item.start_time && item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time && item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      vat_price: item.vat_price,
                      price: item.price,
                      products: item.product,
                    },
                  };
                }) : [
                  {
                    period: 3,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 4,
                title: t("mealTime.extra_food"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"].map(item => {
                  return {
                    id: item.id,
                    period: 4,
                    start_time: item.start_time && item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time && item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      vat_price: item.vat_price,
                      price: item.price,
                      products: item.product,
                    },
                  };
                }) : [
                  {
                    period: 4,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },

            ],
          });
        });
      } else {
        newValue.forEach(el => {
          data.value.push({
            date: el.date,
            data: [
              {
                id: 1,
                title: t("mealTime.breakfast"),
                isChecked: false,
                mealData: [
                  {
                    period: 1,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 2,
                title: t("mealTime.lunch"),
                isChecked: false,
                mealData: [
                  {
                    period: 2,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 3,
                title: t("mealTime.dinner"),
                isChecked: false,
                mealData: [
                  {
                    period: 3,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
              {
                id: 4,
                title: t("mealTime.extra_food"),
                isChecked: false,
                mealData: [
                  {
                    period: 4,
                    start_time: null,
                    end_time: null,
                    amount: null,
                    product_type: "ration",
                    product_id: null,
                    rationsList: {},
                  },
                ],
              },
            ],
          });
        });
      }


    }
    if (kitchenStore.activeSalesPart) {
      list_dishes.value = [];
      if (route.name === "KitchenMenuEdit") {
        console.log("Fgrsgfe");
        newValue.forEach(el => {

          console.log(el.date);
          console.log(kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]);

          list_dishes.value.push({
            date: el.date,
            data: [
              {
                id: 1,
                title: t("mealTime.breakfast"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"].map(item => {
                  return {
                    id: item.id,
                    period: 1,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 1,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 2,
                title: t("mealTime.first"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"].map(item => {
                  return {
                    id: item.id,
                    period: 2,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 2,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 3,
                title: t("mealTime.second"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"].map(item => {
                  return {
                    id: item.id,
                    period: 3,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 3,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 4,
                title: t("mealTime.salads"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"].map(item => {
                  return {
                    id: item.id,
                    period: 4,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 4,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 5,
                title: t("mealTime.desserts"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["5"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["5"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["5"].map(item => {
                  return {
                    id: item.id,
                    period: 5,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 5,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 6,
                title: t("mealTime.supplements"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["6"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["6"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["6"].map(item => {
                  return {
                    id: item.id,
                    period: 6,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 6,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
              {
                id: 7,
                title: t("mealTime.drinks"),
                isChecked: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["7"] ? true : false,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")] && kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["7"] ? kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["7"].map(item => {
                  return {
                    id: item.id,
                    period: 7,
                    product: item.parent_id ? item.parent_id : null,
                    vid_product: item.parent_id ? item.product_id : null,
                    meal: !item.parent_id ? item.product_id : null,
                    amount: item.amount,
                    vid_list: [],
                    meals_list: {},
                  };
                }) : [
                  {
                    period: 7,
                    product: null,
                    vid_product: null,
                    meal: null,
                    amount: null,
                    vid_list: [],
                    meals_list: [],
                  },
                ],
              },
            ],
          });
        });
      } else {
        newValue.forEach(item => {
          list_dishes.value.push(
            {
              date: item.date,
              data: [
                {
                  id: 1,
                  title: t("mealTime.breakfast"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 1,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 2,
                  title: t("mealTime.first"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 2,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 3,
                  title: t("mealTime.second"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 3,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 4,
                  title: t("mealTime.salads"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 4,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 5,
                  title: t("mealTime.desserts"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 5,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 6,
                  title: t("mealTime.supplements"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 6,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
                {
                  id: 7,
                  title: t("mealTime.drinks"),
                  isChecked: false,
                  mealData: [
                    {
                      period: 7,
                      product: null,
                      vid_product: null,
                      meal: null,
                      amount: null,
                      vid_list: [],
                      meals_list: [],
                    },
                  ],
                },
              ],
            },
          );

          // list_dishes.value.push({
          //   date: item.date,
          //   data: [
          //     {
          //       product: null,
          //       vid_product: null,
          //       meal: null,
          //       amount: null,
          //       vid_list: [],
          //       meals_list: [],
          //     },
          //   ],
          // });
        });
      }


    }

    activeScheduledDate.value = newValue[0].date;

  } else {
    activeScheduledDate.value = "";
  }
});

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
      label: "common.menu",
      isTranslate: true,
      to: { name: "KitchenMenuIndex" },
    },
    {
      label: route.meta.breadcrumbItemTitle ?? "",
      isTranslate: !!route.meta.breadcrumbItemIsTranslate,
      isActionable: true,
    },
  ]);
};

onMounted(async () => {

  await settingsStore.GET_MEALS({ per_page: 100, kitchen_id: route.params.child_id, ready_to_eat: 1 });
  await settingsStore.GET_TYPE_PRODUCT({ per_page: 100, kitchen_id: route.params.child_id, ready_to_eat: 1 });

  if (route.name === "KitchenMenuEdit") {
    await kitchenStore.GET_MENU_ITEM(route.params.child_id as string, { type: kitchenStore.activeSalesPart ? 1 : 0 });
    if (kitchenStore.activeMenuPart) {
      kitchenData.value.startDate = kitchenStore.menuItem.menu.start_date.split(".").reverse().join("-");
      kitchenData.value.intermediateDate1 = kitchenStore.menuItem.menu.duration == 7;

    }
    if (kitchenStore.activeSalesPart) {
      kitchenData.value.startDate = kitchenStore.menuItem.menu.start_date.split(".").reverse().join("-");
      ;
      kitchenData.value.endDate = kitchenStore.menuItem.menu.end_date.split(".").reverse().join("-");
      ;
    }


  }
});

watchEffect(() => {
  setBreadCrumbFn();
});

const scheduledItemDateClass = (date: string): string[] => {
  const classes: string[] = ["text-center rounded-lg font-medium"];

  const isActiveItem = date === activeScheduledDate.value;

  if (route.name === "KitchenMenuCreate") {
    classes.push("text-sm text-[#A8AAAE] mr-6 last:mr-0");
    if (isActiveItem) classes.push("text-blue-500");
  } else if (route.name === "KitchenMenuEdit") {
    classes.push("text-dark-gray transition duration-200 ease-in text-xs py-2 px-3");
    if (isActiveItem) classes.push("bg-[#E2E6F3]");
  }

  return classes;
};

const { confirm } = useConfirm();

const cancel = () => {
  confirm.cancel().then(response => {
    router.push({ name: "KitchenMenuIndex" });
  });
};

const addMealItem = (index: number, childIndex: string | number) => {
  data.value[index].data[childIndex].mealData.push(
    {
      period: index + 1,
      start_time: null,
      end_time: null,
      amount: null,
      product_type: "ration",
      product_id: null,
      rationsList: [],
    },
  );
};

const changeRation = async (val: number, parentIndex: number, childIndex: number, indexMeal: number): Promise<void> => {
  if (val) {
    const responseData = await kitchenStore.GET_RATION_LIST_IN_MENU(val);
    // console.log(data);
    data.value[parentIndex].data[childIndex].mealData[indexMeal].rationsList = responseData && responseData;
  }
};

const commonStore = useCommonStore();

const checkIsEmpty = (data: any[]): boolean => {
  let dateInput = false;

  if (kitchenStore.activeSalesPart) {

  }

  for (let datee of data) {
    let userChecked = false;

    for (let datum of datee.data) {
      if (datum.isChecked === false) {
        continue;
      }
      userChecked = true;

      for (let meal of datum.mealData) {

        if (kitchenStore.activeSalesPart) {
          if (!meal["amount"]) {
            commonStore.errorToast(t("form.validate.emptyField") + ": amount");
            return false;
          }
          if (!meal["meal"] && !meal["vid_product"]) {
            commonStore.errorToast(t("form.validate.emptyField") + ": meal or vid_product");
            return false;
          }
        } else {
          // Check if all required fields in mealData are set
          for (let key of Object.keys(meal)) {
            if (!meal[key]) {
              commonStore.errorToast(t("form.validate.emptyField") + `: ${key}`);
              return false;
            }
          }
        }


      }

      dateInput = true; // Indicates valid input exists
    }

    if (!userChecked) {
      commonStore.errorToast(t("kitchen.error.atLeastOnePeriodMustBeAdded"));
      return false;
    }
  }

  if (!dateInput) {
    commonStore.errorToast(t("kitchen.error.noValidDateInputFound"));
    return false;
  }

  return true; // All checks passed
};

const sendData = async () => {
  if (kitchenStore.activeMenuPart) {
    if (!kitchenDatav$.value) return;

    if (!(await kitchenDatav$.value.validate())) {
      await commonStore.errorToast(t("error.validation"));
      return;
    }

    if (!checkIsEmpty(data.value)) {
      return;
    }


    let kitchenPayload = {
      kitchen_id: Number(route.params.child_id),
      start_date: kitchenData.value.startDate.split(".").reverse().join("-"),
      end_date: "",
      type: kitchenStore.activeSalesPart ? 1 : 0,
      duration: kitchenData.value.intermediateDate1 ? 7 : 10,
    };

    const kitchenElementPayload = data.value.flatMap(({ date, data }) =>
      data
        .filter(meal => meal.isChecked) // Only include meals with isChecked === true
        .flatMap(meal =>
          meal.mealData.map((mealDetail) => ({
            date,
            ...mealDetail,
          })),
        ),
    );


    kitchenElementPayload.forEach(item => {
      item.amount = Number(item.amount);
      delete item.rationsList;
    });

    if (route.name !== "KitchenMenuEdit") {
      const kitchenResponse = await kitchenStore.CREATE_KITCHEN(kitchenPayload);

      await kitchenStore.CREATE_KITCHEN_ELEMENT({
        id: kitchenResponse.data.menu_id,
        payload: { Elements: kitchenElementPayload },
      });
    } else {
      let menu_id = kitchenStore.menuItem.menu.id;
      await kitchenStore.UPDATE_MENU(menu_id, kitchenPayload);
      await kitchenStore.UPDATE_MENU_ELEMENT(menu_id, { Elements: kitchenElementPayload });
    }


  }

  if (kitchenStore.activeSalesPart) {
    if (!kitchenDatav$.value) return;

    if (!await kitchenDatav$.value.validate()) {
      await commonStore.errorToast(t("error.validation"));
      return;
    }

    if (!checkIsEmpty(list_dishes.value)) {
      return;
    }

    let kitchenPayload = {
      kitchen_id: Number(route.params.child_id),
      start_date: kitchenData.value.startDate.split(".").reverse().join("-"),
      end_date: kitchenData.value.endDate.split(".").reverse().join("-"),
      type: kitchenStore.activeSalesPart ? 1 : 0,
    };

    const kitchenElementPayload = list_dishes.value.flatMap(({ date, data }) =>
      data
        .filter(meal => meal.isChecked) // Only include meals with isChecked === true
        .flatMap(meal =>
          meal.mealData.map((mealDetail) => ({
            ...(mealDetail.id && { id: mealDetail.id }),
            period: mealDetail.period,
            date: date,
            ["product_id"]: mealDetail.meal ? mealDetail.meal : mealDetail.vid_product,
            amount: Number(mealDetail.amount),
            product_type: mealDetail.meal ? "meal" : "product",
          })),
        ),
    );

    // let kitchenElementPayload = list_dishes.value.map((entry) => {
    //   return entry.data.map(meal => {
    //     return {
    //       ...(meal.id && { id: meal.id }),
    //       date: entry.date,
    //       ["product_id"]: meal.meal ? meal.meal : meal.vid_product,
    //       amount: Number(meal.amount),
    //       product_type: meal.meal ? "meal" : "product",
    //     };
    //   });
    // }).flat();


    // kitchenElementPayload.forEach(item => {
    //   item.amount = Number(item.amount);
    //   delete item.rationsList;
    // });

    if (route.name !== "KitchenMenuEdit") {
      const kitchenResponse = await kitchenStore.CREATE_KITCHEN(kitchenPayload);

      const kitchenResponseElement = await kitchenStore.CREATE_KITCHEN_ELEMENT({
        id: kitchenResponse.data.menu_id,
        payload: { Elements: kitchenElementPayload },
      });
    } else {
      let menu_id = kitchenStore.menuItem.menu.id;
      await kitchenStore.UPDATE_MENU(menu_id, kitchenPayload);

      await kitchenStore.UPDATE_MENU_ELEMENT(menu_id, { Elements: kitchenElementPayload });
    }


  }

  await router.push(`/kitchen/${route.params.department_id}/${kitchenStore.activeSalesPart ? "sales" : "free-kitchen"}/${route.params.kitchen_id}/${route.params.child_id}/menu`);

};

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });

  setBreadCrumbFn();
}, { immediate: true });

watch(() => kitchenData.value.intermediateDate1, async (val) => {
  await settingsStore.GET_RATION_LIST({ per_page: 100, duration: val ? 7 : 10, kitchen_id: route.params.child_id });
}, { immediate: true });


const changeInput = async (event: any, index: number, childIndex: number, indexMeal: number) => {
  // list_dishes.value[index].data[childIndex].vid_product = null
  if (typeof event !== "object") {
    const data = await settingsStore.GET_MEALS_VID_PRO({
      parent_id: event,
      kitchen_id: route.params.child_id,
      ready_to_eat: 1,
    });

    list_dishes.value[index].data[childIndex].mealData[indexMeal].vid_list = data.product_types ? data.product_types : [];
  }

};

const changeInputMeals = async (event: any, index: number, childIndex: number, indexMeal: number) => {
  // list_dish2es.value[index].data[childIndex].vid_product = null
  if (typeof event !== "object") {
    const { meal } = await settingsStore.GET_MEALS_DETAIL(event, { kitchen_id: route.params.child_id });
    console.log(meal);
    // list_dishes.value[index].data[childIndex].meals_list = meal ? meal : {};
    list_dishes.value[index].data[childIndex].mealData[indexMeal].meals_list = meal ? meal : {};

  }


  // list_dishes.value[index].data[childIndex].meals_list = data.product_types ? data.product_types : [];
};


const changeChange = async (event: any, index: number, childIndex: number, indexMeal: number) => {
  list_dishes.value[index].data[childIndex].mealData[indexMeal].vid_product = null;
  // const data = await settingsStore.GET_MEALS_VID_PRO({ parent_id: event });
  //
  // list_dishes.value[index].data[childIndex].vid_list = data.product_types ? data.product_types : [];
};

const addMeal = (index: number, childIndex: string | number) => {
  console.log(index);
  console.log(childIndex, "childIndex");
  list_dishes.value[index].data[childIndex].mealData.push(
    {
      period: childIndex + 1,
      product: null,
      vid_product: null,
      meal: null,
      amount: null,
      vid_list: [],
      meals_list: [],
    },
  );
};


const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

</script>


<template>
  <section class="meal-plan-create">
    <div>
      <h1
        v-if="title"
        class="font-semibold text-[32px] text-dark"
      >
        {{ isTranslate ? t(title) : title }}
      </h1>
      <div>
        <div class="p-6 rounded-3xl border border-[#E2E6F3] mt-6 min-h-[671px]">
          <div>
            <!--            {{ kitchenStore.menuElement.elements }}-->
            <!--            {{ kitchenData }}-->
            <!--            {{ kitchenStore.menuElement }}-->
            <h3 class="text-lg font-medium text-dark">
              {{ t("common.enterDate") }}
            </h3>
            <!--            {{ kitchenStore.menuItem }}-->
            <div>
              <AppForm
                :value="kitchenData"
                @validation="value => kitchenDatav$ = value"
              >

                <div class="flex items-center gap-4">
                  <el-config-provider :locale="ru">
                    <AppDatePicker
                      v-model="kitchenData.startDate"
                      prop="startDate"
                      placeholder="дд.мм.гггг"
                      format="DD.MM.YYYY"
                      class="w-[141px] mt-3"
                      icon-position="start"
                      required
                    />
                  </el-config-provider>

                  <AppDatePicker
                    v-if="kitchenStore.activeSalesPart"
                    v-model="kitchenData.endDate"
                    prop="endDate"
                    placeholder="дд.мм.гггг"
                    format="DD.MM.YYYY"
                    class="w-[141px] mt-3"
                    icon-position="start"
                    required
                  />
                </div>
                <ElSwitch
                  v-if="kitchenStore.activeMenuPart"
                  v-model="kitchenData.intermediateDate1"
                  :active-text="t('common.days', {number: 7})"
                  :inactive-text="t('common.days', {number: 10})"
                  class="app-switch"
                />

              </AppForm>
            </div>
          </div>
          <ElScrollbar
            v-if="scheduledDates.length>0"
            class="mt-8"
          >
            <div
              class="flex flex-wrap items-center gap-4"
            >
              <!--              {{ scheduledDates }}-->
              <button
                v-for="item in scheduledDates"
                :key="item.date"
                :class="scheduledItemDateClass(item.date)"
                @click="activeScheduledDate = item.date"
              >
                {{ item.title }}
              </button>
            </div>
          </ElScrollbar>
          <div class="mt-6">
            <!--            {{ data[0] }}-->
            <div v-if="kitchenStore.activeMenuPart && activeScheduledDate && data.length>0">
              <h3 class="text-lg font-medium text-dark">
                {{ t("kitchen.chooseYourMealTime") }}!
              </h3>
              <div v-for="(item, index) in data">
                <!--              {{ mealTimes[0] }}-->
                <div
                  v-show="item.date === activeScheduledDate"
                  class="mt-3 flex flex-col gap-y-3"
                >
                  <div
                    v-for="(childItem, childIndex) in item.data"
                  >
                    <ElCheckbox
                      v-model="childItem.isChecked"
                      class="app-checkbox"
                      :label="childItem.title"
                    />
                    <div
                      v-show="childItem.isChecked"
                      class="mt-6"
                    >
                      <!--                    {{ item.mealData[activeScheduledDate] }}-->
                      <div
                        v-for="(itemMeal, indexMeal) in childItem.mealData"
                      >
                        <div class="flex items-center gap-x-6">
                          <!--                          {{ data[index].data[childIndex].mealData[indexMeal].start_time }}-->
                          <AppTimePicker
                            :editable="true"
                            v-model="itemMeal.start_time"
                            class="max-w-[141px]"
                            value-format="HH:mm"
                            :label="t('common.timeToStart')"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                          />
                          <AppTimePicker
                            v-model="itemMeal.end_time"
                            class="max-w-[141px]"
                            value-format="HH:mm"
                            :label="t('common.endToTime')"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                          />

                          <AppInput
                            v-model="itemMeal.amount"
                            type="number"
                            class="max-w-[141px]"
                            :label="t('kitchen.servingQuantity')"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                          />
                        </div>

                        <AppSelect
                          v-model="itemMeal.product_id"
                          :items="settingsStore.rationList.rations"
                          @change="changeRation(itemMeal.product_id,index,childIndex,indexMeal)"
                          item-value="id"
                          item-label="name"
                          :label="t('kitchen.ration2')"
                          label-class="text-[#A8AAAE]"
                          class="w-[300px]"
                        >
                          <el-option
                            v-for="item in settingsStore.rationList.rations"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          >
                            <div class="flex items-center justify-between w-full">
                              <span>{{ item.name }}</span>
                              <span>{{ item.number }}</span>
                            </div>
                          </el-option>
                        </AppSelect>
                        <div
                          v-if="itemMeal.product_id && itemMeal.rationsList && itemMeal.rationsList.products"
                          class="mt-6"
                        >
                          <ElTable
                            :data="itemMeal.rationsList.products"
                            stripe
                            :empty-text="t('common.empty')"
                            class="custom-element-table meal-plan-create__table"
                          >
                            <ElTableColumn
                              v-for="item in tableColumns"
                              :key="item.prop"
                              :prop="item.prop"
                              :label="item.label"
                              :width="item.width ?? ''"
                              :align="item.align ?? 'left'"
                            />
                            <template #append>
                              <div class="px-4 py-3.5 flex justify-end items-center gap-x-8">
                                <div class="flex items-center gap-x-1 text-sm">
                                  <span class="text-cool-gray">
                                    {{ t("common.price") }}:
                                  </span>
                                  <strong class="font-semibold text-dark">
                                    {{ itemMeal.rationsList?.price.toLocaleString() }} {{ t("currency.sum") }}
                                  </strong>
                                </div>
                                <div class="flex items-center gap-x-1 text-sm">
                                  <span class="text-cool-gray">
                                    {{ t("common.ndc") }}:
                                  </span>
                                  <strong class="font-semibold text-dark">
                                    {{ itemMeal.rationsList?.vat_price.toLocaleString() }} {{ t("currency.sum") }}
                                  </strong>
                                </div>
                                <div class="flex items-center gap-x-1 text-sm">
                                  <span class="text-cool-gray">
                                    {{ t("common.totalSum") }}:
                                  </span>
                                  <strong class="font-semibold text-dark">
                                    {{ itemMeal.rationsList.total_price.toLocaleString() }} {{ t("currency.sum") }}
                                  </strong>
                                </div>
                              </div>
                            </template>
                          </ElTable>

                        </div>
                      </div>

                      <ElButton
                        @click="addMealItem(index, childIndex)"
                        type="primary"
                        plain
                        class="mt-6 !bg-white !border-blue-500"
                      >
                        <div class="flex items-center gap-x-2">
                          <svg
                            :data-src="PlusIcon"
                            class="size-4 meal-plan-create__plus-icon"
                          />
                          <span class="text-xs font-medium text-blue-500">
                            {{ t("method.addMore") }}
                        </span>
                        </div>
                      </ElButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="kitchenStore.activeSalesPart && list_dishes.length > 0">

              <!--              {{ list_dishes }}-->
              <!--              {{ activeScheduledDate }}-->

              <div v-for="(item, index) in list_dishes">
                <!--              {{ mealTimes[0] }}-->
                <div
                  v-show="item.date === activeScheduledDate"
                  class="mt-3 flex flex-col gap-y-3"
                >
                  <div
                    v-for="(childItem, childIndex) in item.data"
                  >
                    <ElCheckbox
                      v-model="childItem.isChecked"
                      class="app-checkbox"
                      :label="childItem.title"
                    />
                    <div
                      v-show="childItem.isChecked"
                      class="mt-6"
                    >
                      <h3 class="text-2xl font-medium text-dark">
                        {{ t("kitchen.listOfDishes") }}
                      </h3>
                      <!--                    {{ item.mealData[activeScheduledDate] }}-->

                      <div v-for="(item, indexMeal) in childItem.mealData">
                        <div class="flex items-center gap-4 w-full">

                          <AppSelect
                            v-model="item.meal"
                            :disabled="item.product || item.vid_product"
                            :items="settingsStore.meals.meals"
                            clearable
                            filterable
                            class="w-full"
                            item-value="id"
                            item-label="name"
                            :label="t('kitchen.dishes')"
                            :placeholder="t('kitchen.dishesPlaceholder')"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                            @input="changeInputMeals($event, index, childIndex, indexMeal)"
                          >

                            <el-option
                              v-for="item in settingsStore.meals.meals"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            >
                              <div class="flex items-center justify-between w-full">
                                <span>{{ item.name }}</span>
                                <span>{{ item.number }}</span>
                              </div>
                            </el-option>
                          </AppSelect>
                          <app-select
                            v-model="item.product"
                            :disabled="!!item.meal"
                            :label="t('product.type')"
                            class="w-full"
                            label-class="text-[#A8AAAE] font-medium text-[12px]"
                            clearable
                            filterable
                            itemValue="id"
                            itemLabel="name"
                            :items="settingsStore.typeProduct.product_categories"
                            @input="changeInput($event, index, childIndex, indexMeal)"
                            @change="changeChange($event, index, childIndex, indexMeal)"
                          />
                          <app-select
                            v-model="item.vid_product"
                            :disabled="!!item.meal"
                            filterable
                            class="w-full"
                            :label="t('product.view')"
                            label-class="text-[#A8AAAE] font-medium text-[12px]"
                            itemValue="id"
                            itemLabel="name"
                            :items="item.vid_list"
                          />

                          <AppInput
                            v-model="item.amount"
                            class="w-full"
                            :label="t('kitchen.portion')"
                            type="number"
                            label-class="text-[#A8AAAE] text-[12px] font-medium"
                          />
                        </div>
                        <!--                    {{ item }}-->
                        <div
                          v-if="item.meals_list && item.meals_list.compositions"
                          class="mb-[24px]"
                        >
                          <el-table
                            :empty-text="t('common.empty')"
                            :data="item.meals_list.compositions"
                            stripe
                            class="custom-element-table custom-element-table--has-append"
                          >
                            <el-table-column
                              prop="product_type_name"
                              :label="t('kitchen.ingredients')"
                            />
                            <el-table-column
                              prop="quantity"
                              :label="t('common.quantity')"
                            />
                            <el-table-column
                              prop="unit"
                              :label="t('common.measurement')"
                            />
                            <el-table-column
                              prop="price"
                              :label="t('common.price')"
                            />


                            <template #append>
                              <div class="px-4 py-3.5 flex justify-end items-center ">
                                <div class="flex items-center gap-x-8">
                                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      {{ t("common.price") }}:
                    </span>
                                    <strong class="font-semibold text-dark">
                                      {{ item.meals_list.net_price && item.meals_list.net_price.toLocaleString() }}
                                      {{ t("currency.sum") }}
                                    </strong>
                                  </div>
                                  <div class="flex items-center gap-x-1 text-sm">
                                         <span class="text-cool-gray">
                                                          {{ t("common.ndc") }}:
                                         </span>
                                    <strong class="font-semibold text-dark">
                                      {{ item.meals_list.tax && item.meals_list.tax.toLocaleString() }}
                                      {{ t("currency.sum") }}
                                    </strong>
                                  </div>
                                  <div class="flex items-center gap-x-1 text-sm">
                                         <span class="text-cool-gray">
                                           {{ t("common.totalSum") }}:
                                         </span>
                                    <strong class="font-semibold text-dark">
                                      {{ item.meals_list.price && item.meals_list.price.toLocaleString() }}
                                      {{ t("currency.sum") }}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </el-table>
                        </div>
                      </div>
                      <ElButton
                        type="primary"
                        plain
                        class="mt-6 !bg-white !border-blue-500"
                        @click="addMeal(index, childIndex)"
                      >
                        <div class="flex items-center gap-x-2">
                          <svg
                            :data-src="PlusIcon"
                            class="size-4 meal-plan-create__plus-icon"
                          />
                          <span class="text-xs font-medium text-blue-500">
                      {{ t("method.addMore") }}
                     </span>
                        </div>
                      </ElButton>

                    </div>
                  </div>
                </div>
              </div>

              <!--              <div-->
              <!--                v-for="(meal, index) in list_dishes"-->
              <!--                class=""-->
              <!--              >-->
              <!--                &lt;!&ndash;        {{ tableData }}&ndash;&gt;-->
              <!--                <div v-show="meal.date == activeScheduledDate">-->
              <!--                  <div v-for="(item, childIndex) in meal.data">-->
              <!--                    <div class="flex items-center gap-4 w-full">-->

              <!--                      <AppSelect-->
              <!--                        v-model="item.meal"-->
              <!--                        :disabled="item.product || item.vid_product"-->
              <!--                        :items="settingsStore.meals.meals"-->
              <!--                        clearable-->
              <!--                        class="w-full"-->
              <!--                        item-value="id"-->
              <!--                        item-label="name"-->
              <!--                        :label="t('kitchen.dishes')"-->
              <!--                        :placeholder="t('kitchen.dishesPlaceholder')"-->
              <!--                        label-class="text-[#A8AAAE] text-xs font-medium"-->
              <!--                        @input="changeInputMeals($event, index, childIndex)"-->
              <!--                      />-->

              <!--                      <app-select-->
              <!--                        v-model="item.product"-->
              <!--                        :disabled="item.meal"-->
              <!--                        :label="t('product.type')"-->
              <!--                        class="w-full"-->
              <!--                        label-class="text-[#A8AAAE] font-medium text-[12px]"-->
              <!--                        clearable-->
              <!--                        itemValue="id"-->
              <!--                        itemLabel="name"-->
              <!--                        :items="settingsStore.typeProduct.product_categories"-->
              <!--                        @input="changeInput($event, index, childIndex)"-->
              <!--                        @change="changeChange($event, index, childIndex)"-->
              <!--                      />-->
              <!--                      <app-select-->
              <!--                        v-model="item.vid_product"-->
              <!--                        :disabled="item.meal"-->
              <!--                        class="w-full"-->
              <!--                        :label="t('product.view')"-->
              <!--                        label-class="text-[#A8AAAE] font-medium text-[12px]"-->
              <!--                        itemValue="id"-->
              <!--                        itemLabel="name"-->
              <!--                        :items="item.vid_list"-->
              <!--                      />-->

              <!--                      <AppInput-->
              <!--                        v-model="item.amount"-->
              <!--                        class="w-full"-->
              <!--                        :label="t('kitchen.portion')"-->
              <!--                        type="number"-->
              <!--                        label-class="text-[#A8AAAE] text-[12px] font-medium"-->
              <!--                      />-->
              <!--                    </div>-->
              <!--                    &lt;!&ndash;                    {{ item }}&ndash;&gt;-->
              <!--                    <div-->
              <!--                      v-if="item.meals_list && item.meals_list.compositions"-->
              <!--                      class="mb-[24px]"-->
              <!--                    >-->
              <!--                      <el-table-->
              <!--                        :empty-text="t('common.empty')"-->
              <!--                        :data="item.meals_list.compositions"-->
              <!--                        stripe-->
              <!--                        class="custom-element-table custom-element-table&#45;&#45;has-append"-->
              <!--                      >-->
              <!--                        <el-table-column-->
              <!--                          prop="product_type_name"-->
              <!--                          :label="t('kitchen.ingredients')"-->
              <!--                        />-->
              <!--                        <el-table-column-->
              <!--                          prop="quantity"-->
              <!--                          :label="t('common.quantity')"-->
              <!--                        />-->
              <!--                        <el-table-column-->
              <!--                          prop="unit"-->
              <!--                          :label="t('common.measurement')"-->
              <!--                        />-->
              <!--                        <el-table-column-->
              <!--                          prop="price"-->
              <!--                          :label="t('common.price')"-->
              <!--                        />-->


              <!--                        <template #append>-->
              <!--                          <div class="px-4 py-3.5 flex justify-end items-center ">-->
              <!--                            <div class="flex items-center gap-x-8">-->
              <!--                              <div class="flex items-center gap-x-1 text-sm">-->
              <!--                    <span class="text-cool-gray">-->
              <!--                      {{ t("common.price") }}:-->
              <!--                    </span>-->
              <!--                                <strong class="font-semibold text-dark">-->
              <!--                                  {{ item.meals_list.net_price && item.meals_list.net_price.toLocaleString() }}-->
              <!--                                  {{ t("currency.sum") }}-->
              <!--                                </strong>-->
              <!--                              </div>-->
              <!--                              <div class="flex items-center gap-x-1 text-sm">-->
              <!--                    <span class="text-cool-gray">-->
              <!--                                     {{ t("common.ndc") }}:-->
              <!--                    </span>-->
              <!--                                <strong class="font-semibold text-dark">-->
              <!--                                  {{ item.meals_list.tax && item.meals_list.tax.toLocaleString() }}-->
              <!--                                  {{ t("currency.sum") }}-->
              <!--                                </strong>-->
              <!--                              </div>-->
              <!--                              <div class="flex items-center gap-x-1 text-sm">-->
              <!--                    <span class="text-cool-gray">-->
              <!--                      {{ t("common.totalSum") }}:-->
              <!--                    </span>-->
              <!--                                <strong class="font-semibold text-dark">-->
              <!--                                  {{ item.meals_list.price && item.meals_list.price.toLocaleString() }}-->
              <!--                                  {{ t("currency.sum") }}-->
              <!--                                </strong>-->
              <!--                              </div>-->
              <!--                            </div>-->
              <!--                          </div>-->
              <!--                        </template>-->
              <!--                      </el-table>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                  <ElButton-->
              <!--                    type="primary"-->
              <!--                    plain-->
              <!--                    class="mt-6 !bg-white !border-blue-500"-->
              <!--                    @click="addMeal(index)"-->
              <!--                  >-->
              <!--                    <div class="flex items-center gap-x-2">-->
              <!--                      <svg-->
              <!--                        :data-src="PlusIcon"-->
              <!--                        class="size-4 meal-plan-create__plus-icon"-->
              <!--                      />-->
              <!--                      <span class="text-xs font-medium text-blue-500">-->
              <!--                      {{ t("method.addMore") }}-->
              <!--                  </span>-->
              <!--                    </div>-->
              <!--                  </ElButton>-->
              <!--                </div>-->
              <!--              </div>-->

            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 items-center">
          <ElButton
            size="large"
            class="!bg-[#E2E6F3] !border-none !text-dark-gray"
            @click="cancel"
          >
            {{ t("method.cancel") }}
          </ElButton>
          <ElButton
            size="large"
            type="primary"
            class="!bg-blue-500"
            @click="sendData"
          >
            {{ t("common.next") }}
            <!--    send btn text => Применить-->
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.meal-plan-create {

  &__table {
    thead th {
      @apply font-medium text-dark-gray;
    }

    tbody tr:last-child td:first-child, td:last-child {
      border-radius: unset !important;
    }
  }

  &__plus-icon * {
    stroke: var(--blue-500);
  }
}
</style>