<script setup lang="ts">
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const num = ref(1);

const mealData = ref<any>([
  {
    typeProduct: "",
    viewProduct: "",
    total: 0,
    unit: "",
  },
]);

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    doc: "852369",
    theme: "Доставка мяса",
    send: "Зарафшан",
    receive: "Фонд",
  },
  {
    id: 2,
    num: "2",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
  {
    id: 3,
    num: "3",
    date: "21.08.2024",
    doc: "584534",
    theme: "Доставка лука",
    send: "Навои",
    receive: "Фонд",
  },
  {
    id: 4,
    num: "4",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
]);

const addMeal = () => {
  mealData.value.push({
    typeProduct: "",
    viewProduct: "",
    total: 0,
    unit: "",
  });
};


const deleteMeal = (mealIndex) => {
  mealData.value = mealData.value.filter((meal, index) => index !== mealIndex);
};

</script>

<template>
  <div>
    <span class="mb-[24px] text-[32px] text-[#000D24] font-semibold	block"> {{ route.meta.title ? route.meta.title : ""
      }}</span>

    <div class="bg-[#FFFFFF] border border-[#E2E6F3] rounded-[24px] p-[24px]">

      <div class="flex items-center gap-8 w-[70%] mb-[24px]">
        <app-select class="w-full" label="Название блюда" label-class="text-[#A8AAAE] text-[12px] font-medium"
                    placeholder="Плов" />
        <app-input class="w-full" placeholder="8" label="Название блюда"
                   label-class="text-[#A8AAAE] text-[12px] font-medium" />
      </div>

      <div>
        <span class="text-[#000D24] text-[18px] font-medium block mb-[12px]">Состав блюды</span>

        <div class="bg-[#F8F9FC] rounded-[16px] px-[12px] py-[16px]">
          <div v-for="(item,index) in mealData"
               class="flex items-center gap-4 border-b border-[#E2E6F3] pt-[16px] pb-4 last:border-0">
            <div class="w-[60%] flex items-center gap-4">
              <app-select class="w-full" label="Тип продукта" label-class="text-[#A8AAAE] text-[12px] font-medium" />
              <app-select class="w-full" label="Вид продукта" label-class="text-[#A8AAAE] text-[12px] font-medium" />

            </div>

            <div class="w-[35%] flex items-center gap-4">
              <app-input class="w-full" label="Количество" label-class="text-[#A8AAAE] text-[12px] font-medium" />
              <app-input class="w-full" label="Ед. измерения" label-class="text-[#A8AAAE] text-[12px] font-medium" />
            </div>

            <div class="w-[5%] flex justify-end">
              <button
                @click="deleteMeal(index)"
                class="bg-[#E2E6F3] rounded-[8px] p-[10px] ml-4"
              >
                <img src="@/assets/images/icons/delete.svg" alt="del">
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-[12px] flex items-center justify-between">
        <button
          @click="addMeal"
          class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] text-[#2E90FA] text-[14px] font-medium py-[8px] px-[16px]">
          <li
            :style="{
                  maskImage: 'url(/icons/plusIcon.svg)',
                  backgroundColor: '#2E90FA',
                  color: '#2E90FA',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          ></li>
          Добавить еще
        </button>

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
              28 000 сум
            </strong>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-[24px]">
        <button class="custom-apply-btn">Продать</button>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>