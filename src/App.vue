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
import { useRoute } from "vue-router";
import { useLayoutStore } from "@/navigation";
import { computed, onMounted, watch } from "vue";

interface RouteMeta {
  layout?: "MainLayout" | "LoginLayout" | "ErrorLayout" | "ResetPasswordLayout" | "IncomePasswordLayout" | "PasswordLayout";
}

const route = useRoute();
const store = useLayoutStore();
const layout = computed(() => (route.meta as RouteMeta).layout);

const layouts = {
  MainLayout,
  LoginLayout,
  ErrorLayout,
  ResetPasswordLayout,
  IncomePasswordLayout,
  PasswordLayout,
};

onMounted(() => {
  const bodyElement = document.getElementById("body");
  if (bodyElement) {
    bodyElement.className = store.currentTheme;
  }
});

watch(store, async () => {
  const bodyElement = document.getElementById("body");
  if (bodyElement && store.currentTheme) {
    bodyElement.className = store.currentTheme;
  }
});
</script>

<template>
  <component
    v-if="layout"
    :is="layouts[layout]"
  >
    <RouterView />
  </component>
</template>
