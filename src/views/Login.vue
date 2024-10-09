<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { toast } from "vue3-toastify";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue"

const { t } = useI18n();
const router = useRouter();

interface UserData {
  login: string;
  password: string;
}

const userData = reactive<UserData>({
  login: "",
  password: "",
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const onSubmit = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())){
    toast.error('Ошибка')
  } else {
    await router.push("/home");
    toast.success('Успешно')
    localStorage.setItem("current-menu", '0');
  }
};
</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-[32px] right-[32px]" />

    <!-- Background Image Section -->
    <img
      src="@/assets/images/loginBg.png"
      class="hidden lg:block h-full lg:w-1/2 object-cover rounded-lg"
      alt="login"
    />

    <!-- Login Form Section -->
    <div class="w-full lg:w-1/4 md:w-1/2 m-auto">
      <!-- Logo and Title -->
      <header class="flex items-center mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
          class="h-[50px]"
        />
        <div class="flex flex-col ml-3">
          <b class="text-dark text-lg">НГМК</b>
          <span class="text-[#CBCCCE]">Фонд</span>
        </div>
      </header>

      <!-- Form Title -->
      <h1 class="text-dark text-xl font-bold">{{ t("Войти в аккаунт") }}</h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] w-[90%]">
        Введите свои учетные данные для доступа к вашей учетной записи
      </p>

      <!-- Login Form -->
      <AppForm
        :value="userData"
        @validation="setValidation"
        class="mt-6"
      >
        <!-- Username Input -->
        <app-input
          v-model="userData.login"
          placeholder="Введите"
          label="Логин"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="login"
          trigger="change"
        />

        <!-- Password Input -->
        <app-input
          v-model="userData.password"
          type="password"
          show-password
          placeholder="Введите"
          label="Пароль"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="password"
          trigger="change"
        />

        <!-- Forgot Password Link -->
        <div class="text-right text-[#2E90FA] text-xs mt-1 cursor-pointer" @click="router.push('/reset-password')">
          Забыли пароль?
        </div>
      </AppForm>

        <!-- Login Button -->
        <div class="mt-6">
          <button
            @click="onSubmit"
            class="w-full bg-[#2E90FA] py-2.5 text-white rounded-lg"
          >
            Войти
          </button>
        </div>

        <!-- Divider with text -->
        <div
          class="flex items-center justify-between text-[#7F7D83] text-sm mt-4"
        >
          <img
            src="@/assets/images/line.svg"
            class="ml-4 md:w-[40%] lg:w-[40%] w-[20%]"
            alt="line"
          />
          <span class="px-2">или</span>
          <img
            src="@/assets/images/line.svg"
            class="mr-4 md:w-[40%] lg:w-[40%] w-[20%]"
            alt="line"
          />
        </div>

        <!-- OneID Button -->
        <button class="w-full bg-[#4825C2] py-2.5 flex items-center justify-center text-white rounded-lg mt-4">
          ONE
          <img
            class="ml-2"
            src="@/assets/images/oneId.svg"
            alt="oneId"
          />
        </button>
    </div>

    <!-- Footer Section -->
    <Footer/>
  </div>
</template>

