<script
  setup
  lang="ts"
>
import { computed, onMounted, reactive, ref, watch } from "vue";
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
import {
  deepEqual, filterObjectValues, formatPhone, getStatus, getStatusText, mergeCommonKeys, setStatus,
} from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";
import { UserCreateOrUpdateDataType } from "@/modules/Users/users.types";
import { useSettingsStore } from "@/modules/Settings/store";
import { useI18n } from "vue-i18n";
import { useRoleStore } from "@/modules/Settings/components/Reference/Role/role.store";
import { AppMediaUploaderValueType } from "@/components/ui/form/app-media-uploader/app-media-uploader.type";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import { WorkPlaceType } from "@/modules/Settings/components/Reference/Position/position.types";
import { useListStore } from "@/modules/List/list.store";

interface Tabs {
  title: string;
  value: number;
}

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const routeId = computed<number>(() => {
  const { id } = route.params;
  return id ? parseInt(id as string) : 0;
});

const commonStore = useCommonStore();
const userStore = useUsersStore();
const positionStore = usePositionStore();
const settingsStore = useSettingsStore();
const roleStore = useRoleStore();
const listStore = useListStore();

const activeUserCreatePage = computed(() => {
  return route.meta.type === "create";
});

const activeUserUpdatePage = computed(() => {
  return !!(route.meta.type === "update" && routeId.value);
});


const form = ref<UserCreateOrUpdateDataType>({
  phone: "",
  organization_id: "",
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
  pinfl: "",
  avatar: "",
  work_place_id: "",
  work_place_type: "",
});

const oldForm = ref<UserCreateOrUpdateDataType | null>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const validationErrors = ref<Record<string, any> | null>(null);

const saveFaceIdImage = async (id: number) => {
  if(!image.value) return;

  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("face_image", image.value as any);
  await userStore.updateEmployeePhoto({
    id,
    data: formData,
  });
};

const sendForm = async () => {
  if(!v$.value || !data.value) return;

  if(!(await v$.value.validate())) {
    await commonStore.errorToast("Validation Error");
    return;
  }

  const newForm: UserCreateOrUpdateDataType = JSON.parse(JSON.stringify(form.value));

  if(userStore.activeEmployeePage && !newForm?.dining_locations?.temporary.kitchen_id) {
    delete newForm.dining_locations.temporary;
  }

  newForm.phone = `998${newForm.phone.replace(/\D/g, "")}`;

  try {
    if(activeUserCreatePage.value) {
      newForm.status = "active";
      if(userStore.activeUserPage) {
        await userStore.createUser(newForm);
      } else {
        const { data } = await userStore.createEmployee(newForm);
        await saveFaceIdImage(data.data.user.id);
      }
    } else if(activeUserUpdatePage.value) {
      if(typeof newForm.status === "boolean") newForm.status = setStatus(newForm.status);

      if(userStore.activeUserPage) {
        await userStore.updateUser(routeId.value, newForm);
      } else {
        await userStore.updateEmployee(routeId.value, newForm);
        await saveFaceIdImage(routeId.value);
      }
    }

    validationErrors.value = null;
    commonStore.successToast({ name: userStore.activeRoutePrefix });

  } catch (error: any) {
    if(error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const form2 = reactive({
  management_id: "",
  food_factory_id: "",
  base_id: "",
  base_warehouse_id: "",
  kitchen_warehouse_id: "",
});

const changeWorkPlace = (id: number, type: WorkPlaceType) => {
  form.value.work_place_id = id;
  form.value.work_place_type = type;
};

const changeManagement = (id: AppSelectValueType) => {
  if(typeof id !== "number") return;
  changeWorkPlace(id, "management");
  listStore.fetchFoodFactories(id);
  clearManagement();
};

const clearManagement = () => {
  form2.food_factory_id = "";
  form2.base_id = "";
  form2.base_warehouse_id = "";
  form2.kitchen_warehouse_id = "";
};

const changeFoodFactory = (id: AppSelectValueType) => {
  if(typeof id !== "number") return;
  changeWorkPlace(id, "foodFactory");
  listStore.fetchBases(id);
  clearFoodFactory();
};

const clearFoodFactory = () => {
  form2.base_id = "";
  form2.base_warehouse_id = "";
  form2.kitchen_warehouse_id = "";
};

const changeBase = (id: AppSelectValueType) => {
  if(typeof id !== "number") return;
  listStore.fetchBaseWarehouses(id);
  listStore.fetchKitchenWarehouses(id);
  clearBase();
};

const clearBase = () => {
  form2.base_warehouse_id = "";
  form2.kitchen_warehouse_id = "";
};


const data = computed(() => {
  if(activeUserCreatePage.value) return userStore.searchUser;

  return userStore.activeUserPage ? userStore.user : userStore.employee;
});

const loading = computed(() => {
  return userStore.activeUserPage ? userStore.userLoading : userStore.employeeLoading;
});

const sendLoading = computed(() => {

  return userStore.activeUserPage ? (activeUserCreatePage.value ? userStore.createUserLoading : userStore.updateUserLoading) : (activeUserCreatePage.value ? userStore.createEmployeeLoading : userStore.updateEmployeeLoading);
});

const defaultTab = 1;

const validRouteTab = (tab: string) => {
  const newTab = Number(tab);
  return newTab === 1 || newTab === 2 ? newTab : defaultTab;
};

const hasTab = computed(() => {
  return userStore.activeEmployeePage;
});

const activeTab = computed(() => {
  return hasTab.value ? validRouteTab(route.query.tab as string) : defaultTab;
});

const tabs = ref<Tabs[]>([{
  title: "Данные кандидата",
  value: 1,
}, {
  title: "Фотография для Face ID",
  value: 2,
}]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "Кадры",
  }, {
    label: String(route.meta?.parentRouteTitle ?? ""),
    to: route.meta?.parentRouteUrl,
  }, {
    label: String(route.meta?.title ?? ""),
    isActionable: true,
  }]);
};

