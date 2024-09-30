<script setup lang="ts">
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

const emit = defineEmits(["update:editModal"]);
const props = defineProps({
  editModal: {
    type: Boolean,
    default: false,
  },
});

const closeModal = () => {
  emit("update:editModal", false);
};
</script>

<template>
  <el-dialog
    v-model="props.editModal"
    :show-close="false"
    class="w-[70%]"
    align-center
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">Редактировать служебную записку</div>
    </template>

    <div class="flex">
      <div class="border-[#E2E6F3] bg-[#fff] rounded-[15px] w-[60%] mr-0">
        <div class="px-[72px] pb-[150px]">
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img src="@/assets/images/logo.svg" alt="logo">
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">NKMK</b>
              <span class="text-[#CBCCCE]">Jamg‘armasi</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">СЛУЖЕБНАЯ ЗАПИСКА</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">04-04-01/463</span>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662]">Кому:</span>
              <span class="text-[#A8AAAE] ml-2">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
            </h1>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Тема:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">О получении товара</span>
          </div>

          <div class="text-[#4F5662] text-[14px]">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1000 кг перца сладкого свеженарезанного, выделенного у Вас в
            соответствии
            с договором № 3259031.1.1 от 31 июля
            2024 года, проведенным посредством электронных аукционов в августе текущего года, в целях обеспечения
            непрерывного питания продуктами лечебно-профилактического назначения. кормления и медико-санитарных больных
            просим получить до 23 августа доверенность от отдела ДМ «Фонд НКМК» на продукцию.
          </div>

          <div class="mt-[40px] flex items-center justify-between">
            <div class="flex items-baseline mb-[24px] w-[200px]">
              <h1 class=" text-[14px] font-medium">
                <span class="text-[#4F5662]">Отправитель:</span>
                <span class="text-[#A8AAAE] ml-2">Руководитель группы отдела координации общественного питания</span>
              </h1>
            </div>

            <img src="@/assets/images/icons/qr.svg" alt="qr" />

            <h1 class="text-[#A8AAAE] text-[14px] mr-[100px]">Эргашева Л.</h1>
          </div>
        </div>
      </div>

      <div class="w-[40%] ml-[24px] flex flex-col justify-between">
        <div>
          <app-input placeholder="Служебная записка" />

          <app-input placeholder="Дата создания документа" />

          <app-input placeholder="№ документа" />

          <app-input placeholder="Кому" />

          <app-input placeholder="Тема" />

          <app-input placeholder="Отображение сообщения служебки" type="textarea" :rows="5" />

          <app-select placeholder="Отправитель" />
        </div>

        <div class="flex items-start justify-between">
          <button class="custom-cancel-btn" @click="closeModal">Отменить</button>
          <button class="custom-apply-btn">Сохранить как черновик</button>
          <button class="custom-send-btn">Отправить</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
