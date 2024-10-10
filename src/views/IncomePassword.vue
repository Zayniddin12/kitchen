<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue";

const { t } = useI18n();
const router = useRouter();

interface UserData {
  phone: string;
  code: string;
}

const userData = reactive<UserData>({
  phone: "+998",
  code: "",
});
const count = ref<number>();

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const onSubmit = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    toast.error("Ошибка");
  } else {
    await router.push("/new-password");
    toast.success("Успешно");
  }
};

let count1 = 60;
const timer = setInterval(() => {
  const minutes = Math.floor(count1 / 60);
  const seconds = count1 % 60;
  count.value = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}` as any;
  count1--;
  if (count1 < 0) {
    clearInterval(timer);
  }
}, 1000);
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

      <h1 class="text-dark text-xl font-bold text-center">Сброс пароля</h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] w-[90%] text-center">
        На данной странице Вы можете восстановить доступ к своему аккаунту. Введите Ваш номер телефона и система
        автоматически отправит Вам временный
        код для сброса пароля.
      </p>

      <AppForm
        :value="userData"
        @validation="setValidation"
        class="mt-[24px]"
      >
        <app-input
          v-model="userData.phone"
          placeholder="Введите номер телефона"
          label="Номер телефона"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="phone"
          maxlength="13"
        />

        <app-input
          v-model="userData.code"
          placeholder="Введите отправленный код"
          label="Код"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="code"
        />
      </AppForm>

      <div class="text-[#8F9194] text-[14px] text-center">
        {{ count }}
      </div>

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

