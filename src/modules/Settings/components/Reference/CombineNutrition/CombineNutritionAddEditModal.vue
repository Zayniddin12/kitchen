<script
    setup
    lang="ts"
>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {
  FoodFactoriesCreateFormType
} from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import { deepEqual, getStatus, getStatusText, Name, setStatus } from "@/utils/helper";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { useCommonStore } from "@/stores/common.store";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const settingsStore = useSettingsStore();
const commonStore = useCommonStore();
const loading = ref(false);


const form = reactive<FoodFactoriesCreateFormType>({
  name: new Name(),
  management_id: ""
});

const oldForm = ref<FoodFactoriesCreateFormType | null>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const { setBreadCrumb } = useBreadcrumb();

const routeID = computed(() => {
  return route.params?.id ? +route.params.id : null;
});

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки"
    },
    {
      label: "Справочники",
      to: { name: "reference" }
    },

    {
      label: "Управ, комбинаты и склады",
      to: { name: "reference" }
    },

    {
      label: "Комбинаты питания",
      to: { name: "reference-combine-nutrition" }
    },
    {
      label: route?.meta?.breadcrumbItemTitle as string ?? "",
      isActionable: true
    }
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const cancelFn = async () => {
  if (oldForm.value && !deepEqual(form, oldForm.value)) {
    const response = await confirm.cancel();
    if (response === "save") {
      await sendForm();
      return;
    }
  }

  router.push({ name: "reference-combine-nutrition" });
};

const deleteLoading = ref(false);

const deleteFn = () => {
  if (!routeID.value) return;

  confirm.delete().then(async () => {
    deleteLoading.value = true;
    await settingsStore.deleteFoodFactory(routeID.value as number);
    commonStore.successToast({ name: "reference-combine-nutrition" });
  }).finally(() => {
    deleteLoading.value = false;
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


const sendForm = async () => {
  if (!(v$.value && await v$.value.validate())) return;

  loading.value = true;

  try {
    if (route.name === "reference-combine-nutrition-add") {
      await settingsStore.createFoodFactory(form);
    } else if (route.name === "reference-combine-nutrition-edit" && routeID.value) {
      const newForm = { ...form };
      if (typeof newForm.status === "boolean") newForm.status = setStatus(newForm.status);
      await settingsStore.updateFoodFactory(routeID.value as number, newForm);
    }

    commonStore.successToast({ name: "reference-combine-nutrition" });

  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const setForm = async () => {
  if (!routeID.value) return;
  await settingsStore.showFoodFactory(routeID.value);

  if (!settingsStore.foodFactory) return;
  form.name = settingsStore.foodFactory.name;
  form.management_id = settingsStore.foodFactory.management.id;
  form.status = getStatus(settingsStore.foodFactory.status);
};

onMounted(async () => {
  settingsStore.GET_REGIONAL({ per_page: 100 });

  await setForm();

  oldForm.value = JSON.parse(JSON.stringify(form));
});


const disabled = computed(() => {
  return route.name === "reference-combine-nutrition-view";
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    </div>
    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppOverlay
            :loading="settingsStore.foodFactoryLoading"
            :rounded="16"
            class="border border-[#E2E6F3] p-[24px] min-h-[60vh] flex flex-col gap-y-6 justify-between"
        >
          <AppForm
              :value="form"
              @validation="setValidation"
              class="grid grid-cols-2 gap-x-4"
          >
            <AppInput
                v-model="form.name.ru"
                prop="name.ru"
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                :disabled
            />
            <AppInput
                v-model="form.name.uz"
                prop="name.uz"
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                :disabled
            />
            <AppSelect
                v-model="form.management_id"
                :items="settingsStore.regional.managements"
                item-value="id"
                item-label="name"
                prop="management_id"
                trigger="change"
                label="Региональное управление"
                placeholder="Выберите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                :disabled
            />
          </AppForm>
          <ElSwitch
              v-if="route.name === 'reference-combine-nutrition-edit' && form.status !== undefined"
              v-model="form.status"
              :active-text="getStatusText(form.status)"
              class="app-switch"
          />
        </AppOverlay>

        <div
            v-if="route.name !== 'reference-combine-nutrition-view'"
            class="flex items-center mt-[24px] justify-between"
        >
          <ElButton
              type="danger"
              size="large"
              :loading="deleteLoading"
              v-if="route.name === 'reference-combine-nutrition-edit'"
              class="custom-danger-btn"
              @click="deleteFn"
          >
            Удалить
          </ElButton>


          <div class="flex items-center gap-4 ml-auto">
            <button
                @click="cancelFn"
                class="custom-cancel-btn h-10"
            >
              Отменить
            </button>

            <ElButton
                :loading
                type="primary"
                size="large"
                @click="sendForm"
                class="custom-apply-btn"
            >
              {{ route.params.id ? "Сохранить" : "Добавить" }}
            </ElButton>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <RouterLink
            v-if="route.name === 'reference-combine-nutrition-view'"
            :to="{name: 'reference-combine-nutrition-edit', params: {id: routeID}}"
            class="inline-flex items-center justify-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px] min-w-[260px]"
        >
          <img
              src="/icons/edit.svg"
              alt="edit icon"
              class="size-5"
          />
          Редактировать
        </RouterLink>
      </div>
    </div>
  </div>
</template>

