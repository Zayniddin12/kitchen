<script setup lang="ts">
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { ref } from "vue";

const { t } = useI18n();

const consumption = ref<any[]>([{}]);
const result = ref<any[]>([{}]);

const addConsumption = () => {
  consumption.value.push({});
};

const deleteConsumption = (index: number) => {
  consumption.value.splice(index, 1);
};

const addResult = () => {
  result.value.push({});
};

const deleteResult = (index: number) => {
  result.value.splice(index, 1);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="text-[#000D24] font-semibold text-[32px]">Мясной цех</h1>

      <button class="custom-light-btn">Мясной цех</button>
    </div>

    <!----------------------Расход-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Расход</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item, index) in consumption" :key="index">
        <app-select
          :label="t('product.type')"
          label-class="text-[#A8AAAE] text-[12px]"
          itemValue="id"
          itemLabel="name"
          :items="[]"
        />

        <app-select
          :label="t('vidProduct.title')"
          label-class="text-[#A8AAAE] text-[12px]"
          itemValue="id"
          itemLabel="name"
          :items="[]"
        />

        <app-input
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          :label="t('common.measurement')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          :label="t('common.price')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <div class="flex items-center gap-4">
          <app-input
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button
            v-if="consumption && consumption.length !== 1"
            class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2"
            @click="deleteConsumption(index)"
          >
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

      <button class="primary__btn" @click="addConsumption">
        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />
        Добавить еще
      </button>
    </div>

    <div class="border border-[#F1F1F1] w-full my-[24px]" />

    <!--------------------Результат-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Результат</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item2, index2) in result" :key="index2">
        <app-select
          :label="t('product.type')"
          label-class="text-[#A8AAAE] text-[12px]"
          itemValue="id"
          itemLabel="name"
          :items="[]"
        />

        <app-select
          :label="t('vidProduct.title')"
          label-class="text-[#A8AAAE] text-[12px]"
          itemValue="id"
          itemLabel="name"
          :items="[]"
        />

        <app-input
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          :label="t('common.measurement')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          :label="t('common.price')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <div class="flex items-center gap-4">
          <app-input
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2" @click="deleteResult(index)"
                  v-if="result && result.length !== 1">
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

      <button class="primary__btn" @click="addResult">
        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />
        Добавить еще
      </button>
    </div>


    <div class="border border-[#F1F1F1] w-full my-[24px]" />

    <div class="flex items-center gap-4 justify-end">
      <button class="custom-light-btn">Отменить</button>
      <button class="custom-apply-btn">Добавить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.primary__btn {
  @apply bg-[white] border border-[#2E90FA] rounded-[8px] text-[#2E90FA] text-[12px] font-medium flex items-center justify-center px-[16px] py-[8px] mt-[20px]
}
</style>