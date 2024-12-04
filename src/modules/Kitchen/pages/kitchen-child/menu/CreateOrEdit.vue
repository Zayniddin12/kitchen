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

const data = ref([]);

// List dishes

const list_dishes = ref([]);

// Meal Times
// const mealTimes = ref([
//   {
//     id: 1,
//     title: "Завтрак",
//     isChecked: false,
//     mealData: {},
//   },
//   {
//     id: 2, title: "Обед", isChecked: false, mealData: {},
//   },
//   {
//     id: 3, title: "Ужин", isChecked: false, mealData: {},
//   },
//   {
//     id: 4, title: "Сухой питания", isChecked: false, mealData: {},
//   },
// ]);

const mealTimesV$ = ref<ValidationType | null>(null);
const kitchenDatav$ = ref<ValidationType | null>(null);

// Table Columns
const tableColumns: TableColumnType[] = [
  { label: "Название", prop: "name" },
  { label: "Количество", prop: "quantity", align: "center" },
  { label: "Ед. измерения", prop: "unit", align: "center" },
  { label: "Цена", prop: "net_price", align: "right" },
  { label: "Сумма", prop: "total_price", align: "right" },
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
      const date = new Date(kitchenData.value.startDate);
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
      const date = new Date(kitchenData.value.startDate);
      date.setDate(date.getDate() + i);
      const formattedDate = formatDate(date);
      formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
    }
    return formattedDates;
  } else return [];
});

