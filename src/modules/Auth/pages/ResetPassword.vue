<script
  setup
  lang="ts"
>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
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
import { formatPhone, formatTime } from "../../../utils/helper";

const router = useRouter();
const authStore = useAuthStore();
const commonStore = useCommonStore();

const form = reactive<VerifyCodeDataType>({
  phone: "",
  code: "",
  otp_session_id: "",
});

const { t } = useI18n();

const confirmForm = reactive<ForgotPasswordDataType>({
  new_password: "",
  password_confirmation: "",
  phone: "",
  code: "",
  otp_session_id: "",
});

const activeConfirmForm = computed<boolean>(() => {
  return !!(authStore.otp && authStore.otp?.code);
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any>>({});

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  validationErrors.value = {};

  if (confirmForm.new_password && confirmForm.password_confirmation && confirmForm.new_password !== confirmForm.password_confirmation) {
    validationErrors.value.password_confirmation = t("form.validate.confirmPassword");
    commonStore.errorToast(t("error.validation"));
    return;
  }

  const newForm = { ...form };

  newForm.phone = `998${newForm.phone.replace(/\D/g, "")}`;

  if (activeConfirmForm.value && authStore.otp && authStore.otp?.code) {
    confirmForm.phone = authStore.otp.phone;
    confirmForm.code = authStore.otp.code;
    confirmForm.otp_session_id = authStore.otp.session_id;
    await authStore.forgotPassword(confirmForm).then(() => {
      authStore.clearSessionOtp();
      commonStore.successToast({ name: "login" });
      validationErrors.value = {};
    }).catch((error: any) => {
      if (error?.error?.code === 422) {
        validationErrors.value = error.meta.validation_errors;
      }
    });
    return;
  } else if (authStore.otp) {
    authStore.verifyCode({
      ...newForm,
      otp_session_id: authStore.otp.session_id,
    });
    return;
  } else {
    authStore.sendCode({
      phone: newForm.phone,
    });
  }
};

onMounted(() => {
  authStore.getSessionOtp();
  form.phone = authStore.otp?.phone ? formatPhone(authStore.otp.phone) : "";
});

onUnmounted(() => {
  authStore.clearSessionOtp();
});

watch(() => authStore.otp, (newValue) => {
  if (!newValue) v$.value?.clear();
});

</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-[32px] right-[32px]" />

    <div class="w-full lg:w-1/4 md:w-1/2 m-auto">
      <header class="flex items-center justify-center mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
          class="h-[50px]"
        />
        <div class="flex flex-col ml-3">
          <b class="text-dark text-lg">{{ t("logo.title") }}</b>
          <span class="text-[#CBCCCE]">{{ t("logo.subtitle") }}</span>
        </div>
      </header>
      <h1 class="text-dark text-xl font-bold text-center">{{ t("auth.resetPassword.title") }}</h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] w-[90%] text-center">
        {{ t("auth.resetPassword.description") }}
      </p>
      <AppForm
        :value="activeConfirmForm ? confirmForm : form"
        @validation="setValidation"
        :validation-errors
        class="mt-[24px] flex flex-col gap-y-1"
        @submit.prevent="sendForm"
      >
        <template v-if="!activeConfirmForm">
          <AppInput
            v-model="form.phone"
            prop="phone"
            type="tel"
            :placeholder="t('form.enterPhone')"
            :label="t('common.phone')"
            label-class="text-[#A8AAAE] text-sm"
            required
          />
          <template v-if="authStore.otp">
            <AppInput
              v-model="form.code"
              prop="code"
              :placeholder="t('auth.resetPassword.enterSentCode')"
              :label="t('common.code')"
              label-class="text-[#A8AAAE] text-sm"
              required
              :min="authStore.otp.code_length"
              :max="authStore.otp.code_length"
              :mask="'#'.repeat(authStore.otp.code_length)"
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
            :label="t('auth.newPassword')"
            label-class="text-[#A8AAAE] text-sm"
            required
            show-password
            prop="new_password"
            :max="13"
          />

          <AppInput
            v-model="confirmForm.password_confirmation"
            type="password"
            :label="t('auth.confirmPassword')"
            label-class="text-[#A8AAAE] text-sm"
            required
            prop="password_confirmation"
            :max="13"
          />
        </template>
      </AppForm>
      <ElButton
        :loading="authStore.codeLoading"
        type="primary"
        @click="sendForm"
        class="w-full bg-[#2E90FA] py-2.5 h-11 text-white rounded-lg mt-4"
      >
        {{ t("auth.sendCode") }}
      </ElButton>
      <button
        class="flex mx-auto items-center justify-center mt-5 cursor-pointer"
        @click="router.go(-1)"
      >
        <img
          src="@/assets/images/icons/back.svg"
          alt="back"
        />
        <span class="text-[#2E90FA] text-sm font-medium ml-[8px]">{{ t("common.back") }}</span>
      </button>
    </div>

    <Footer />
  </div>
</template>

