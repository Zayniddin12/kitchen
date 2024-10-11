<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElNotification } from 'element-plus'
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue";

const { t } = useI18n();
const router = useRouter();

interface UserData {
  password: string;
  confirm_code: string;
}

const userData = reactive<UserData>({
  password: "",
  confirm_code: "",
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const onSubmit = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    ElNotification({
      title: 'Error',
      message: 'Ошибка',
      type: 'error',
    })
  } else {
    await router.push("/login");
    ElNotification({
      title: 'Success',
      message: 'Успешно',
      type: 'success',
    })
  }
};
</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-[32px] right-[32px]" />

    <!-- Login Form Section -->
    <div class="w-full lg:w-1/4 md:w-1/2 m-auto">
      <header class="flex items-center justify-center mb-6">
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

      <h1 class="text-dark text-[24px] font-bold text-center md:w-[60%] lg:w-[60%] w-full m-auto">
        Установления нового
        постоянного пароля
      </h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] md:w-[90%] lg:w-[90%] w-full text-center">
        Введите свои учетные данные для доступа к вашей
        учетной записи
      </p>

      <AppForm
        :value="userData"
        @validation="setValidation"
        class="mt-[24px]"
      >
        <app-input
          v-model="userData.password"
          placeholder="Введите"
          label="Новый пароль"
          label-class="text-[#A8AAAE] text-sm"
          required
          show-password
          prop="password"
          maxlength="13"
        />

        <app-input
          v-model="userData.confirm_code"
          placeholder="Введите"
          label="Подтвердите пароль"
          label-class="text-[#A8AAAE] text-sm"
          required
          show-password
          prop="confirm_code"
        />
      </AppForm>

      <button
        @click="onSubmit"
        class="w-full bg-[#2E90FA] py-2.5 text-white rounded-lg mt-[25px]"
      >
        Отправить код
      </button>

      <div class="flex items-center justify-center mt-[22px] cursor-pointer" @click="router.go(-1)">
        <img src="@/assets/images/icons/back.svg" alt="back" />
        <p class="text-[#2E90FA] text-[14px] font-medium ml-[8px]">Назад</p>
      </div>
    </div>

    <!-- Footer Section -->
    <Footer />
  </div>
</template>

