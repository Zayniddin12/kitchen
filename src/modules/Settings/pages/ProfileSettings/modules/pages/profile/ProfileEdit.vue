<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { computed, onMounted, reactive, ref, watch } from "vue";
import Avatar from "@/assets/images/avatar.png";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { activeLocale, changeLocale, languages } from "@/localization";
import { usePositionStore } from "@/modules/Position/position.store";
import { formatPhone } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";

const route = useRoute();

const authStore = useAuthStore();
const positionStore = usePositionStore();
const commonStore = useCommonStore();

const userImg = computed(() => authStore.user?.image ?? Avatar);

const form = reactive({
  firstname: "",
  lastname: "",
  phone: "",
  position: "",
});

const v$ = ref<ValidationType | null>(null);

const setForm = () => {
  if (!authStore.user) return;

  form.firstname = authStore.user.firstname;
  form.lastname = authStore.user.lastname;
  form.phone = formatPhone(authStore.user.phone);
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }
};

onMounted(() => {
  positionStore.fetchPositions();
});

watch(() => authStore.user, setForm, { immediate: true });

</script>

<template>
  <div>
    <h5 class="text-lg text-black-text font-semibold">
      {{ route.meta.childTitle ?? "" }}
    </h5>
    <div class="mt-4 rounded-2xl border border-[#EEEEEF] p-4 flex items-center">
      <img
        :src="userImg"
        :alt="authStore.userFullName ?? 'user img'"
        class="size-20 object-contain"
      />
      <ElButton
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
      >
        Cменить картинку
      </ElButton>
      <ElButton
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
      >
        Удалить картинку
      </ElButton>
    </div>
    <div class="mt-6 rounded-2xl border border-[#EEEEEF] p-4">
      <h6 class="font-medium text-black-text text-lg">
        Персональная информация
      </h6>
      <AppForm
        :value="form"
        @validation="value => v$ = value"
        class="grid grid-cols-2 mt-4 gap-4 w-[81.4%]"
      >
        <AppInput
          v-model="form.firstname"
          label="Имя"
          placeholder="Имя"
          prop="firstname"
          required
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppInput
          v-model="form.lastname"
          prop="lastname"
          label="Фамилия"
          placeholder="Фамилия"
          required
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppInput
          v-model="form.phone"
          prop="phone"
          type="tel"
          label="Номер телефона"
          placeholder="Номер телефона"
          required
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppSelect
          v-model="form.position"
          prop="position"
          :items="positionStore.positions"
          item-label="name"
          item-value="id"
          label="Должность"
          placeholder="Должность"
          required
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppInput
          label="Название организации"
          placeholder="Название организации"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
        <AppSelect
          :model-value="activeLocale"
          :items="languages"
          item-value="value"
          item-label="title"
          label="Язык интерфейса"
          placeholder="Язык интерфейса"
          @change="changeLocale"
          class="mb-0"
          label-class="font-medium text-xs text-black-sub"
        />
      </AppForm>
    </div>
    <div class="flex items-center justify-end mt-6">
      <ElButton
        class="py-2.5 px-5 !bg-[#E2E6F3] !border-none !text-dark-gray"
        size="large"
      >
        Отменить
      </ElButton>
      <ElButton
        @click="sendForm"
        type="primary"
        class="ml-6 py-2.5 px-5"
        size="large"
      >
        Сохранить
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss">

</style>