<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import CashierLayout from "@/layout/CashierLayout.vue";
import DocsLayout from "@/layout/DocsLayout.vue";
import ResetPasswordLayout from "@/modules/Auth/pages/ResetPassword.vue";
import AppConfirm from "@/components/ui/app-confirm/AppConfirm.vue";

const route = useRoute();
const layout = computed(() => route.meta.layout);

const layouts = {
  MainLayout,
  LoginLayout,
  ErrorLayout,
  CashierLayout,
  DocsLayout,
  ResetPasswordLayout,
};

</script>

<template>
  <AppConfirm />

  <component
    v-if="layout"
    :is="layouts[layout]"
    :key="layout"
  >
    <RouterView />
  </component>
</template>
