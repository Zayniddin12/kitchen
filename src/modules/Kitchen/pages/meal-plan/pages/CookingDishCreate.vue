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
          <div class="flex items-center gap-4">
            <div class="w-[60%] flex items-center gap-4">
              <app-select class="w-full" label="Тип продукта" label-class="text-[#A8AAAE] text-[12px] font-medium" />
              <app-select class="w-full" label="Вид продукта" label-class="text-[#A8AAAE] text-[12px] font-medium" />

            </div>

            <div class="w-[30%] flex items-center gap-4">
              <app-input label="Количество" label-class="text-[#A8AAAE] text-[12px] font-medium" />
              <app-input label="Ед. измерения" label-class="text-[#A8AAAE] text-[12px] font-medium" />
            </div>

            <div class="w-[10%] flex justify-center">
              <button
                class="bg-[#E2E6F3] rounded-[8px] p-[10px] ml-4"
              >
                <img src="@/assets/images/icons/delete.svg" alt="del">
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="custom-apply-btn">Продать</button>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>