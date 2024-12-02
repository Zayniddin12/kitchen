<script
    setup
    lang="ts"
>
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import Avatar from "@/assets/images/avatar.png";
import { useUsersStore } from "@/modules/Users/users.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { formatPhone, getStatus, getStatusText, mergeCommonKeys, setStatus } from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";
import { usePositionStore } from "@/modules/Position/position.store";
import { UserCreateOrUpdateDataPrefixType, UserCreateOrUpdateDataType } from "@/modules/Users/users.types";

interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute();

const routeId = computed(() => {
  const { id } = route.params;
  return id ? parseInt(id as string) : 0;
});

const commonStore = useCommonStore();
const userStore = useUsersStore();
const positionStore = usePositionStore();

const activeUserCreatePage = computed(() => {
  return route.meta.type === "create";
});

const activeUserUpdatePage = computed(() => {
  return !!(route.meta.type === "update" && routeId.value);
});


const form = ref<UserCreateOrUpdateDataType>({
  phone: "",
  position_id: "",
  is_oneid_enabled: false,
  firstname: "",
  lastname: "",
  patronymic: "",
  birthday: "",
  nationality: "",
  gender: "",
  pass_number: "",
  pass_given_by: "",
  pass_given_at: "",
  pass_valid_until: "",
  pinfl: ""
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const validationErrors = ref<Record<string, any> | null>(null);

const sendForm = async () => {
  if (!v$.value || !data.value) return;

  if (!v$.value.validate()) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm: UserCreateOrUpdateDataType = { ...form.value };

  newForm.phone = `998${newForm.phone.replace(/\D/g, "")}`;

  try {
    if (activeUserCreatePage.value){
      newForm.status = "active";
      if (userStore.activeUserPage){
        await userStore.createUser(newForm);
      }else{
        await userStore.createEmployee(newForm);
      }
    }else if (activeUserUpdatePage.value){
      if (typeof newForm.status === 'boolean') newForm.status = setStatus(newForm.status);

      if(userStore.activeUserPage){
        await userStore.updateUser(routeId.value, newForm);
      }else{
        await userStore.updateEmployee(routeId.value, newForm);
      }
    }

    validationErrors.value = null;
    commonStore.successToast({ name: userStore.activeRoutePrefix });

  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};


const data = computed(() => {
  return activeUserCreatePage.value ? userStore.searchUser : userStore.user;
});

const loading = computed(() => {
  return activeUserUpdatePage.value ? userStore.userLoading : false;
});

const sendLoading = computed(() => {

  return userStore.activeUserPage
      ? (activeUserCreatePage.value ? userStore.createUserLoading : userStore.updateUserLoading)
      : (activeUserCreatePage.value ? userStore.createEmployeeLoading : userStore.updateEmployeeLoading);
});

const defaultTab = 1;

const validRouteTab = (tab: string) => {
  const newTab = Number(tab);
  return newTab === 1 || newTab === 2 ? newTab : defaultTab;
};

const activeTab = computed(() => validRouteTab(route.query.tab as string));

const tabs = ref<Tabs[]>([
  {
    title: "Данные кандидата",
    value: 1
  },
  {
    title: "Фотография для Face ID",
    value: 2
  }
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры"
    },
    {
      label: String(route.meta?.parentRouteTitle ?? ""),
      to: route.meta?.parentRouteUrl
    },
    {
      label: String(route.meta?.title ?? ""),
      isActionable: true
    }
  ]);
};

const { confirm } = useConfirm();

const deleteLoading = computed(() => {
  return userStore.activeUserPage ? userStore.deleteUserLoading : userStore.deleteEmployeeLoading;
});

const deleteFn = () => {
  if (!activeUserUpdatePage.value) return;

  confirm.delete().then(async () => {
    await (userStore.activeUserPage ? userStore.deleteUser(routeId.value as number) : userStore.deleteEmployee(routeId.value as number));
    router.push({ name: userStore.activeRoutePrefix });
  });
};

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: userStore.activeRoutePrefix });
  });
};

const fetchSearchUser = () => {
  userStore.initializeSearchUser();
  if (!userStore.searchUser) router.replace({ name: `${userStore.activeRoutePrefix}-fetch` });
};

const setData = () => {
  if (!data.value) return;
  console.log(data.value);
  form.value = mergeCommonKeys(form.value, data.value);
  form.value.phone = formatPhone(data.value.phone);
  form.value.position_id = form.value.position_id ?? "";
  form.value.status = getStatus(data.value.status);
};

const fetchUser = async () => {
  if (activeUserCreatePage.value) {
    fetchSearchUser();
  } else if (activeUserUpdatePage.value) {
    try {
      await userStore.fetchUser(routeId.value as number);
    } catch (error: any) {
      if (error.error.code === 404) {
        router.replace({ name: userStore.activeRoutePrefix });
      }
    }
  }
  setData();
};

const gender = computed(() => {
  if (!data.value) return null;

  return commonStore.getGender(data.value.gender);
});

