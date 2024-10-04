<script
    setup
    lang="ts"
>

import { computed, ref } from "vue";
import PlusIcon from "@/assets/images/icons/plus.svg";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { TableColumnType } from "@/types/common.type";

const dateList = computed(() => {
  return [
    {
      value: "06.09.20024",
      title: "Понедельник - 06.09.2024"
    },
    {
      value: "07.09.2024",
      title: "Вторник - 07.09.2024"
    },
    {
      value: "08.09.2024",
      title: "Среда - 08.09.2024"
    },
    {
      value: "09.09.2024",
      title: "Четверг - 09.09.2024"
    },
    {
      value: "10.09.2024",
      title: "Пятница - 10.09.2024"
    },
    {
      value: "11.09.2024",
      title: "Суббота - 11.09.2024"
    },
    {
      value: "12.09.2024",
      title: "Воскресенье - 12.09.2024"
    }
  ];
});

const activeDate = ref(dateList.value[0].value);

const mealTimes = ref([
  {
    id: 1,
    title: "Завтрак",
    isChecked: true
  },
  {
    id: 2,
    title: "Обед",
    isChecked: true
  },
  {
    id: 3,
    title: "Ужин",
    isChecked: true
  },
  {
    id: 4,
    title: "Сухой питания",
    isChecked: true
  }
]);

const tableColumns = computed<TableColumnType[]>(() => {
  return [
    {
      id: 1,
      prop: "name",
      label: "Название"
    },
    {
      id: 2,
      prop: "quantity",
      label: "Количество"
    },
    {
      id: 3,
      prop: "unit_measurement",
      label: "Ед. измерения",
      align: "right"
    }
  ];
});

const tableData = computed(() => {
  return [
    {
      id: 1,
      name: "Кабачки",
      quantity: 0.8,
      unit_measurement: "кг"
    },
    {
      id: 2,
      name: "Кабачки",
      quantity: 0.4,
      unit_measurement: "кг"
    },
    {
      id: 3,
      name: "Кабачки",
      quantity: 0.5,
      unit_measurement: "кг"
    },
    {
      id: 4,
      name: "Кабачки",
      quantity: 0.2,
      unit_measurement: "кг"
    }
  ];
});

</script>

<template>
  <section>
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Редактировать
      </h1>
      <div class="p-6 pb-[29px] rounded-3xl border border-[#E2E6F3] mt-6">
        <h3 class="font-medium text-lg text-dark">
          Введите дату!
        </h3>
        <ElScrollbar class="mt-3">
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
        <h3 class="font-medium text-lg text-dark mt-6">
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
                    label-class="text-[#A8AAAE]"
                />
                <AppTimePicker
                    class="max-w-[141px]"
                    label="Время окончания"
                    label-class="text-[#A8AAAE]"
                />
              </div>
              <div class="flex items-center gap-x-6">
                <AppSelect
                    label="Рацион"
                    placeholder="Выберите"
                    class="w-[222px]"
                    label-class="text-[#A8AAAE]"
                />
                <AppInput
                    label="Количество порции"
                    label-class="text-[#A8AAAE]"
                    class="w-[222px]"
                />
              </div>
              <div class="mt-6">
                <ElTable
                    :data="tableData"
                    class="custom-element-table meal-plan-create__table"
                >
                  <ElTableColumn
                      v-for="item in tableColumns"
                      :key="item.prop"
                      :prop="item.prop"
                      :label="item.label"
                      :align="item.align"
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
      </div>
      <div class="mt-6 flex justify-end items-center">
        <ElButton
            class="!bg-[#E2E6F3] !text-dark-gray border-none"
            size="large"
            type="info"
        >
          Отменить
        </ElButton>
        <ElButton
            class="!bg-blue-500"
            type="primary"
            size="large"
        >
          Применить
        </ElButton>
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