const { confirm } = useConfirm();

const deleteLoading = computed(() => {
  return userStore.activeUserPage ? userStore.deleteUserLoading : userStore.deleteEmployeeLoading;
});

const deleteFn = () => {
  if(!activeUserUpdatePage.value) return;

  confirm.delete().then(async () => {
    await (userStore.activeUserPage ? userStore.deleteUser(routeId.value as number) : userStore.deleteEmployee(routeId.value as number));
    router.push({ name: userStore.activeRoutePrefix });
  });
};

const cancelFn = async () => {
  const isChange = oldForm.value && !deepEqual(form.value, oldForm.value);

  if(isChange) {
    const response = await confirm.cancel();

    if(response === "save") {
      await sendForm();
      return;
    }
  }

  v$.value?.clear();
  router.push({ name: userStore.activeRoutePrefix });
};

const fetchSearchUser = () => {
  userStore.initializeSearchUser();
  if(!userStore.searchUser) router.replace({ name: `${userStore.activeRoutePrefix}-fetch` });
};

const setData = () => {

  if(!data.value) return;

  if(userStore.activeUserPage) {
    form.value.position_id = "";
    form.value.role_id = "";

  } else {
    form.value.work_hours = "";
    form.value.dining_locations = {
      permanent: {
        kitchen_id: "",
      },
      temporary: {
        kitchen_id: "",
        start_date: "",
        end_date: "",
      },
    };
  }

  form.value = mergeCommonKeys(form.value, data.value);
  form.value.phone = formatPhone(data.value.phone);
  form.value.status = getStatus(data.value.status);


  oldForm.value = JSON.parse(JSON.stringify(form.value));
};

const fetchUser = async () => {
  if(activeUserCreatePage.value) {
    fetchSearchUser();
  } else if(activeUserUpdatePage.value) {
    try {
      if(userStore.activeUserPage) await userStore.fetchUser(routeId.value as number); else await userStore.fetchEmployee(routeId.value as number);
    } catch (error: any) {
      if(error.error.code === 404) {
        await router.replace({ name: userStore.activeRoutePrefix });
      }
    }
  }
  setData();
};

const gender = computed(() => {
  if(!data.value) return null;

  return commonStore.getGender(data.value.gender);
});

const fetchRoles = () => {
  roleStore.fetchRoles(filterObjectValues({
    depend_id: form.value.work_place_id,
    depend_type_id: form.value.work_place_type,
  }));
};

const avatar = computed(() => {
  return data.value?.avatar_link || gender.value?.photo;
});

