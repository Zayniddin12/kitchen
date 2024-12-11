<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";

const route = useRoute();

</script>

<template>
  <div>
    <h5 class="text-lg text-black-text font-semibold">
      {{ route.meta.childTitle ?? "" }}
    </h5>
    <div class="mt-4 rounded-2xl border border-[#EEEEEF] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        type="password"
        label="Старый пароль"
        placeholder="Введите"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
      />
      <br />
      <AppInput
        type="password"
        label="Новый пароль"
        placeholder="Введите"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
      />
      <AppInput
        type="password"
        label="Повторите новый пароль"
        placeholder="Введите"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
      />
    </div>
    <div class="flex items-center justify-end mt-6">
      <ElButton
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
      >
        Отменить
      </ElButton>
      <ElButton
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
      >
        Сохранить
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss">

</style>