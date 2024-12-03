<script
  setup
  lang="ts"
>
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common.store";

const authStore = useAuthStore();
const commonStore = useCommonStore();

const router = useRouter();
const route = useRoute();

const loginOneId = async () => {
  const code = route.query?.code ?? "";

  if (!code) return await router.replace({ name: "login" });

  await authStore.loginOneId(code).then(() => {
    commonStore.successToast("Вы успешно вошли в систему", { name: "home" });
  }).catch(() => router.replace({ name: "login" }));
};

onMounted(() => {
  loginOneId();
});

</script>

<template>
  <AppOverlay
    :loading="authStore.oneIdLoading"
    :loading-size="70"
    parent-class-name="w-full h-screen min-h-[400px]"
  />
</template>

<style lang="scss">

</style>