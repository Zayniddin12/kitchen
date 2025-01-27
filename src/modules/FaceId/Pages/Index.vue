<script setup lang="ts">
import { ref, watch } from "vue";
import { useFaceStore } from "@/modules/FaceId/store";
import { useI18n } from "vue-i18n";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const model = defineModel();
const store = useFaceStore();
const { t } = useI18n();
const { confirm } = useConfirm();

const count = ref<string | number>("00:00");
let timer: ReturnType<typeof setInterval> | null = null;

const closeModal = () => {
  model.value = false;
};

const confirmUser = () => {
  confirm.confirm().then(async response => {
    let order_id: number | string = store.faceId.order_id;
    await store.CONFIRM_USER(order_id);
    model.value = false;
  });
};

watch(() => model.value, async (newValue) => {
  if (newValue) {
    let count1 = 60;

    timer = setInterval(() => {
      const minutes = Math.floor(count1 / 60);
      const seconds = count1 % 60;
      count.value = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      count1--;

      if (count1 < 0) {
        clearInterval(timer as number);
      }
    }, 1000);
  } else {
    if (timer) {
      clearInterval(timer);
    }
  }
}, { immediate: true });

watch(() => count.value, (val) => {
  if (val === "00:00") {
    closeModal();
  }
});
</script>

<template>
  <el-dialog
    style="background: #FFFFFF"
    v-model="model"
    :show-close="false"
    class="lg:w-[80%] md:w-[80%] w-[99%]"
    align-center
    append-to-body
    :before-close="closeModal"
  >
    <template #header>
      <div class="flex justify-end">
        <button class="p-[16px] bg-[#F8F9FC] rounded-[16px]" @click="closeModal">
          <img src="@/assets/redClose.svg" alt="#" />
        </button>
      </div>
    </template>

    <div class="flex items-stretch ml-[30px]">
      <img
        src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        class="h-[700px] object-cover w-[50%] rounded-[24px]"
        alt="#"
      />

      <div class="w-[50%] flex flex-col">
        <div class="bg-[#F8F9FC] py-[32px] px-[48px] rounded-[24px] w-[90%] ml-[30px]">
          <h1 class="font-bold text-[45px] text-[#000D24]">{{ store.faceId?.user_name }}</h1>

          <ul class="mt-[54px]">
            <li class="text-[24px] text-[#8F9194]">{{ t("common.workPlace") }}:</li>
            <li class="text-[#000D24] text-[32px] mb-[35px]">{{ store.faceId?.work_place_name }}</li>

            <li class="text-[24px] text-[#8F9194]">{{ t("kitchen.ration2") }}:</li>
            <li class="text-[#000D24] text-[32px] mb-[35px]">{{ store.faceId?.ration }}</li>

            <li class="text-[24px] text-[#8F9194]">{{ t("common.workingHours") }}:</li>
            <li class="text-[#000D24] text-[32px]">{{ store.faceId?.work_hours }} {{ t("time.hour") }}.</li>
          </ul>
        </div>
        <div class="px-[48px] mt-auto flex items-center justify-between">
          <p class="mb-0 text-[#000D24] text-[24px]">{{ count }}</p>
          <button
            class="custom-apply-btn"
            @click="confirmUser"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>

    <!--    <div class="bg-[#F8F9FC] py-[14px] px-[32px] w-[170px] mt-[10px] ml-auto rounded-[16px] mr-[45px] text-center">-->

    <!--    </div>-->
  </el-dialog>
</template>