onMounted(() => {
  setBreadCrumbFn();
  fetchUser();
  if (userStore.activeUserPage) {
    positionStore.fetchPositions();
  }
});

onBeforeRouteLeave(() => {
  userStore.clearSearchUser();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">{{ route.meta?.title }}</h1>
    <div class="app-tabs w-[345px] my-[24px]">
      <RouterLink
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
          :to="{query: {...route.query, tab: item.value}}"
      >
        {{ item.title }}
      </RouterLink>
    </div>

    <AppOverlay
        :loading
        parent-class-name="border rounded-[24px] pb-[32px] overflow-hidden"
    >
      <TransitionGroup
          :name="activeTab>defaultTab ? 'nested' : 'nested-reverse'"
          tag="div"
          class="flex gap-x-10 w-full"
      >
        <div
            class="w-full"
            v-if="activeTab === 1"
        >
          <div class="py-[70px] bg-[#F8F9FC] px-[24px] relative mb-[90px]">
            <div class="top-[32px] absolute flex items-center">
              <div class="rounded-full overflow-hidden border-4 border-gray-100">
                <img
                    :src="gender?.photo ?? Avatar"
                    alt="Profile Picture"
                    class="object-cover h-[160px] w-[160px] rounded-full"
                >
              </div>

              <div class="text-xl font-semibold text-gray-900 ml-[24px]">
                {{ userStore.getUserFullName(data) || "—" }}
              </div>
            </div>
          </div>
          <AppForm
              :value="form"
              @validation="setValidation"
              :validation-errors
              class="px-[24px]"
          >
            <div class="grid grid-cols-3 gap-x-6 gap-y-4">
              <AppInput
                  v-model="form.lastname"
                  prop="lastname"
                  label="Фамилия"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.firstname"
                  prop="firstname"
                  label="Имя"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.patronymic"
                  prop="patronymic"
                  label="Отчество"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppDatePicker
                  v-model="form.birthday"
                  prop="birthday"
                  label="Дата рождения"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.nationality"
                  prop="nationality"
                  label="Национальность"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
                  class="col-span-1.5"
              />

              <AppInput
                  :placeholder="gender?.name"
                  prop="gender"
                  label="Пол"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.pass_number"
                  prop="pass_number"
                  label="Серия и номер паспорта"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.pass_given_by"
                  prop="pass_given_by"
                  label="Кем выдан"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppDatePicker
                  v-model="form.pass_given_at"
                  prop="pass_given_at"
                  label="Дата выпуска"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppDatePicker
                  v-model="form.pass_valid_until"
                  prop="pass_valid_until"
                  label="Срок действия"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />

              <AppInput
                  v-model="form.pinfl"
                  prop="pinfl"
                  label="ПИНФЛ"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
              />
              <AppInput
                  v-model="form.phone"
                  prop="phone"
                  label="Номер телефона"
                  type="tel"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
              />
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-4 mt-2">
              <template v-if="userStore.activeUserPage">
                <AppSelect
                    v-model="form.position_id"
                    prop="position_id"
                    label="Должность в системе (необязательно)"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                    :items="positionStore.positions"
                    :loading="positionStore.positionsLoading"
                    item-label="name"
                    item-value="id"
                    required
                />
                <AppSelect
                    label="Роли (необязательно)"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                />
              </template>
              <template v-else>
                <AppSelect
                    label="Место работы"
                    label-class="text-[#A8AAAE] text-[12px] font-medium"
                    placeholder="Выберите"
                />

                <AppSelect
                    label="График работы"
                    label-class="text-[#A8AAAE] text-[12px] font-medium"
                    placeholder="Выберите"
                />
              </template>
            </div>
            <ElCheckbox
                v-model="form.is_oneid_enabled"
                label="OneID (необязательно)"
                class="app-checkbox"
            />
            <br>
            <ElSwitch
                v-if="activeUserUpdatePage && form.status !== undefined"
                v-model="form.status"
                :active-text="getStatusText(form.status)"
                class="app-switch mt-2 inline-flex"
            />
          </AppForm>
        </div>

        <template v-else>
          <AppMediaUploader
              class="m-6 w-full"
              :height="450"
          />

        </template>
      </TransitionGroup>
    </AppOverlay>

    <div class="flex items-center justify-between mt-[24px]">
      <ElButton
          v-if="activeUserUpdatePage"
          :loading="deleteLoading"
          type="danger"
          size="large"
          class="custom-danger-btn"
          @click="deleteFn"
      >
        Удалить
      </ElButton>
      <div class="flex items-center ml-auto gap-x-2">
        <button
            class="custom-cancel-btn"
            @click="cancelFn"
        >
          Отменить
        </button>
        <ElButton
            :loading="sendLoading"
            size="large"
            type="primary"
            class="custom-apply-btn"
            @click="sendForm"
        >
          {{ activeUserUpdatePage ? "Сохранить" : "Добавить" }}
        </ElButton>
      </div>
    </div>
  </div>
</template>
