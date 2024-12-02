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
  intermediateDate1: null,
  intermediateDate2: null,

});
const startDate = ref<Date | "">("");
const intermediateDate1 = ref(true);
const intermediateDate2 = ref(false);
const activeScheduledDate = ref("");

const data = ref([]);

// Meal Times
const mealTimes = ref([
  {
    id: 1,
    title: "Завтрак",
    isChecked: false,
    mealData: {},
  },
  {
    id: 2, title: "Обед", isChecked: false, mealData: {},
  },
  {
    id: 3, title: "Ужин", isChecked: false, mealData: {},
  },
  {
    id: 4, title: "Сухой питания", isChecked: false, mealData: {},
  },
]);

const mealTimesV$ = ref<ValidationType | null>(null);
const kitchenDatav$ = ref<ValidationType | null>(null);

// Diets
const activeDiet = ref<number | undefined>();
const diets = reactive([{ id: 1, name: "Рацион1 R-0000" }]);

// Table Columns
const tableColumns: TableColumnType[] = [
  { label: "Название", prop: "name" },
  { label: "Количество", prop: "quantity", align: "center" },
  { label: "Ед. измерения", prop: "unit", align: "center" },
  { label: "Цена", prop: "net_price", align: "right" },
  { label: "Сумма", prop: "total_price", align: "right" },
];

const tableColumns2: TableColumnType[] = [
  { prop: "ingredients", label: "Ингредиенты" },
  { prop: "quantity", label: "Количество", align: "center" },
  { prop: "unit_measurement", label: "Ед. измерения", align: "center" },
  { prop: "sum", label: "Сумма", align: "center" },
];

// Table Data
const tableData = Array(4).fill({
  name: "Кабачки",
  quantity: 0.8,
  unit_measurement: "кг",
  price: "1 800 сум",
  sum: "15 000 сум",
});


const tableData2 = Array(4).fill({
  ingredients: "Лук",
  quantity: 30,
  unit_measurement: "кг",
  sum: "15 000 сум",
});

// Computed
const scheduledDates = computed(() => {
  if (!kitchenData.value.startDate || !(kitchenData.value.intermediateDate1 || kitchenData.value.intermediateDate2)) return [];
  const intermediate = kitchenData.value.intermediateDate1 ? 7 : 10;
  const formattedDates = [];
  for (let i = 0; i < intermediate; i++) {
    const date = new Date(kitchenData.value.startDate);
    console.log(date);
    date.setDate(date.getDate() + i);
    console.log(date);
    const formattedDate = formatDate(date);
    formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
  }
  return formattedDates;
});

// Watch
watch(scheduledDates, (newValue) => {
  if (newValue.length > 0) {
    data.value = [];

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

    activeScheduledDate.value = newValue[0].date;
    console.log(scheduledDates.value);
    mealTimes.value.forEach((item, index) => {
      scheduledDates.value.forEach((date, dateIndex) => {
        item.mealData[date.date] = [
          {
            period: index + 1,
            start_time: null,
            end_time: null,
            amount: null,
            product_type: "ration",
            product_id: null,
            rationsList: [],
          },
        ];
      });
    });

  } else {
    activeScheduledDate.value = "";
  }
});

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
      to: { name: "KitchenMenuIndex" },
    },
    {
      label: route.meta.breadcrumbItemTitle ?? "",
      isActionable: true,
    },
  ]);
};

onMounted(async () => {
  console.log(route.name);
  await settingsStore.GET_RATION_LIST({ per_page: 100 });
  if (route.name === "KitchenMenuEdit") {
    activeDiet.value = 1;
    kitchenData.value.startDate = new Date();
    kitchenData.value.intermediateDate1 = true;
    mealTimes.value = mealTimes.value.map(el => {
      el.isChecked = true;
      return el;
    });
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

  const kitchenResponse = await kitchenStore.CREATE_KITCHEN(kitchenPayload);

  const kitchenResponseElement = await kitchenStore.CREATE_KITCHEN_ELEMENT({
    id: kitchenResponse.data.menu_id,
    payload: { Elements: kitchenElementPayload },
  });

  await router.push(`/kitchen/${route.params.department_id}/free-kitchen/${route.params.kitchen_id}/${route.params.child_id}/menu`);

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
            <h3 class="text-lg font-medium text-dark">
              Введите дату!
            </h3>
            <template v-if="route.name === 'KitchenMenuCreate'">
              <AppForm :value="kitchenData" @validation="value => kitchenDatav$ = value">
                <AppDatePicker
                  v-model="kitchenData.startDate"
                  prop="startDate"
                  placeholder="дд.мм.гггг"
                  class="w-[141px] mt-3"
                  icon-position="start"
                  required
                />
                <ElSwitch
                  v-model="kitchenData.intermediateDate1"
                  active-text="7 дней"
                  class="app-switch"
                  @change="kitchenData.intermediateDate2 = false"
                />
                <br class="mt-3">
                <ElSwitch
                  v-model="kitchenData.intermediateDate2"
                  active-text="10 дней"
                  class="app-switch"
                  @change="kitchenData.intermediateDate1 = false"
                />

              </AppForm>
            </template>
          </div>
          <ElScrollbar
            v-if="scheduledDates.length>0"
            class="mt-8"
          >
            <div
              class="flex flex-wrap items-center"
            >
              {{ scheduledDates }}
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
            {{ data[0] }}
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
            <div v-else-if="kitchenStore.activeSalesPart">
              <h3 class="text-2xl font-medium text-dark">
                Список блюды
              </h3>
              <div class="max-w-[457px] grid grid-cols-2 gap-x-3">
                <AppSelect
                  label="Блюда"
                  label-class="text-[#A8AAAE]"
                />
                <AppInput
                  label="Порция"
                  label-class="text-[#A8AAAE]"
                />
              </div>
              <ElTable
                :data="tableData2"
                stripe
                class="custom-element-table meal-plan-create__table"
              >
                <ElTableColumn
                  v-for="item in tableColumns2"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
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
                        28 000 сум
                      </strong>
                    </div>
                  </div>
                </template>
              </ElTable>
              <ElButton
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