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
import { watch } from "vue";

const route = useRoute();
const store = useLayoutStore();

const layouts = {
  MainLayout,
  LoginLayout,
  ErrorLayout,
  ResetPasswordLayout,
  IncomePasswordLayout,
  PasswordLayout,
};

document.getElementById('body').className = store.currentTheme
watch(store, async () => {
  if (store.currentTheme) {
    document.getElementById('body').className = store.currentTheme
  }
})
</script>

<template>
  <component
    :is="layouts[route.meta.layout] || MainLayout"
    class="overflow-y-auto"
  >
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </component>
</template>
