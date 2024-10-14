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
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import PlusIcon from "@/assets/images/icons/plus.svg";
import { TableColumnType } from "@/types/common.type";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

// Store
const kitchenStore = useKitchenStore();

// State
const startDate = ref<Date | "">("");
const intermediateDate1 = ref(false);
const intermediateDate2 = ref(false);
const activeScheduledDate = ref("");

// Meal Times
const mealTimes = ref([
  { id: 1, title: "Завтрак", isChecked: false },
  { id: 2, title: "Обед", isChecked: false },
  { id: 3, title: "Ужин", isChecked: false },
  { id: 4, title: "Сухой питания", isChecked: false },
]);

// Diets
const activeDiet = ref<number | undefined>();
const diets = reactive([{ id: 1, name: "Рацион1 R-0000" }]);

// Table Columns
const tableColumns: TableColumnType[] = [
  { label: "Название", prop: "name" },
  { label: "Количество", prop: "quantity", align: "center" },
  { label: "Ед. измерения", prop: "unit_measurement", align: "center" },
  { label: "Цена", prop: "price", align: "right" },
  { label: "Сумма", prop: "sum", align: "right" },
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
  if (!startDate.value || !(intermediateDate1.value || intermediateDate2.value)) return [];
  const intermediate = intermediateDate1.value ? 7 : 10;
  const formattedDates = [];
  for (let i = 0; i < intermediate; i++) {
    const date = new Date(startDate.value);
    date.setDate(date.getDate() + i);
    const formattedDate = formatDate(date);
    formattedDates.push({ date: formattedDate.date, title: `${formattedDate.week} - ${formattedDate.date}` });
  }
  return formattedDates;
});

// Watch
watch(scheduledDates, (newValue) => {
  if (newValue.length > 0) activeScheduledDate.value = newValue[0].date;
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

onMounted(() => {
  if (route.name === "KitchenMenuEdit") {
    activeDiet.value = 1;
    startDate.value = new Date();
    intermediateDate1.value = true;
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
              <AppDatePicker
                v-model="startDate"
                placeholder="дд.мм.гггг"
                format="DD.MM.YYYY"
                class="w-[141px] mt-3"
                icon-position="start"
              />
              <ElSwitch
                v-model="intermediateDate1"
                active-text="7 дней"
                class="app-switch"
                @change="intermediateDate2 = false"
              />
              <br class="mt-3">
              <ElSwitch
                v-model="intermediateDate2"
                active-text="10 дней"
                class="app-switch"
                @change="intermediateDate1 = false"
              />
            </template>
          </div>
          <ElScrollbar
            v-if="scheduledDates.length>0"
            class="mt-8"
          >
            <div
              class="flex flex-wrap items-center"
            >
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
            <template v-if="kitchenStore.activeMenuPart">
              <h3 class="text-lg font-medium text-dark">
                Выбирайте время еды!
              </h3>
              <div class="mt-3 flex flex-col gap-y-3">
                <div
                  v-for="item in mealTimes"
                  :key="item.id"
                >
                  <ElCheckbox
                    v-model="item.isChecked"
                    class="app-checkbox"
                    :label="item.title"
                  />
                  <div
                    v-if="item.isChecked"
                    class="mt-6"
                  >
                    <div class="flex items-center gap-x-6">
                      <AppTimePicker
                        class="max-w-[141px]"
                        label="Время начало"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                      />
                      <AppTimePicker
                        class="max-w-[141px]"
                        label="Время окончания"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                      />
                      <AppInput
                        type="number"
                        class="max-w-[141px]"
                        label="Количество порции"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                      />
                    </div>
                    <AppSelect
                      v-model="activeDiet"
                      :items="diets"
                      item-value="id"
                      item-label="name"
                      label="Рацион"
                      label-class="text-[#A8AAAE]"
                      placeholder="Выберите"
                      class="w-[222px]"
                    />
                    <div
                      v-if="activeDiet"
                      class="mt-6"
                    >
                      <ElTable
                        :data="tableData"
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
              </div>
            </template>
            <template v-else-if="kitchenStore.activeSalesPart">
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
            </template>
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