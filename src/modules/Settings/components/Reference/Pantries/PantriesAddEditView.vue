<script
  setup
  lang="ts"
>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { filterObjectValues, getStatusText } from "@/utils/helper";
import { maska } from "maska/dist/svelte";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useCommonStore } from "@/stores/common.store";
import { useI18n } from "vue-i18n";

const settingsStore = useSettingsStore();
const commonStore = useCommonStore();

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { t } = useI18n();

interface Name {
  uz: string;
  ru: string;
}

interface PantriesType {
  id?: number;
  name: Name;
  capacity: string | number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
  factory_id: number | null;
  measure_id?: number;
}

const status = ref<boolean>(true);

const pantriesData = ref<PantriesType>({
  name: {
    ru: "",
    uz: "",
  },
  capacity: null,
  status: "active",
  factory_id: null,
  measure_id: 1,
});


const { setBreadCrumb } = useBreadcrumb();

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
  }, {
    label: "settings.directories",
    isTranslate: true,
    to: { name: "reference" },
  },

    {
      label: "settings.managementFactoriesAndWarehouses",
      isTranslate: true,
      to: { name: "reference" },
    },

    {
      label: "pantries.title",
      isTranslate: true,
      to: { name: "reference-pantries" },
    }, {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isTranslate: !!route.meta.breadcrumbItemTitle,
      isActionable: true,
    }]);
};

onMounted(async () => {
  await settingsStore.fetchFoodFactories({ per_page: 100 });
  if (route.params.id) {
    const data = await settingsStore.GET_PANTRIES_ITEM(route.params.id as string | number);

    if (data && data.pantry) {
      pantriesData.value = data.pantry;
      status.value = data.pantry.status == "active";
    }
  }
});

watchEffect(() => {
  setBreadCrumbFn();
});

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push({ name: "reference-pantries" });
  });
};

const deleteFn = () => {
  confirm.delete().then(async res => {
    await settingsStore.DELETE_PANTRIES(route.params.id as string);
    await router.push({ name: "reference-pantries" });
  });
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {

    try {

      if (route.params.id) {
        await settingsStore.UPDATE_PANTRIES({
          id: route.params.id as string | number,
          data: pantriesData.value,
        });
      } else {
        await settingsStore.CRETE_PANTRIES(pantriesData.value);
      }
      await commonStore.successToast("/reference-pantries");
    } catch (e) {
      // ElNotification({ title: "Error", type: "error" });
    }
  }
};

const switchChange2 = async (e: any): Promise<boolean> => {
  if (status.value) {
    pantriesData.value.status = "active";
  } else {
    pantriesData.value.status = "inactive";
  }
};

const isDisabled = computed<boolean>(() => {
  return route.name == "reference-pantries-view";
});

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppForm
          :value="pantriesData"
          @validation="setValidation"
        >
          <AppOverlay
            :loading="settingsStore.pantriesItemLoading"
            :rounded="16"
            parent-class-name="rounded-2xl border border-[#E2E6F3] p-[24px]"
            class="min-h-[55vh] flex flex-col"
          >
            <div class="flex items-center gap-4">
              <app-input
                v-model="pantriesData.name.ru"
                :label="t('common.name2Lang', {lang: t('lang.ru')})"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="name.ru"
                :disabled="isDisabled"
              />

              <app-input
                v-model="pantriesData.name.uz"
                :label="t('common.name2Lang', {lang: t('lang.uz')})"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="name.uz"
                :disabled="isDisabled"
              />
            </div>

            <div class="flex items-center gap-4">
              <AppSelect
                v-model="pantriesData.factory_id"
                :items="settingsStore.foodFactories?.food_factories"
                item-value="id"
                item-label="name"
                class="w-full"
                prop="factory_id"
                trigger="change"
                :label="t('combineNutrition.title')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                :disabled
              />

              <app-input
                v-model="pantriesData.capacity"
                :label="t('Вместимость склада цеха')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="capacity"
                placeholder="Введите"
              >
                <template #append>
                  <span>тонна</span>
                </template>
              </app-input>

            </div>


            <ElSwitch
              v-model="status"
              v-if="route.params.id && !route.query.type"
              :active-text="getStatusText(status)"
              class="app-switch mt-auto"
              @change="switchChange2"
              :disabled="isDisabled"
            />
          </AppOverlay>
        </AppForm>
        <div
          v-if="!route.query.type"
          class="flex items-center mt-[24px] "
          :class="!route.params.id ? 'justify-end' : 'justify-between'"
        >
          <button
            v-if="$can('delete', 'Button')"
            v-show="route.params.id"
            class="custom-danger-btn"
            @click="deleteFn"
          >
            {{ t("method.delete") }}
          </button>
          <div class="flex items-center gap-4">
            <button
              @click="cancelFn"
              class="custom-cancel-btn"
            >
              {{ t("method.cancel") }}
            </button>
            <button
              class="custom-apply-btn"
              @click="handleSubmit"
            >
              {{ t(route.params.id ? "method.save" : "method.add") }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
          @click="router.push({name: 'reference-pantries-edit', params: {id: 1}})"
          v-if="route.query.type == 'view'"
          class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
          />
          {{ t("method.edit") }}
        </button>
      </div>
    </div>
  </div>
</template>

