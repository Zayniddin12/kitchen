<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { togglePageScrolling } from "@/utils/helper";

const emit = defineEmits(["update:editModal"]);
const props = defineProps({
  editModal: {
    type: Boolean,
    default: false,
  },
});

const { confirm } = useConfirm();

const closeModal = () => {
  // Let it come out when the form changes
  confirm.cancel({ disabledBody: true }).then((response) => {
    emit("update:editModal", false);
    togglePageScrolling(true);
  });
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
      <div class="text-center text-[#000000] font-bold text-[18px]">Добавить нового поставщика</div>
    </template>

    <div class="bg-[#F8F9FC] p-[24px] rounded-[24px] border border-[#E2E6F3]">
      <div class="flex items-center gap-6 mb-[24]">
        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Наименование</span>
          </template>
        </app-input>
        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Юр. адрес</span>
          </template>
        </app-input>
      </div>

      <div class="flex items-center gap-6 mb-[24px]">
        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">ИНН</span>
          </template>
        </app-input>

        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Номер лицензии</span>
          </template>
        </app-input>

        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Сертификат</span>
          </template>
        </app-input>
      </div>

      <div class="flex items-center gap-6 mb-[24px]">
        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Срок сертификата</span>
          </template>
        </app-input>

        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Руководитель</span>
          </template>
        </app-input>

        <app-input
          placeholder="Введите"
          class="w-full"
        >

          <template #label>
            <span class="text-[#A8AAAE] text-[12px] font-medium">Контакты</span>
          </template>
        </app-input>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 mt-[24px]">
      <button
        class="custom-cancel-btn"
        @click="closeModal"
      >Отменить
      </button>
      <button class="custom-apply-btn">Добавить</button>
    </div>

  </el-dialog>
</template>