const fullName = computed(() => {
  return userStore.activeUserPage ? userStore.userFullName : userStore.employeeFullName;
})

watch(() => form.value.work_place_id, () => fetchRoles());

onMounted(async () => {
  setBreadCrumbFn();
  await fetchUser();
  await settingsStore.GET_KITCHEN_WAREHOUSE();
  await settingsStore.GET_ORGANIZATION({ per_page: 100 });
  if(userStore.activeUserPage) {
    await positionStore.fetchPositions({ getAll: 1 });
    await settingsStore.GET_REGIONAL({ per_page: 100 });
    fetchRoles();
  } else {
    await settingsStore.fetchKitchenWarehouseList({ is_paid: 0 });
  }
});

onBeforeRouteLeave(() => {
  userStore.clearSearchUser();
});

const image = ref<AppMediaUploaderValueType>("");

const workingHours = reactive([{
  title: 8,
  key: 8,
}, {
  title: 12,
  key: 12,
}]);

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">{{ route.meta?.title }}</h1>
    <div
      v-if="hasTab"
      class="app-tabs w-[345px] mt-6"
    >
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
      parent-class-name="border rounded-[24px] pb-[32px] overflow-hidden mt-6"
    >
      <TransitionGroup
        :name="activeTab>defaultTab ? 'nested' : 'nested-reverse'"
        tag="div"
        class="flex gap-x-10 w-full"
      >
        <div
          class="w-full"
          v-show="activeTab === 1"
        >
          <!--          {{settingsStore.kitchenWarehouse.kitchen_warehouses}}-->
          <div class="py-[70px] bg-[#F8F9FC] px-[24px] relative mb-[90px]">
            <div class="top-[32px] absolute flex items-center">
              <div class="rounded-full overflow-hidden border-4 border-gray-100">
                <img
                  v-if="avatar"
                  :src="avatar"
                  :alt="fullName || 'Profile Picture'"
                  class="object-cover h-[160px] w-[160px] rounded-full"
                >
              </div>

              <div class="text-xl font-semibold text-gray-900 ml-[24px]">
                {{ fullName || "—" }}
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
                class="mb-1"
              />

              <AppInput
                v-model="form.firstname"
                prop="firstname"
                label="Имя"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppInput
                v-model="form.patronymic"
                prop="patronymic"
                label="Отчество"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppDatePicker
                v-model="form.birthday"
                prop="birthday"
                label="Дата рождения"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppInput
                v-model="form.nationality"
                prop="nationality"
                label="Национальность"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="col-span-1.5 mb-1"
              />

              <AppInput
                :placeholder="gender?.name"
                prop="gender"
                label="Пол"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppInput
                v-model="form.pass_number"
                prop="pass_number"
                label="Серия и номер паспорта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppInput
                v-model="form.pass_given_by"
                prop="pass_given_by"
                label="Кем выдан"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppDatePicker
                v-model="form.pass_given_at"
                prop="pass_given_at"
                label="Дата выпуска"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppDatePicker
                v-model="form.pass_valid_until"
                prop="pass_valid_until"
                label="Срок действия"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />

              <AppInput
                v-model="form.pinfl"
                prop="pinfl"
                label="ПИНФЛ"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
                class="mb-1"
              />
              <AppInput
                v-model="form.phone"
                prop="phone"
                label="Номер телефона"
                type="tel"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                class="mb-1"
              />
              <template v-if="userStore.activeUserPage">
                <AppInput
                  :label="t('common.fund')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  :placeholder="t('logo.name')"
                  disabled
                />
                <AppSelect
                  v-model="form2.management_id"
                  :items="settingsStore.regional.managements"
                  item-value="id"
                  item-label="name"
                  prop="management_id"
                  :label="t('settings.regionalAdministration')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  @change="changeManagement"
                  @clear="clearManagement"
                  clearable
                />
                <AppSelect
                  v-model="form2.food_factory_id"
                  :items="listStore.foodFactories"
                  item-label="name"
                  item-value="id"
                  :label="t('user.combine')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  :loading="listStore.foodFactoriesLoading"
                  :disabled="!form2.management_id"
                  @change="changeFoodFactory"
                  @clear="clearFoodFactory"
                  clearable
                />
                <AppSelect
                  v-model="form2.base_id"
                  prop="base_id"
                  :items="listStore.bases"
                  item-label="name"
                  item-value="id"
                  :loading="listStore.basesLoading"
                  :label="t('base.warehouse.title')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  :disabled="!form2.food_factory_id"
                  @change="changeBase"
                  @clear="clearBase"
                  clearable
                />
                <AppSelect
                  v-model="form2.base_warehouse_id"
                  prop="base_warehouse_id"
                  :items="listStore.baseWarehouses"
                  item-value="id"
                  item-label="name"
                  :loading="listStore.baseWarehousesLoading"
                  :label="t('base.warehouse.reverseTitle')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  :disabled="!form2.base_id || !!form2.kitchen_warehouse_id"
                  clearable
                />
                <AppSelect
                  v-model="form2.kitchen_warehouse_id"
                  prop="kitchen_warehouse_id"
                  :items="listStore.kitchenWarehouses"
                  item-label="name"
                  item-value="id"
                  :loading="listStore.kitchenWarehousesLoading"
                  :label="t('kitchen.title')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  :disabled="!form2.base_id || !!form2.base_warehouse_id"
                  clearable
                />
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
                  class="mb-1"
                />
                <AppSelect
                  v-model="form.role_id"
                  :items="roleStore.roles"
                  item-value="id"
                  item-label="title"
                  label="Роли (необязательно)"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  required
                />
                <AppSelect
                  v-if="form.role_id === 18"
                  v-model="form.organization_id"
                  prop="organization_id"
                  item-value="id"
                  item-label="name"
                  :items="settingsStore.organization?.organizations ?? []"
                  label="Организация"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                />
              </template>
              <template v-else-if="userStore.activeEmployeePage && form.dining_locations">
                <AppSelect
                  v-model="form.dining_locations.permanent.kitchen_id"
                  :items="settingsStore.kitchenWarehouse.kitchen_warehouses"
                  item-value="id"
                  item-label="name"
                  prop="dining_locations.permanent.kitchen_id"
                  label="Постоянная кухня"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                  class="mb-1"
                  clearable
                />
                <AppSelect
                  v-model="form.dining_locations.temporary.kitchen_id"
                  prop="dining_locations.temporary.kitchen_id"
                  :items="settingsStore.kitchenWarehouse.kitchen_warehouses"
                  item-value="id"
                  item-label="name"
                  label="Временная кухня"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  class="mb-1"
                  clearable
                />
                <AppDatePicker
                  v-model="form.dining_locations.temporary.start_date"
                  prop="dining_locations.temporary.start_date"
                  label="Период временной кухни с"
                  range
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  value-format="YYYY-MM-DD"
                  class="mb-1"
                  :required="!!form.dining_locations.temporary.kitchen_id"
                  :disabled="!form.dining_locations.temporary.kitchen_id"
                />
                <AppDatePicker
                  v-model="form.dining_locations.temporary.end_date"
                  prop="dining_locations.temporary.end_date"
                  label="Период временной кухни по"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  value-format="YYYY-MM-DD"
                  class="mb-1"
                  :required="!!form.dining_locations.temporary.kitchen_id"
                  :disabled="!form.dining_locations.temporary.kitchen_id"
                />
                <AppSelect
                  v-model="form.organization_id"
                  prop="organization_id"
                  item-value="id"
                  item-label="name"
                  :items="settingsStore.organization?.organizations ?? []"
                  label="Место работы"
                  label-class="text-[#A8AAAE] text-[12px] font-medium"
                  placeholder="Выберите"
                  class="mb-1"
                />

                <AppSelect
                  v-model="form.work_hours"
                  prop="work_hours"
                  label="График работы"
                  :items="workingHours"
                  item-value="key"
                  item-label="title"
                  label-class="text-[#A8AAAE] text-[12px] font-medium"
                  placeholder="Выберите"
                  class="mb-1"
                  required
                />
              </template>
            </div>
            <ElCheckbox
              v-if="userStore.activeUserPage"
              v-model="form.is_oneid_enabled"
              label="OneID"
              class="app-checkbox mt-4"
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
        <AppMediaUploader
          v-show="activeTab === 2"
          v-model="image"
          :value="data?.face_image_link ?? data?.avatar_link ?? ''"
          class="m-6 w-full"
          :height="450"
        />
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
