<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

const router = useRouter();

const formRepeater = ref([{}]);

const repeaterAgain = () => {
  formRepeater.value.push({});
};

const deleteForm = (index: number) => {
  if (formRepeater.value.length > 1) {
    formRepeater.value.splice(index, 1);
  }
};
</script>

<template>
  <h1 class="m-0 font-semibold text-[32px]">Добавить</h1>

  <div class="border rounded-[24px] p-[24px] my-[24px]">
    <div class="grid grid-cols-2 gap-6">
      <div>
        <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">№ контракта</label>
        <app-input />
      </div>

      <div>
        <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Поставщик</label>
        <app-select placeholder="" />
      </div>
    </div>

    <div class="bg-[#F8F9FC] p-[16px] rounded-[16px]">
      <div class="grid grid-cols-6 gap-5 border-b mb-[16px]" v-for="(item, index) in formRepeater" :key="index">
        <div>
          <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Тип продукта</label>
          <app-select placeholder="Выберите" />
        </div>

        <div>
          <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Вид продукта</label>
          <app-select placeholder="Выберите" />
        </div>

        <div>
          <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Количество</label>
          <app-input placeholder="0" />
        </div>

        <div>
          <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Ед. измерения</label>
          <app-input placeholder="0" />
        </div>

        <div>
          <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Цена</label>
          <app-input placeholder="0" />
        </div>

        <div class="flex items-center">
          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Сумма</label>
            <app-input placeholder="0" />
          </div>

          <button
            class="bg-[#E2E6F3] rounded-[8px] p-[10px] ml-4"
            @click="deleteForm(index)"
          >
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>
    </div>

    <button
      class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[12px]"
      @click="repeaterAgain"
    >
      <img src="@/assets/images/icons/plus2.svg" class="mr-[4px]" alt="plus"/>
      Добавить еще
    </button>
  </div>

  <div class="flex items-center justify-end">
    <button class="custom-cancel-btn" @click="router.push('/contracts')">Отменить</button>
    <button class="custom-apply-btn ml-[8px]">Добавить</button>
  </div>
</template>