// Watch
watch(scheduledDates, async (newValue) => {
  if (newValue.length > 0) {
    await kitchenStore.GET_ELEMENT_LIST(route.params.child_id as string);
    if (kitchenStore.activeMenuPart) {
      data.value = [];

      if (route.name === "KitchenMenuEdit") {

        newValue.forEach(el => {
          data.value.push({
            date: el.date,
            data: [
              {
                id: 1,
                title: "Завтрак",
                isChecked: true,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["1"].map(item => {
                  return {
                    id: item.id,
                    period: 1,
                    start_time: item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price,
                      products: item.product,
                    },
                  };
                }),
              },
              {
                id: 2,
                title: "Обед",
                isChecked: true,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["2"].map(item => {
                  return {
                    id: item.id,
                    period: 2,
                    start_time: item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      products: item.product,
                    },
                  };
                }),
              },
              {
                id: 3,
                title: "Ужин",
                isChecked: true,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["3"].map(item => {
                  return {
                    id: item.id,
                    period: 3,
                    start_time: item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      products: item.product,
                    },
                  };
                }),
              },
              {
                id: 4,
                title: "Сухой питания",
                isChecked: true,
                mealData: kitchenStore.menuElement.elements[el.date.split(".").reverse().join("-")]["4"].map(item => {
                  return {
                    id: item.id,
                    period: 4,
                    start_time: item.start_time.split(":").slice(0, 2).join(":"),
                    end_time: item.end_time.split(":").slice(0, 2).join(":"),
                    amount: item.amount,
                    product_type: "ration",
                    product_id: item.product_id,
                    rationsList: {
                      total_price: item.price_total,
                      products: item.product,
                    },
                  };
                }),
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
                title: "Завтрак",
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
                id: 2, title: "Обед", isChecked: false, mealData: [
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
                id: 3, title: "Ужин", isChecked: false, mealData: [
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
                id: 4, title: "Сухой питания", isChecked: false, mealData: [
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

      if (route.name === "KitchenMenuEdit") {

        newValue.forEach(item => {
          list_dishes.value.push({
            date: item.date,
            data: [
              {
                product: null,
                vid_product: null,
                meal: null,
                amount: null,
                vid_list: [],
                meals_list: [],
              },
            ],
          });
        });
      } else {
        newValue.forEach(item => {
          list_dishes.value.push({
            date: item.date,
            data: [
              {
                product: null,
                vid_product: null,
                meal: null,
                amount: null,
                vid_list: [],
                meals_list: [],
              },
            ],
          });
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
      to: { name: "KitchenMenuIndex" },
    },
    {
      label: route.meta.breadcrumbItemTitle ?? "",
      isActionable: true,
    },
  ]);
};

onMounted(async () => {

  await settingsStore.GET_RATION_LIST({ per_page: 100 });
  await settingsStore.GET_MEALS({ per_page: 100 });
  await settingsStore.GET_TYPE_PRODUCT({ per_page: 100 });


  if (route.name === "KitchenMenuEdit") {
    await kitchenStore.GET_MENU_ITEM(route.params.child_id as string);
    if (kitchenStore.activeMenuPart) {
      kitchenData.value.startDate = kitchenStore.menuItem.menu.start_date.split(".").reverse().join("-");
      kitchenData.value.intermediateDate1 = kitchenStore.menuItem.menu.duration == 7;

    }
    if (kitchenStore.activeSalesPart) {
      kitchenData.value.startDate = kitchenStore.menuItem.menu.start_date.split(".").reverse().join("-");
      kitchenData.value.endDate = kitchenStore.menuItem.menu.end_date.split(".").reverse().join("-");
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
  console.log(index);
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

const changeRation = async (val, parentIndex, childIndex, indexMeal) => {
  console.log(val, parentIndex, childIndex);
  if (val) {
    const responseData = await kitchenStore.GET_RATION_LIST_IN_MENU(val);
    // console.log(data);
    data.value[parentIndex].data[childIndex].mealData[indexMeal].rationsList = responseData && responseData;
  }
};

const commonStore = useCommonStore();

const sendData = async () => {
  if (kitchenStore.activeMenuPart) {
    if (!mealTimesV$.value || !kitchenDatav$.value) return;

    if (!(await mealTimesV$.value.validate() || !(await kitchenDatav$.value.validate()))) {
      await commonStore.errorToast("Validation Error");
      return;
    }

    let kitchenPayload = {
      kitchen_id: Number(route.params.child_id),
      start_date: kitchenData.value.startDate,
      end_date: "",
      type: 0,
      duration: kitchenData.value.intermediateDate1 ? 7 : 10,
    };


    let kitchenElementPayload = data.value.flatMap((entry) =>
      entry.data.flatMap((meal) =>
        meal.mealData.map((mealDetail) => ({
          date: entry.date,
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
      await commonStore.errorToast("Validation Error");
      return;
    }


    let kitchenPayload = {
      kitchen_id: Number(route.params.child_id),
      start_date: kitchenData.value.startDate,
      end_date: kitchenData.value.endDate,
    };


    let kitchenElementPayload = list_dishes.value.map((entry) => {
      return entry.data.map(meal => {
        return {
          date: entry.date,
          [meal.meal ? "meal_id" : "product_id"]: meal.meal ? meal.meal : meal.vid_product,
          amount: Number(meal.amount),
          product_type: meal.meal ? "meal" : "product",
        };
      });
    }).flat();

    console.log(kitchenElementPayload);

    kitchenElementPayload.forEach(item => {
      item.amount = Number(item.amount);
      delete item.rationsList;
    });

    const kitchenResponse = await kitchenStore.CREATE_KITCHEN(kitchenPayload);

    const kitchenResponseElement = await kitchenStore.CREATE_KITCHEN_ELEMENT({
      id: kitchenResponse.data.menu_id,
      payload: { Elements: kitchenElementPayload },
    });
  }

  await router.push(`/kitchen/${route.params.department_id}/free-kitchen/${route.params.kitchen_id}/${route.params.child_id}/menu`);

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


const changeInput = async (event: any, index: number, childIndex: number) => {
  const data = await settingsStore.GET_MEALS_VID_PRO({ parent_id: event });

  list_dishes.value[index].data[childIndex].vid_list = data.product_types ? data.product_types : [];
};

const addMeal = (parentIndex: number) => {
  list_dishes.value[parentIndex].data.push(
    {
      product: null,
      vid_product: null,
      meal: null,
      amount: null,
      vid_list: [],
      meals_list: [],
    },
  );
};
</script>


<template>
  <section class="meal-plan-create">
    <div>
      <h1
        v-if="route.meta.title"
        class="font-semibold text-[32px] text-dark"
      >
        {{ route.meta.title }}
      </h1>
      <div>
        <div class="p-6 rounded-3xl border border-[#E2E6F3] mt-6 min-h-[671px]">
          <div>
            <!--            {{ data }}-->
            <!--            {{ kitchenStore.menuElement }}-->
            <h3 class="text-lg font-medium text-dark">
              Введите дату!
            </h3>
            {{ kitchenStore.menuItem }}
            <div>
              <AppForm :value="kitchenData" @validation="value => kitchenDatav$ = value">
                <div class="flex items-center gap-4">
                  <AppDatePicker
                    v-model="kitchenData.startDate"
                    prop="startDate"
                    placeholder="дд.мм.гггг"
                    format="DD.MM.YYYY"
                    class="w-[141px] mt-3"
                    icon-position="start"
                    required
                  />

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
                  active-text="7 дней"
                  inactive-text="10 дней"
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
            <AppForm :value="data" @validation="(value) => mealTimesV$ = value"
                     v-if="kitchenStore.activeMenuPart && activeScheduledDate && data.length>0">
              <h3 class="text-lg font-medium text-dark">
                Выбирайте время еды!
              </h3>
              <div v-for="(item, index) in data">
                <!--              {{ mealTimes[0] }}-->
                <div v-show="item.date === activeScheduledDate" class="mt-3 flex flex-col gap-y-3">
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
                        v-for="(itemMeal, indexMeal) in childItem.mealData">
                        <div class="flex items-center gap-x-6">
                          <!--                          {{ data[index].data[childIndex].mealData[indexMeal].start_time }}-->
                          <AppTimePicker
                            :editable="true"
                            v-model="itemMeal.start_time"
                            :prop="`[${index}].data[${childIndex}].mealData[${indexMeal}].start_time`"
                            class="max-w-[141px]"
                            value-format="HH:mm"
                            label="Время начало"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                            required
                          />
                          <AppTimePicker
                            v-model="itemMeal.end_time"
                            :prop="`[${index}].data[${childIndex}].mealData[${indexMeal}].end_time`"
                            class="max-w-[141px]"
                            value-format="HH:mm"
                            label="Время окончания"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                            required
                          />

                          <AppInput
                            v-model="itemMeal.amount"
                            :prop="`[${index}].data[${childIndex}].mealData[${indexMeal}].amount`"
                            type="number"
                            class="max-w-[141px]"
                            label="Количество порции"
                            label-class="text-[#A8AAAE] text-xs font-medium"
                            required
                          />
                        </div>

                        <AppSelect
                          v-model="itemMeal.product_id"
                          :prop="`[${index}].data[${childIndex}].mealData[${indexMeal}].product_id`"
                          :items="settingsStore.rationList.rations"
                          @change="changeRation(itemMeal.product_id,index,childIndex,indexMeal)"
                          item-value="id"
                          item-label="name"
                          label="Рацион"
                          label-class="text-[#A8AAAE]"
                          placeholder="Выберите"
                          class="w-[222px]"
                          required
                        />
                        <div
                          v-if="itemMeal.product_id && itemMeal.rationsList && itemMeal.rationsList.products"
                          class="mt-6"
                        >
                          <ElTable
                            :data="itemMeal.rationsList.products"
                            stripe
                            :empty-text="'Нет доступных данных'"
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
                                                    Цена:
                                                  </span>
                                  <strong class="font-semibold text-dark">
                                    25 000 сум
                                  </strong>
                                </div>
                                <div class="flex items-center gap-x-1 text-sm">
                                                  <span class="text-cool-gray">
                                                    НДС:
                                                  </span>
                                  <strong class="font-semibold text-dark">
                                    3 000 сум
                                  </strong>
                                </div>
                                <div class="flex items-center gap-x-1 text-sm">
                                                  <span class="text-cool-gray">
                                                    Общая сумма:
                                                  </span>
                                  <strong class="font-semibold text-dark">
                                    {{ itemMeal.rationsList.total_price.toLocaleString() }}
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
                          Добавить еще
                        </span>
                        </div>
                      </ElButton>
                    </div>
                  </div>
                </div>
              </div>
            </AppForm>
            <div v-else-if="kitchenStore.activeSalesPart && list_dishes.length > 0">
              <h3 class="text-2xl font-medium text-dark">
                Список блюды
              </h3>
              {{ list_dishes }}
              <div v-for="(meal, index) in list_dishes" class="">
                <!--        {{ tableData }}-->
                <div v-show="meal.date == activeScheduledDate">
                  <div v-for="(item, childIndex) in meal.data">
                    <div class="flex items-center gap-4 w-full">

                      <AppSelect
                        v-model="item.meal"
                        :disabled="item.product || item.vid_product"
                        :items="settingsStore.meals.meals"
                        clearable
                        class="w-full"
                        item-value="id"
                        item-label="name"
                        label="Блюды"
                        label-class="text-[#A8AAAE] text-[12px] font-medium"
                        placeholder="Выберите блюды"
                      />

                      <app-select
                        v-model="item.product"
                        :disabled="item.meal"
                        label="Тип продукта"
                        class="w-full"
                        placeholder="Выберите"
                        label-class="text-[#A8AAAE] font-medium text-[12px]"
                        clearable
                        itemValue="id"
                        itemLabel="name"
                        :items="settingsStore.typeProduct.product_categories"
                        @change="changeInput($event, index, childIndex)"
                      />
                      <app-select
                        v-model="item.vid_product"
                        :disabled="item.meal"
                        class="w-full"
                        label="Вид продукта"
                        placeholder="Выберите"
                        label-class="text-[#A8AAAE] font-medium text-[12px]"
                        itemValue="id"
                        itemLabel="name"
                        :items="item.vid_list"
                      />

                      <AppInput
                        v-model="item.amount"
                        class="w-full"
                        placeholder=""
                        label="Порция"
                        type="number"
                        label-class="text-[#A8AAAE] text-[12px] font-medium"
                      />
                    </div>

                    <div v-if="item.meals_list && item.meals_list.length" class="mb-[24px]">
                      <el-table
                        empty-text="Нет данных"
                        :data="item.meals_list"
                        stripe
                        class="custom-element-table custom-element-table--has-append"
                      >
                        <el-table-column
                          prop="name"
                          label="Ингредиенты"
                        />
                        <el-table-column
                          prop="quantity"
                          label="Количество"
                        />
                        <el-table-column
                          prop="unit"
                          label="Ед. измерения"
                        />
                        <el-table-column
                          prop="net_price"
                          label="Сумма"
                        />


                        <template #append>
                          <div class="px-4 py-3.5 flex justify-end items-center ">
                            <div class="flex items-center gap-x-8">
                              <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      Цена:
                    </span>
                                <strong class="font-semibold text-dark">
                                  25 000 сум
                                </strong>
                              </div>
                              <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      НДС:
                    </span>
                                <strong class="font-semibold text-dark">
                                  3 000 сум
                                </strong>
                              </div>
                              <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      Общая сумма:
                    </span>
                                <strong class="font-semibold text-dark">
                                  {{ tableData?.total_price && tableData?.total_price.toLocaleString() }} сум
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
                    @click="addMeal(index)"
                  >
                    <div class="flex items-center gap-x-2">
                      <svg
                        :data-src="PlusIcon"
                        class="size-4 meal-plan-create__plus-icon"
                      />
                      <span class="text-xs font-medium text-blue-500">
                    Добавить еще
                  </span>
                    </div>
                  </ElButton>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 items-center">
          <ElButton
            size="large"
            class="!bg-[#E2E6F3] !border-none !text-dark-gray"
            @click="cancel"
          >
            Отменить
          </ElButton>
          <ElButton
            size="large"
            type="primary"
            class="!bg-blue-500"
            @click="sendData"
          >
            Далее
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