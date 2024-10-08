<script
  setup
  lang="ts"
>
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import ResetPasswordLayout from './views/ResetPassword.vue'

const layouts = {
  MainLayout: MainLayout,
  LoginLayout: LoginLayout,
  ErrorLayout: ErrorLayout,
  ResetPasswordLayout: ResetPasswordLayout
};
</script>

<template>
  <component :is="layouts[$route.meta.layout] || MainLayout">
    <RouterView />
  </component>
</template>
