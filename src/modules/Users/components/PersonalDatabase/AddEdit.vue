<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute()

const tabs = ref<Tabs[]>([
  {
    title: "Данные кандидата",
    value: 0,
  },
  {
    title: "Фотография для Face ID",
    value: 1,
  },
]);
const activeTab = ref<number>(0);

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">
      {{route.name === 'personal-database-create-form' ? 'Добавить' : 'Редактировать'}}
    </h1>

    <div class="app-tabs w-[345px] my-[24px]">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="cursor-pointer"
        :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
        @click="setActiveTab(item)"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="border rounded-[24px] py-[32px] px-[24px]">
      <template v-if="activeTab === 0">
        <div class="py-8 px-4 flex items-center gap-4">
          <div class="rounded-full overflow-hidden border-4 border-gray-100">
            <img src="../../../../assets/images/avatar.png" alt="Profile Picture"
                 class="object-cover h-[160px] w-[160px] rounded-full">
          </div>

          <div class="text-xl font-semibold text-gray-900">
            Хамидов Иброхим Илхомович
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Фамилия</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Имя</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Отчество</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Дата рождения</label>
            <app-date-picker placeholder="" />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Национальность</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Пол</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Серия и номер паспорта</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Кем выдан</label>
            <app-input />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Дата выпуска</label>
            <app-date-picker placeholder="" />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Срок действия</label>
            <app-date-picker placeholder="" />
          </div>

          <div>
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">ПИНФЛ</label>
            <app-input />
          </div>

          <div />

          <div class="mt-[40px]">
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">OneID (необязательно)</label>
            <app-input />
          </div>

          <div class="mt-[40px]">
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Должность в системе
              (необязательно)</label>
            <app-select placeholder="" />
          </div>

          <div class="mt-[40px]">
            <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Роли (необязательно)</label>
            <app-select placeholder="" />
          </div>
        </div>
      </template>

      <template v-else>
        <input type="file" id="inputFile" class="hidden">
        <label for="inputFile" class="cursor-pointer bg-[#F8F9FC] rounded-[16px] border-dashed border border-gray-300 flex flex-col items-center justify-center p-10 h-[60vh]">
          <img src="../../../../assets/images/icons/upload.svg" alt="upload"/>

          <p class="text-gray-700 text-sm mt-[24px]">Перетащите фотографию для загрузки</p>
          <p class="text-gray-400 text-xs mb-[24px]">Максимальный размер фотографии 10 МБ</p>

          <div class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Выбрать фото
          </div>
        </label>
      </template>
    </div>

    <div class="flex items-center justify-end mt-[24px]">
      <button class="custom-cancel-btn" @click="router.push('/personal-database')">Отменить</button>
      <button class="custom-apply-btn ml-[8px]">Добавить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>