<script
  setup
  lang="ts"
>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { ElNotification } from "element-plus";
import Language from "@/components/language/index.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import Footer from "@/components/ui/Footer.vue";
import { AuthLoginDataType } from "@/modules/Auth/auth.types";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { useCommonStore } from "@/stores/common.store";
import { setSessionItem } from "@/utils/sessionStorage";
import { loginOneId } from "@/utils/helper";

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const commonStore = useCommonStore();

const form = reactive<AuthLoginDataType>({
  phone: "",
  password: "",
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const onSubmit = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
  } else {
    const newForm = { ...form };
    newForm.phone = `998${newForm.phone.replace(/\D/g, "")}`;
    await authStore.login(newForm).then(() => {

      commonStore.successToast("/");
      setSessionItem("current-menu", "0");
    });
  }
};


</script>

<template>
  <div class="p-8 h-screen flex flex-col lg:flex-row items-center relative bg-[#ffffff]">
    <Language class="fixed top-8 right-8" />

    <!-- Background Image Section -->
    <img
      src="@/assets/images/loginBg.png"
      class="hidden lg:block h-full lg:w-1/2 object-cover rounded-lg"
      alt="login"
    />

    <div class="w-full lg:w-1/4 md:w-1/2 m-auto">
      <header class="flex items-center mb-6">
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

      <h1
        v-if="route.meta.title"
        class="text-dark text-xl font-bold"
      >
        {{ t(route.meta.title) }}
      </h1>
      <p class="text-[#A8AAAE] text-[14px] mt-[6px] w-[90%]">
        {{ t("auth.loginSubtitle") }}
      </p>

      <AppForm
        :value="form"
        @validation="setValidation"
        class="mt-6"
        @submit.prevent="onSubmit"
      >
        <app-input
          v-model="form.phone"
          type="tel"
          :label="t('common.phone')"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="phone"
          trigger="change"
          @keyup.enter="onSubmit"
        />
        <app-input
          @keyup.enter="onSubmit"
          v-model="form.password"
          type="password"
          :label="t('common.password')"
          label-class="text-[#A8AAAE] text-sm"
          required
          prop="password"
          trigger="change"
        />

        <router-link
          class="float-right mb-[20px] text-[#2E90FA] text-xs mt-1 cursor-pointer"
          to="/reset-password"
        >
          {{ t("auth.forgotPassword") }}?
        </router-link>
      </AppForm>

      <ElButton
        :loading="authStore.loginLoading"
        @click="onSubmit"
        type="primary"
        class="w-full bg-[#2E90FA] h-11 py-2.5 text-white rounded-lg text-sm"
      >
        {{ t("auth.login.btn") }}
      </ElButton>
      <div class="flex items-center justify-between text-[#7F7D83] text-sm mt-4">
        <img
          src="@/assets/images/line.svg"
          class="ml-4 md:w-[40%] lg:w-[40%] w-[20%]"
          alt="line"
        />
        <span class="px-2">
          {{ t("common.or") }}
        </span>
        <img
          src="@/assets/images/line.svg"
          class="mr-4 md:w-[40%] lg:w-[40%] w-[20%]"
          alt="line"
        />
      </div>

      <button
        @click="loginOneId"
        class="w-full bg-[#4825C2] py-2.5 flex items-center justify-center text-white rounded-lg mt-4"
      >
        ONE
        <img
          class="ml-2"
          src="@/assets/images/oneId.svg"
          alt="oneId"
        />
      </button>
    </div>

    <Footer />
  </div>
</template>