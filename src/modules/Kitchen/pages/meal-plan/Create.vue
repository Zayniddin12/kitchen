<script
  setup
  lang="ts"
>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { computed, ref, watch } from "vue";
import { formatDate } from "@/utils/helper";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";

const startDate = ref<Date | null>(null);

const intermediateDate1 = ref(false);
const intermediateDate2 = ref(false);

interface ScheduledDateType {
  date: string,
  title: string
}

const scheduledDates = computed<ScheduledDateType[]>(() => {
  if (!(startDate.value && (intermediateDate1.value || intermediateDate2.value))) return [];

  const intermediate = intermediateDate1.value ? 7 : 10;

  const data: ScheduledDateType[] = [];

  for (let i = 0; i < intermediate; i++) {
    const date = startDate.value;
    date.setDate(date.getDate() + i);

    const formatedDate = formatDate(date);

    data.push({
      date: formatedDate,
      title: formatedDate,
    });
  }

  return data;
});

const activeScheduledDate = ref("");

watch(scheduledDates, (newValue) => {
  if (newValue.length > 0) {
    activeScheduledDate.value = newValue[0].date;
  }
}, { deep: true });

const mealTimes = ref([
  {
    id: 1,
    title: "Завтрак",
    isChecked: false,
  },
  {
    id: 2,
    title: "Обед",
    isChecked: false,
  },
  {
    id: 3,
    title: "Ужин",
    isChecked: false,
  },
  {
    id: 4,
    title: "Сухой питания",
    isChecked: false,
  },
]);

const time = ref("")

</script>

<template>
  <section>
    <div>
      <h1 class="font-semibold text-[32px] text-dark">
        Добавить меню
      </h1>
      <div class="w-[792px]">
        <div class="p-6 rounded-3xl border border-[#E2E6F3] mt-6 min-h-[671px]">
          <div>
            <h3 class="text-lg font-medium text-dark">
              Введите дату!
            </h3>
            <AppDatePicker
              v-model="startDate"
              placeholder="дд.мм.гггг"
              format="DD.MM.YYYY"
              class="w-[141px] mt-3"
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
          </div>
          <div
            v-if="scheduledDates.length>0"
            class="flex flex-wrap items-center gap-6 text-sm mt-8 font-medium text-[#A8AAAE]"
          >
            <button
              v-for="item in scheduledDates"
              :key="item.date"
              :class="[{'text-blue-500': item.date === activeScheduledDate}]"
              @click="activeScheduledDate = item.date"
            >
              {{ item.title }}
            </button>
          </div>
          <div class="mt-6">
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
                    <AppTimePicker v-model="time" label="Время начало" />
                    <AppTimePicker label="Время окончания" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6 items-center">
          <ElButton
            size="large"
            class="!bg-[#E2E6F3] !border-none !text-dark-gray"
          >
            Отменить
          </ElButton>
          <ElButton
            size="large"
            type="primary"
            class="!bg-blue-500"
          >
            Далее
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">

</style>