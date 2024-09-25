<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import { onMounted, ref, watch } from "vue";

const layouts = {
  MainLayout: MainLayout,
  LoginLayout: LoginLayout,
};
</script>
<template>
  <component :is="layouts[<string>$route.meta.layout]">
    <RouterView />
  </component>

</template>
