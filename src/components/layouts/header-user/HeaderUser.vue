<script
  setup
  lang="ts"
>

import { useAuthStore } from "@/modules/Auth/auth.store";
import { computed, ref, useTemplateRef } from "vue";
import { useCommonStore } from "@/stores/common.store";
import AvatarIcon from "@/assets/images/avatar.png";
import ArrowRightIcon from "@/assets/arrow-right.svg";
import ArrowDownIcon from "@/assets/images/arrowDown.svg";
import LanguageIcon from "@/assets/images/icons/language.svg";
import LogoutIcon from "@/assets/images/logout.svg";
import { LanguagesType } from "@/components/layouts/header-user/header-user.types";
import { LOCALES } from "@/localization/localization.type";
import { activeLocale, changeLocale } from "@/localization";
import { setSessionItem } from "@/utils/sessionStorage";

const authStore = useAuthStore();
const commonStore = useCommonStore();

const dropdown = useTemplateRef("dropdown");

const userImg = computed(() => authStore.user?.image ?? AvatarIcon);

const userFullName = computed(() => authStore.userFullName ?? "-");

const userPosition = computed(() => authStore.user?.position || "-");

const dropdownOpen = ref(false);

const closeDropdown = () => {
  dropdown.value?.handleClose();
  dropdownOpen.value = false;
};

const redirectSettingsModule = () => {
  closeDropdown();
  setSessionItem("current-menu", '7')
}

const languages = computed<LanguagesType>(() => {
  return [
    {
      name: "Ру",
      value: LOCALES.RU,
    },
    {
      name: "Ўз",
      value: LOCALES.UZ,
    },
  ];
});

</script>

<template>
  <ElDropdown
    trigger="click"
    :hide-on-click="false"
    ref="dropdown"
    placement="bottom-start"
    @visible-change="(value:boolean) => dropdownOpen = value"
  >
    <div
      class="flex items-center gap-3 min-w-[260px] max-w-[268px]"
    >
      <img
        :src="userImg"
        class="size-10 object-contain rounded-full"
        alt="avatar"
      />
      <div class="flex flex-col">
        <div class="flex justify-between gap-x-3">
          <strong class="text-sm font-medium text-dark dark:text-white">
            {{ userFullName }}
          </strong>
          <svg
            :data-src="ArrowDownIcon"
            :class="['w-3 h-2 mt-1 transition duration-200 ease-in-out', {'rotate-180': dropdownOpen}]"
          />
        </div>
        <span class="text-[#A8AAAE] text-sm">{{ userPosition }}</span>
      </div>
    </div>
    <template #dropdown>
      <div class="w-[300px] bg-white rounded-[16px] px-3 py-4 border border-[#EEEEEF]">
        <img
          :src="userImg"
          alt="avatar"
          class="size-10 object-contain rounded-full mx-auto"
        />
        <div class="mt-2 w-[80%] mx-auto text-center flex flex-col gap-y-1">
          <p class="text-sm font-medium text-dark dark:text-white max-h-[80%] mx-auto">
            {{ userFullName }}
          </p>
          <p class="text-[#A8AAAE] text-sm">
            {{ userPosition }}
          </p>
        </div>
        <div class="flex flex-col gap-y-2 mt-3">
          <RouterLink
            :to="{name: 'reference'}"
            class="px-3 py-2.5 w-full flex justify-between rounded-lg items-center gap-x-4 transition duration-200 ease-in bg-white hover:shadow-[0px_1.5px_4px_-1px_#0A090B12]"
            @click="redirectSettingsModule"
          >
            <span class="flex items-center gap-x-3">
              <svg
                data-src="/sidebar/settings.svg"
                class="size-5"
              />
              <span class="text-sm font-medium text-[#4F5662]">
                Настройки
              </span>
            </span>
            <svg
              :data-src="ArrowRightIcon"
              class="size-3"
            />
          </RouterLink>
          <div class="px-3 py-0.5 w-full flex justify-between rounded-lg items-center gap-x-4 bg-white transition duration-200 ease-in hover:shadow-[0px_1.5px_4px_-1px_#0A090B12]">
            <span class="flex items-center gap-x-3">
              <svg
                :data-src="LanguageIcon"
                class="size-5"
              />
              <span class="text-sm font-medium text-[#4F5662]">
                Язык
              </span>
            </span>
            <div class="inline-flex rounded-lg bg-[#F8F9FC] p-1">
              <button
                v-for="lang in languages"
                :key="lang.value"
                @click="changeLocale(lang.value)"
                :class="['px-2 py-1.5 rounded-[6px] text-xs font-medium', `${lang.value === activeLocale ? 'bg-white shadow-[0_1.5px_4px_-1px_#0A090B12] text-blue' : 'text-black-sub'}`]"
              >
                {{ lang.name }}
              </button>
            </div>
          </div>
          <button
            @click="authStore.logout"
            class="px-3 py-2.5 w-full flex gap-x-3 transition duration-200 ease-in hover:shadow-[0px_1.5px_4px_-1px_#0A090B12]"
          >
            <svg
              :data-src="LogoutIcon"
              class="size-5"
            />
            <span class="text-sm font-medium text-[#EA5455]">
              Выход
            </span>
          </button>
        </div>
      </div>
    </template>
  </ElDropdown>
</template>

<style lang="scss">

</style>