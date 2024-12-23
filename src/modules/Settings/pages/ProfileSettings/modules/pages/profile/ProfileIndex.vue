<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useAuthStore } from "@/modules/Auth/auth.store";
import Avatar from "@/assets/images/avatar.png";
import { computed } from "vue";
import { phoneFormatter } from "@/utils/helper";
import { activeLanguage } from "@/localization";

const route = useRoute();

const authStore = useAuthStore();

const userImg = computed(() => authStore.user?.image || Avatar);

type PersonalDataType = {
  title: string;
  value?: string | null;
}[]

const personalData = computed<PersonalDataType>(() => {
  if (!authStore.user) return [];
  return [
    {
      title: "Имя",
      value: authStore.user.firstname,
    },
    {
      title: "Фамилия",
      value: authStore.user.lastname,
    },
    {
      title: "Номер телефона",
      value: authStore.user.phone ? phoneFormatter(authStore.user.phone) : "",
    },
    {
      title: "Должность",
      value: authStore.user.position,
    },
    {
      title: "Место работы",
      value: authStore.user.organization_name,
    },
    {
      title: "Язык интерфейса",
      value: activeLanguage.value.title,
    },
  ];
});

</script>

<template>
  <div
    v-if="authStore.user"
    class="profile"
  >
    <div class="flex items-center gap-x-10 justify-between">
      <h5 class="text-lg text-black-text font-semibold">
        {{ route.meta.childTitle ?? "" }}
      </h5>
      <RouterLink
        :to="{name: 'profile-settings-profile-edit'}"
        class="flex items-center py-2.5 px-5 gap-x-2 border border-[#EEEEEF] rounded-lg text-sm font-medium text-dark-gray"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        <span>
          Редактировать
        </span>
      </RouterLink>
    </div>
    <div class="mt-4 rounded-2xl border border-[#EEEEEF] p-4 flex items-center gap-x-4">
      <img
        :src="userImg"
        :alt="authStore.userFullName ?? 'user img'"
        class="size-20 object-contain"
      />
      <div class="flex flex-col gap-y-1 text-sm text-black-sub">
        <strong class="text-black-text font-medium text-lg">{{ authStore.userFullName ?? "-" }}</strong>
        <div class="flex flex-col gap-y-0.5">
          <span>{{ authStore.user.position ?? "-" }}</span>
          <span>Название организации</span>
        </div>
      </div>
    </div>
    <div class="mt-6 rounded-2xl border border-[#EEEEEF] p-4">
      <h6 class="font-medium text-black-text text-lg">
        Персональная информация
      </h6>
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div
          v-for="item in personalData"
          :key="item.title"
          class="flex flex-col gap-y-1 text-sm font-medium"
        >
          <span class="text-black-sub">
            {{ item.title }}
          </span>
          <span class="text-black-text">
            {{ item.value || "-" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>