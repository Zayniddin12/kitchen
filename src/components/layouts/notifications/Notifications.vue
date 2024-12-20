<script
  setup
  lang="ts"
>
import { useTemplateRef } from "vue";
import CloseIcon from "@/assets/images/icons/close.svg";
import { useI18n } from "vue-i18n";

const {t} = useI18n();

const dropdown = useTemplateRef("dropdown");

const closeDropdown = () => {
  dropdown.value?.handleClose();
};

</script>

<template>
  <ElDropdown
    trigger="click"
    :hide-on-click="false"
    ref="dropdown"
  >
    <el-badge
      value="4"
      class="item cursor-pointer text-xs"
    >
      <img
        src="@/assets/images/icons/bell.svg"
        alt="bell"
      />
    </el-badge>
    <template #dropdown>
      <div class="w-[500px] bg-white rounded-[16px] px-6 border border-[#EEEEEF]">
        <div class="flex justify-between items-center py-3.5 border-b border-[#EEEEEF]">
          <div class="flex items-center gap-x-2">
            <h6 class="text-lg font-medium text-dark">
              {{t("notification.title")}}
            </h6>
            <div class="flex items-center justify-center rounded-full min-h-4 min-w-4 bg-[#EEEEEF]">
            <span class="text-[10px] font-medium leading-[10px] text-[#4F5662]">
              4
            </span>
            </div>
          </div>
          <button @click="closeDropdown">
            <svg
              :data-src="CloseIcon"
              class="size-6"
            />
          </button>
        </div>
        <div class="flex flex-col gap-y-3.5 mt-3.5 pb-[1px]">
          <div
            v-for="n in 5"
            class="pb-4 border-b border-[#EEEEEF] last:border-none flex justify-between gap-x-3"
          >
            <div class="flex flex-col gap-y-2 w-[calc(70%-12px)]">
              <strong class="text-dark font-medium text-sm">
                Существует множество вариантов
              </strong>
              <p class="text-xs text-[#A8AAAE]">
                Существует множество вариантов
              </p>
            </div>
            <div class="flex flex-col gap-y-2 w-[calc(30%-12px)] text-end">
              <span
                v-if="n<4"
                class="size-3 bg-blue rounded-full ml-auto"
              ></span>
              <span class="text-xs text-[#A8AAAE] mt-auto">1 {{t("time.hour")}}. {{t("common.back")}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ElDropdown>
</template>