<script
  setup
  lang="ts"
>
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import ResetPasswordLayout from "@/views/ResetPassword.vue";
import IncomePasswordLayout from "@/views/IncomePassword.vue";
import PasswordLayout from "@/views/Password.vue";

const layouts = {
  MainLayout,
  LoginLayout,
  ErrorLayout,
  ResetPasswordLayout,
  IncomePasswordLayout,
  PasswordLayout,
};
</script>

<template>
  <component
    :is="layouts[$route.meta.layout] || MainLayout"
    class="overflow-y-auto"
  >
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </component>
</template>
