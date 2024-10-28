<script
    setup
    lang="ts"
>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue";
import { ElNotification } from "element-plus";
import { SendCodeDataType } from "@/modules/Auth/auth.types";
import { useCommonStore } from "@/stores/common.store";

const router = useRouter();
const commonStore = useCommonStore();

const form = reactive<SendCodeDataType>({
  phone: "",
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const onSubmit = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) return;


};
</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-[32px] right-[32px]"/>

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
          :value="form"
          @validation="setValidation"
          class="mt-[24px]"
      >
        <app-input
            v-model="form.phone"
            prop="phone"
            type="tel"
            placeholder="Введите номер телефона"
            label="Номер телефона"
            label-class="text-[#A8AAAE] text-sm"
            required
        />
      </AppForm>

      <button
          @click="onSubmit"
          class="w-full bg-[#2E90FA] py-2.5 text-white rounded-lg mt-[25px]"
      >
        Отправить код
      </button>

      <button
          class="flex mx-auto items-center justify-center mt-[22px] cursor-pointer"
          @click="router.go(-1)"
      >
        <img
            src="@/assets/images/icons/back.svg"
            alt="back"
        />
        <span class="text-[#2E90FA] text-sm font-medium ml-[8px]">Назад</span>
      </button>
    </div>

    <Footer/>
  </div>
</template>

