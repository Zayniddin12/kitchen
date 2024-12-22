<script setup lang="ts">
import { useFaceStore } from "@/modules/FaceId/store";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import ErrorLayout from "@/layout/ErrorLayout.vue";
import CashierLayout from "@/layout/CashierLayout.vue";
import ResetPasswordLayout from "@/modules/Auth/pages/ResetPassword.vue";
import AppConfirm from "@/components/ui/app-confirm/AppConfirm.vue";
import AppFaceId from "@/modules/FaceId/Pages/Index.vue";

const store = useFaceStore();
const route = useRoute();
const layout = computed(() => route.meta.layout);

const layouts = {
  MainLayout,
  LoginLayout,
  ErrorLayout,
  CashierLayout,
  ResetPasswordLayout,
};

const model = ref<boolean>(false);


const interval = setInterval(async () => {
  const data = await store.FETCH_FACE_ID();
  if (data) {
    if (data && data.user_id) {
      model.value = !model.value;
    }
  }
}, 5000);

watch(() => model.value, (value) => {
  if (value) {
    clearInterval(interval);
  }
});


watch(() => model.value, async (newValue) => {
  if (!newValue) {
    const interval = setInterval(async () => {
      const data = await store.FETCH_FACE_ID();
      if (data) {
        if (data && data.user_id) {
          model.value = !model.value;
        }
      }
    }, 5000);

    watch(() => model.value, (value) => {
      if (value) {
        clearInterval(interval);
      }
    });
  }
});
</script>

<template>
  <AppConfirm />

  <AppFaceId v-model="model" />

  <component
    v-if="layout"
    :is="layouts[layout]"
    :key="layout"
  >
    <RouterView />
  </component>
</template>
