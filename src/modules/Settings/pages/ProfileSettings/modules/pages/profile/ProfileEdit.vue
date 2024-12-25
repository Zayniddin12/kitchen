<script
  setup
  lang="ts"
>

import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { computed, onMounted, reactive, ref, watch } from "vue";
import Avatar from "@/assets/images/avatar.png";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { activeLocale, changeLocale, languages } from "@/localization";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";
import { deepEqual, formatPhone } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";
import { useI18n } from "vue-i18n";
import { LOCALES } from "@/localization/localization.type";
import { useSettingsStore } from "@/modules/Settings/store";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { UpdateUserDataType } from "@/modules/Auth/auth.types";

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const { confirm } = useConfirm();

const authStore = useAuthStore();
const positionStore = usePositionStore();
const commonStore = useCommonStore();
const settingsStore = useSettingsStore();

const avatarUrl = ref("");

interface FormType {
  avatar: File | null,
  phone: string;
  position_id: number | "";
  organization_id: number | "";
}

const form = reactive<FormType>({
  avatar: null,
  phone: "",
  position_id: "",
  organization_id: "",
});

const oldForm = ref<FormType | null>(null);

const isChangeForm = computed<boolean>(() => {
  return !!oldForm.value && !deepEqual(form, oldForm.value);
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any> | null>(null);

const setForm = () => {
  if(!authStore.user) return;

  form.phone = formatPhone(authStore.user.phone);
  form.position_id = authStore.user.position_id ?? "";
  form.organization_id = authStore.user.organization_id ?? "";

  avatarUrl.value = authStore.user.image || Avatar;

  oldForm.value = { ...form };
};

const sendForm = async () => {
  if(!v$.value) return;

  if(!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  const newForm = new FormData();

  newForm.append("_method", "PUT");

  newForm.append("phone", `998${form.phone.replace(/\D/g, "")}`);

  if(form.avatar) {
    newForm.append("avatar", form.avatar);
  }

  try {
    await authStore.updateUser(newForm as any);
    authStore.me();
    redirectParentPage();
    validationErrors.value = null;
  } catch (error: any) {
    if(error?.error?.code === 422) {
      const { validation_errors } = error.meta;
      validationErrors.value = validation_errors;
      if(validation_errors.avatar) {
        commonStore.errorToast(validation_errors.avatar);
      }
    }
  }
};

const uploadAvatar = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if(target.files && target.files[0]) {
    const file = target.files[0];
    form.avatar = file;
    avatarUrl.value = URL.createObjectURL(file);
    target.value = "";
  }
};

const removeAvatar = () => {
  avatarUrl.value = authStore.user?.image || Avatar;
  form.avatar = null;
};

const redirectParentPage = () => {
  router.push({ name: "profile-settings-profile" });
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

const title = computed(() => route.meta.childTitle ?? "");

onMounted(() => {
  positionStore.fetchPositions({ getAll: 1 });
  settingsStore.GET_ORGANIZATION({ per_page: 100 });
});

watch(() => authStore.user, setForm, { immediate: true });

</script>

<template>
  <div>
    <h5 class="text-lg text-black-text font-semibold">
      {{ route.meta.childIsTranslate ? t(title) : title }}
    </h5>
    <div class="mt-4 rounded-2xl border border-[#EEEEEF] p-4 flex items-center">
      <input
        id="avatar-uploader"
        type="file"
        accept="image/*"
        @input="uploadAvatar"
        hidden
      />
      <div class="size-20">
        <img
          :src="avatarUrl"
          :alt="authStore.userFullName ?? 'user img'"
          class="size-full object-contain"
        />
      </div>
      <ElButton
        tag="label"
        for="avatar-uploader"
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
      >
        {{ t("common.changePicture") }}
      </ElButton>
      <ElButton
        @click="removeAvatar"
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
        :disabled="!form.avatar"
      >
        {{ t("common.deletePicture") }}
      </ElButton>
    </div>
    <div class="mt-6 rounded-2xl border border-[#EEEEEF] p-4">
      <h6 class="font-medium text-black-text text-lg">
        {{ t("common.personalInformation") }}
      </h6>
      <AppForm
        :value="form"
        @validation="value => v$ = value"
        :validation-errors
        class="grid grid-cols-2 mt-4 gap-4 w-[81.4%]"
      >
        <AppInput
          :label="t('user.name')"
          :placeholder="authStore.user?.firstname || 'Имя'"
          prop="firstname"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
          disabled
        />
        <AppInput
          :label="t('user.fullName')"
          :placeholder="authStore.user?.lastname || t('user.fullName')"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
          disabled
        />
        <AppInput
          v-model="form.phone"
          prop="phone"
          type="tel"
          :label="t('common.phone')"
          :placeholder="t('common.phone')"
          required
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppSelect
          v-model="form.position_id"
          prop="position_id"
          :items="positionStore.positions"
          item-label="name"
          item-value="id"
          :label="t('common.job')"
          :placeholder="t('common.job')"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
          disabled
        />
        <AppSelect
          v-model="form.organization_id"
          prop="organization_id"
          item-value="id"
          item-label="name"
          :items="settingsStore.organization?.organizations ?? []"
          :label="t('organization.name')"
          :placeholder="t('organization.name')"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
          disabled
        />
        <AppSelect
          v-model="activeLocale"
          :items="languages"
          item-value="value"
          item-label="title"
          :label="t('common.lang')"
          :placeholder="t('common.lang')"
          @change="value => changeLocale(value as LOCALES)"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
      </AppForm>
    </div>
    <div class="flex items-center justify-end mt-6">
      <ElButton
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
        @click="cancelFn"
      >
        {{ t("method.cancel") }}
      </ElButton>
      <ElButton
        :loading="authStore.updateUserLoading"
        @click="sendForm"
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
        :disabled="!isChangeForm"
      >
        {{ t("method.save") }}
      </ElButton>
    </div>
  </div>
</template>