<script
    setup
    lang="ts"
>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue";
import { ElNotification } from "element-plus";
import { ForgotPasswordDataType, SendCodeDataType, VerifyCodeDataType } from "@/modules/Auth/auth.types";
import { useCommonStore } from "@/stores/common.store";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { formatTime, normalizePhone } from "../../../utils/helper";

const router = useRouter();
const authStore = useAuthStore();
const commonStore = useCommonStore();

const form = reactive<VerifyCodeDataType>({
  phone: "",
  code: "",
  otp_session_id: ""
});

const confirmForm = reactive<ForgotPasswordDataType>({
  new_password: "",
  password_confirmation: "",
  phone: "",
  code: "",
  otp_session_id: ""
});

const activeConfirmForm = computed<boolean>(() => {
  return !!(authStore.otp && authStore.otp?.code);
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) return;

  const newForm = { ...form };

  newForm.phone = `998${newForm.phone.replace(/\D/g, "")}`;

  if (activeConfirmForm.value && authStore.otp && authStore.otp?.code) {
    confirmForm.phone = authStore.otp.phone;
    confirmForm.code = authStore.otp.code;
    confirmForm.otp_session_id = authStore.otp.session_id;
    await authStore.forgotPassword(confirmForm).then(() => {
      authStore.clearSessionOtp();
      commonStore.successToast({ name: "login" });
    });
    return;
  } else if (authStore.otp) {
    authStore.verifyCode({
      ...newForm,
      otp_session_id: authStore.otp.session_id
    });
    return;
  } else {
    authStore.sendCode({
      phone: newForm.phone
    });
  }
};

onMounted(() => {
  authStore.getSessionOtp();
  form.phone = normalizePhone(authStore.otp?.phone);
});

onUnmounted(() => {
  authStore.clearSessionOtp();
});

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
          :value="activeConfirmForm ? confirmForm : form"
          @validation="setValidation"
          class="mt-[24px] flex flex-col gap-y-1"
          @submit.prevent="sendForm"
      >
        <template v-if="!activeConfirmForm">
          <AppInput
              v-model="form.phone"
              prop="phone"
              type="tel"
              placeholder="Введите номер телефона"
              label="Номер телефона"
              label-class="text-[#A8AAAE] text-sm"
              required
          />
          <template v-if="authStore.otp">
            <AppInput
                v-model="form.code"
                type="number"
                placeholder="Введите отправленный код"
                label="Код"
                label-class="text-[#A8AAAE] text-sm"
                required
                :min="authStore.otp.code_length"
                :max="authStore.otp.code_length"
                :mask="'#'.repeat(authStore.otp.code_length)"
                prop="code"
            />
            <div
                v-if="authStore.remainingTime"
                class="text-[#8F9194] text-[14px] text-center"
            >
              {{ formatTime(authStore.remainingTime) }}
            </div>
          </template>
        </template>
        <template v-else>
          <AppInput
              v-model="confirmForm.new_password"
              placeholder="Введите"
              label="Новый пароль"
              label-class="text-[#A8AAAE] text-sm"
              required
              show-password
              prop="new_password"
              maxlength="13"
          />

          <AppInput
              v-model="confirmForm.password_confirmation"
              placeholder="Введите"
              label="Подтвердите пароль"
              label-class="text-[#A8AAAE] text-sm"
              required
              show-password
              prop="password_confirmation"
          />
        </template>
      </AppForm>
      <ElButton
          :loading="authStore.codeLoading"
          type="primary"
          @click="sendForm"
          class="w-full bg-[#2E90FA] py-2.5 h-11 text-white rounded-lg mt-4"
      >
        Отправить код
      </ElButton>
      <button
          class="flex mx-auto items-center justify-center mt-5 cursor-pointer"
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

