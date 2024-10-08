<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import ResetPasswordLayout from "./views/ResetPassword.vue";
import IncomePasswordLayout from "./views/IncomePassword.vue";
import PasswordLayout from "./views/Password.vue";

const layouts = {
  MainLayout: MainLayout,
  LoginLayout: LoginLayout,
  ErrorLayout: ErrorLayout,
  ResetPasswordLayout: ResetPasswordLayout,
  IncomePasswordLayout: IncomePasswordLayout,
  PasswordLayout: PasswordLayout,
};
</script>

<template>
  <component :is="layouts[$route.meta.layout] || MainLayout">
    <transition name="fade">
      <RouterView />
    </transition>
  </component>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>