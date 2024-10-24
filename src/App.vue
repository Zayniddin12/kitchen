<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import ResetPasswordLayout from "@/views/ResetPassword.vue";
import IncomePasswordLayout from "@/views/IncomePassword.vue";
import PasswordLayout from "@/views/Password.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import AppConfirm from "@/components/ui/app-confirm/AppConfirm.vue";

interface RouteMeta {
  layout?: "MainLayout" | "LoginLayout" | "ErrorLayout" | "ResetPasswordLayout" | "IncomePasswordLayout" | "PasswordLayout";
}

const route = useRoute();
const layout = computed(() => (route.meta as RouteMeta).layout);

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
  <AppConfirm />
  <component
    v-if="layout"
    :is="layouts[layout]"
  >
    <RouterView />
  </component>
</template>
