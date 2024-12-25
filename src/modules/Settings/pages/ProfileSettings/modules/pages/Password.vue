<script
  setup
  lang="ts"
>

import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { computed, onMounted, reactive, ref } from "vue";
import { UpdatePasswordDataType } from "@/modules/Auth/auth.types";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { deepEqual } from "@/utils/helper";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { useCommonStore } from "@/stores/common.store";
import { useI18n } from "vue-i18n";

interface FormType extends UpdatePasswordDataType {
  new_password_confirm: string;
}

const route = useRoute();
const router = useRouter();

const { confirm } = useConfirm();
const { t } = useI18n();

const authStore = useAuthStore();
const commonStore = useCommonStore();

const form = reactive<FormType>({
  old_password: "",
  new_password: "",
  new_password_confirm: "",
});

const oldForm = ref<FormType | null>(null);

const isChangeForm = computed<boolean>(() => {
  return !!oldForm.value && !deepEqual(form, oldForm.value);
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any>>({});

const redirectParentPage = () => {
  router.push({ name: "profile-settings-profile" });
};


const sendForm = async () => {
  if(!v$.value) return;

  if(!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  if(form.new_password && form.new_password_confirm && form.new_password !== form.new_password_confirm) {
    validationErrors.value.new_password_confirm = t("form.validate.confirmPassword");
    commonStore.errorToast(t("error.validation"));
    return;
  }

  try {
    await authStore.updatePassword({
      old_password: form.old_password,
      new_password: form.new_password,
    });
    validationErrors.value = {};
    redirectParentPage();
  } catch (error: any) {
    if(error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const cancelFn = async () => {
  if(isChangeForm.value) {
    const response = await confirm.cancel();

    if(response === "save") {
      await sendForm();
      return;
    }
  }
  redirectParentPage();
};

onMounted(() => {
  oldForm.value = { ...form };
});

</script>

<template>
  <div>
    <h5 class="text-lg text-black-text font-semibold">
      {{ route.meta.childIsTranslate ? t(route.meta.childTitle) : route.meta.childTitle ?? "" }}
    </h5>
    <AppForm
      :value="form"
      @validation="value => v$ = value"
      :validation-errors
      class="mt-4 rounded-2xl border border-[#EEEEEF] p-4 py-5 grid grid-cols-2 gap-x-6 gap-y-4"
    >
      <AppInput
        v-model="form.old_password"
        prop="old_password"
        type="password"
        :label="t('common.oldPassword')"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
        required
      />
      <br />
      <AppInput
        v-model="form.new_password"
        prop="new_password"
        type="password"
        :label="t('auth.newPassword')"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
        required
      />
      <AppInput
        v-model="form.new_password_confirm"
        prop="new_password_confirm"
        type="password"
        :label="t('auth.repeatNewPassword')"
        label-class="font-medium text-xs text-black-sub"
        class="mb-0"
        required
      />
    </AppForm>
    <div class="flex items-center justify-end mt-6">
      <ElButton
        @click="cancelFn"
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
      >
        {{t("method.cancel")}}
      </ElButton>
      <ElButton
        @click="sendForm"
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
        :disabled="!isChangeForm"
      >
        {{t("method.save")}}
      </ElButton>
    </div>
  </div>
</template>