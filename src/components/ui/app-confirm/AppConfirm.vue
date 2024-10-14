<script
  setup
  lang="ts"
>

import useConfirm from "@/components/ui/app-confirm/useConfirm";
import type { ButtonStatusType } from "@/components/ui/app-confirm/app-confirm.type";

const { openConfirmModal, activeConfirm, sendAction } = useConfirm();

const buttonClass = (status?: ButtonStatusType): string[] => {
  const classes = ["rounded-lg py-2.5 px-4 min-w-[100px] min-h-10"];

  if (status === "secondary") classes.push("bg-[#E2E6F3] text-[#4F5662]");
  else if (status === "danger") classes.push("bg-[#EA5455] text-white");
  else classes.push("text-white bg-[#2E90FA]");

  return classes;
};

</script>

<template>
  <ElDialog
    v-model="openConfirmModal"
    width="450"
    align-center
    :show-close="false"
    class="text-center p-7 !rounded-3xl confirm-dialog"
  >
    <template
      #title
      v-if="activeConfirm?.title"
    >
      <h5
        class="text-xl font-bold text-[#0A090B] max-w-[279px] mx-auto"
        v-html="activeConfirm.title"
      />
    </template>
    <p
      v-if="activeConfirm?.description"
      v-html="activeConfirm.description"
      class="text-base font-regular text-[#A8AAAE]"
    />
    <template
      #footer
      v-if="activeConfirm?.buttons?.length"
    >
      <div :class="['mt-6 flex items-center gap-x-4 text-sm font-medium', `${activeConfirm.buttons.length>2 ? 'justify-center' : 'justify-end'}`]">
        <button
          v-for="button in activeConfirm.buttons"
          :key="button.action"
          :class="buttonClass(button.status)"
          @click="sendAction(button.action)"
        >
          {{ button.label }}
        </button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.confirm-dialog {
  --el-dialog-padding-primary: 8px;
}
</style>