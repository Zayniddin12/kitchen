<script
  setup
  lang="ts"
>

import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { getStatus, getStatusText, setStatus } from "@/utils/helper";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";
import {
  PositionDataType,
  PositionShowCommonType,
  WorkPlaceType,
} from "@/modules/Settings/components/Reference/Position/position.types";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";
import { useListStore } from "@/modules/List/list.store";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";

const { t } = useI18n();

const settingsStore = useSettingsStore();
const positionStore = usePositionStore();
const commonStore = useCommonStore();
const listStore = useListStore();

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const routeId = computed(() => +route.params.id);

const method = computed(() => route.meta.method ?? "");

const methodLoading = computed(() => {
  return method.value === "create" ? positionStore.createPositionLoading : positionStore.updatePositionLoading;
});

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "common.settings",
      isTranslate: true,
      to: { name: "reference" },
    },
    {
      label: "settings.directories",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: "settings.positionsAndRoles",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: "position.list",
      isTranslate: true,
      to: { name: "position-list" },
    },
    {
      label: route.meta.breadcrumbItemTitle ?? "",
      isActionable: true,
      isTranslate: route.meta.breadcrumbItemIsTranslate,
    },
  ]);
};

const form = reactive<PositionDataType>({
  name: {
    uz: "",
    ru: "",
  },
  work_place_id: "",
  work_place_type: "",
  status: true,
});


const validationErrors = ref<Record<string, any> | null>(null);


const form2 = reactive<PositionShowCommonType>({
  management_id: "",
  food_factory_id: "",
  base_id: "",
  base_warehouse_id: "",
  kitchen_warehouse_id: "",
});

const v$ = ref<null | ValidationType>(null);

const changeWorkPlace = (id: number, type: WorkPlaceType) => {
  form.work_place_id = id;
  form.work_place_type = type;
};

const setData = async () => {
  if (method.value !== "update") return;
  await positionStore.fetchPosition(routeId.value);

  if (!positionStore.position) return;

  form.name = { ...positionStore.position.name };
  form.work_place_id = positionStore.position.work_place_id;
  form.work_place_type = positionStore.position.work_place_type as WorkPlaceType;
  form.status = getStatus(positionStore.position.status);
  if (positionStore.position.management_id) {
    form2.management_id = positionStore.position.management_id;
    changeManagement(form2.management_id);
  }
  if (positionStore.position.food_factory_id) {
    form2.food_factory_id = positionStore.position.food_factory_id;
    changeFoodFactory(form2.food_factory_id);
  }
  if (positionStore.position.base_id) {
    form2.base_id = positionStore.position.base_id;
    changeBase(form2.base_id);
  }
  form2.base_warehouse_id = positionStore.position.base_warehouse_id ?? "";
  form2.kitchen_warehouse_id = positionStore.position.kitchen_warehouse_id ?? "";
};

const deletePosition = async () => {
  await positionStore.deletePosition(routeId.value);
  router.push({ name: "position-list" });
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  if (form2.management_id) changeWorkPlace(+form2.management_id, "management");
  if (form2.food_factory_id) changeWorkPlace(+form2.food_factory_id, "foodFactory");
  if (form2.base_id) changeWorkPlace(+form2.base_id, "base");
  if (form2.base_warehouse_id) changeWorkPlace(+form2.base_warehouse_id, "baseWarehouse");
  if (form2.kitchen_warehouse_id) changeWorkPlace(+form2.kitchen_warehouse_id, "kitchenWarehouse");

  const newForm = { ...form };
  newForm.status = setStatus(newForm.status as boolean);

  try {
    if (method.value === "create") {
      await positionStore.createPosition(newForm);
    } else if (method.value === "update") {
      await positionStore.updatePosition(routeId.value, newForm);
    }

    router.push({ name: "position-list" });

  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};


const changeManagement = (id: AppSelectValueType) => {
  if (typeof id !== "number") return;
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
  if (typeof id !== "number") return;
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
  if (typeof id !== "number") return;
  listStore.fetchBaseWarehouses(id);
  listStore.fetchKitchenWarehouses(id);
  clearBase();
  changeWorkPlace(id, "base");
};

const clearBase = () => {
  form2.base_warehouse_id = "";
  form2.kitchen_warehouse_id = "";
};

onMounted(() => {
  settingsStore.GET_REGIONAL({ per_page: 100 });
  setBreadCrumbFn();
  setData();
});

</script>

<template>
  <section>
    <h1 class="text-black-text text-[32px] font-semibold">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="min-w-[792px] w-[75%]">
      <AppOverlay
        :loading="positionStore.positionLoading"
        :rounded="24"
        parent-class-name="border border-[#E2E6F3] rounded-3xl mt-6"
        class="p-6 min-h-[61vh] flex flex-col justify-between"
      >
        <AppForm
          :value="form"
          :validation-errors
          @validation="value => v$=value"
        >
          <div class="grid grid-cols-3 gap-x-6">
            <AppInput
              v-model="form.name.ru"
              prop="name.ru"
              :label="t('position.name', {lang: t('lang.ru')})"
              label-class="font-medium text-xs text-black-sub"
              class="mb-0"
              required
            />
            <AppInput
              v-model="form.name.uz"
              prop="name.uz"
              :label="t('position.name', {lang: t('lang.uz')})"
              label-class="font-medium text-xs text-black-sub"
              class="mb-0"
              required
            />
          </div>
          <div class="mt-6">
            <div class="pb-2 border-b border-[#F1F1F1]">
              <h3 class="text-black-text font-medium text-sm">
                {{ t("position.affiliation") }}
              </h3>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-x-6 gap-y-3">
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
                class="mb-0"
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
                class="mb-0"
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
                class="mb-0"
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
                class="mb-0"
                :disabled="!form2.base_id || !!form2.kitchen_warehouse_id"
                @change="id => changeWorkPlace(id, 'baseWarehouse')"
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
                class="mb-0"
                :disabled="!form2.base_id || !!form2.base_warehouse_id"
                @change="id => changeWorkPlace(id, 'kitchenWarehouse')"
                clearable
              />
            </div>
          </div>
        </AppForm>
        <ElSwitch
          v-if="method === 'update'"
          v-model="form.status"
          :active-text="getStatusText(form.status)"
          class="app-switch mt-4 inline-flex"
        />
      </AppOverlay>
      <div class="flex justify-between items-center mt-6 gap-x-6">
        <ElButton
          v-if="method === 'update'"
          :loading="positionStore.deletePositionLoading"
          class="custom-danger-btn"
          size="large"
          type="danger"
          @click="deletePosition"
        >
          {{ t("method.delete") }}
        </ElButton>
        <div class="flex items-center ml-auto gap-x-2">
          <button
            class="custom-cancel-btn"
          >
            {{ t("method.cancel") }}
          </button>
          <ElButton
            :loading="methodLoading"
            @click="sendForm"
            type="primary"
            size="large"
          >
            {{ method === "create" ? t("method.add") : t("method.save") }}
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>