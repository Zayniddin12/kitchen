<script
    setup
    lang="ts"
>
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import Avatar from "@/assets/images/avatar.png";
import { useUsersStore } from "@/modules/Users/users.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { formatPhone } from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";
import { usePositionStore } from "@/modules/Position/position.store";

interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute();

const routeId = computed(() => {
  const { id } = route.params;
  return id ? parseInt(id as string) : null;
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


const form = reactive({
  phone: ""
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const data = computed(() => {
  return activeUserCreatePage.value ? userStore.searchUser : userStore.user;
});

const loading = computed(() => {
  return activeUserUpdatePage.value ? userStore.userLoading : false;
});

const activeTab = ref<number>(0);
const tabs = ref<Tabs[]>([
  {
    title: "Данные кандидата",
    value: 0
  },
  {
    title: "Фотография для Face ID",
    value: 1
  }
]);

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};

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

  confirm.delete().then(() => {
    userStore.activeUserPage ? userStore.deleteUser(routeId.value as number) : userStore.deleteEmployee(routeId.value as number);
  });
};

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "visitors" });
  });
};

const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

const fetchSearchUser = () => {
  userStore.initializeSearchUser();
  if (!userStore.searchUser) router.replace({ name: `${userStore.activeRoutePrefix}-fetch` });
};

const setData = () => {
  form.phone = formatPhone(data.value?.phone);
};

const fetchUser = async () => {
  if (activeUserCreatePage.value) {
    fetchSearchUser();
  } else if (activeUserUpdatePage.value) {
    await userStore.fetchUser(routeId.value as number);
    setData();
  }
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

onUnmounted(() => {
  userStore.clearSearchUser();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">{{ route.meta?.title }}</h1>

    <div class="app-tabs w-[345px] my-[24px]">
      <div
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
          @click="setActiveTab(item)"
      >
        {{ item.title }}
      </div>
    </div>

    <AppOverlay
        :loading
        parent-class-name="border rounded-[24px] pb-[32px] overflow-hidden"
    >
      <template v-if="activeTab === 0">
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
            class="px-[24px]"
        >
          <div class="grid grid-cols-3 gap-x-6 gap-y-4">
            <AppInput
                label="Фамилия"
                :placeholder="data?.lastname"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                label="Имя"
                :placeholder="data?.firstname"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                label="Отчество"
                :placeholder="data?.patronymic || ''"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppDatePicker
                :placeholder="data?.birthday  || ''"
                label="Дата рождения"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                :placeholder="data?.nationality || ''"
                label="Национальность"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="col-span-1.5"
            />

            <AppInput
                :placeholder="gender?.name"
                label="Пол"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                :placeholder="data?.pass_number || ''"
                label="Серия и номер паспорта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                :placeholder="data?.pass_given_by || ''"
                label="Кем выдан"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppDatePicker
                label="Дата выпуска"
                :placeholder="data?.pass_given_at || ''"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppDatePicker
                label="Срок действия"
                :placeholder="data?.pass_valid_until || ''"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
            />

            <AppInput
                :placeholder="data?.pinfl || ''"
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
                  required
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
              label="OneID (необязательно)"
              class="app-checkbox"
          />
          <ElSwitch
              v-if="activeUserUpdatePage"
              active-text="Деактивация"
              class="app-switch mt-2 flex"
              :before-change="switchChange"
          />
        </AppForm>
      </template>

      <template v-else>
        <AppMediaUploader
            class="m-6"
            :height="633"
        />

      </template>
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
      <div class="flex items-center ml-auto">
        <button
            class="custom-cancel-btn"
            @click="cancelFn"
        >
          Отменить
        </button>
        <button class="custom-apply-btn ml-[8px]">
          {{ activeUserUpdatePage ? "Сохранить" : "Добавить" }}
        </button>
      </div>
    </div>
  </div>
</template>
