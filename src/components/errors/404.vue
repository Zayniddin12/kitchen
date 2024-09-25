<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const backToHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex items-center justify-center h-[100vh]">
    <div class="flex flex-col">
      <img src="@/assets/images/404.svg" alt="404">
      <button class="bg-[#2E90FA] w-[200px] py-[10px] rounded-lg text-white m-auto" @click="backToHome">
        Вернуться домой
      </button>
    </div>
  </div>
</template>
