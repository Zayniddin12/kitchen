<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Language from "@/components/language/index.vue";

const { t } = useI18n();

interface UserData {
  login: string;
  password: number;
}

const userData = ref<UserData>({
  login: "admin",
  password: 1,
});

const onSubmit = () => {
  console.log(userData.value);
};
</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-[32px] right-[32px]" />

    <!-- Background Image Section -->
    <img src="@/assets/images/loginBg.png"
         class="hidden lg:block h-full lg:w-1/2 object-cover rounded-lg"
         alt="login">

    <!-- Login Form Section -->
    <div class="w-full lg:w-1/4 md:w-1/2 m-auto">
      <!-- Logo and Title -->
      <header class="flex items-center mb-6">
        <img src="@/assets/images/logo.svg" alt="logo">
        <div class="flex flex-col ml-3">
          <b class="text-[#000D24] text-lg">НГМК</b>
          <span class="text-[#CBCCCE]">Фонд</span>
        </div>
      </header>

      <!-- Form Title -->
      <h1 class="text-[#000D24] text-xl font-bold">{{t('Войти в аккаунт')}}</h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] w-[90%]">Введите свои учетные данные для доступа к вашей учетной записи</p>

      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="mt-6">
        <!-- Username Input -->
        <div class="flex flex-col mb-4">
          <label class="text-[#A8AAAE] text-sm">Логин</label>
          <input placeholder="Введите" class="custom-input mt-1" v-model="userData.login" required />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col mb-2">
          <label class="text-[#A8AAAE] text-sm">Пароль</label>
          <input type="password" placeholder="Введите" class="custom-input mt-1" v-model="userData.password" required />
        </div>

        <!-- Forgot Password Link -->
        <div class="text-right text-[#2E90FA] text-xs mt-1 cursor-pointer">Забыли пароль?</div>

        <!-- Login Button -->
        <div class="mt-6">
          <button type="submit" class="w-full bg-[#2E90FA] py-2.5 text-white rounded-lg">Войти</button>
        </div>

        <!-- Divider with text -->
        <div class="flex items-center justify-between text-[#7F7D83] text-sm mt-4">
          <img src="@/assets/images/line.svg" alt="line">
          <span class="px-2">или</span>
          <img src="@/assets/images/line.svg" alt="line">
        </div>

        <!-- OneID Button -->
        <button class="w-full bg-[#4825C2] py-2.5 flex items-center justify-center text-white rounded-lg mt-4">
          ONE
          <img class="ml-2" src="@/assets/images/oneId.svg" alt="oneId">
        </button>
      </form>
    </div>

    <!-- Footer Section -->
    <footer class="text-[#A8AAAE] text-sm absolute right-8 bottom-10">
      ©{{ new Date().getFullYear() }} Anysoft
    </footer>
  </div>
</template>