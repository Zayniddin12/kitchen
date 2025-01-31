<script
  setup
  lang="ts"
>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

interface Name {
  uz: string;
  ru: string;
}

interface DataValue {
  name: Name;
  image: File | null;
  parent_id: string | number;
  measurement_unit_id: string | number;
  place_occupied: string;
  is_active: boolean | number;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const { t } = useI18n();
const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { setBreadCrumb } = useBreadcrumb();

const dataValue = ref<DataValue>({
  name: {
    uz: "",
    ru: "",
  },
  image: "",
  parent_id: "",
  measurement_unit_id: "",
  place_occupied: "",
  is_active: true,
  ready_to_eat: true,
});
const existingImage = ref<string>("");
const loading = ref<boolean>(false);

onMounted(async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      const detail = await store.GET_TYPE_PRODUCT_DETAIL(route.params.id as string | number);
      if (detail && detail.data) {
        dataValue.value = detail.data.product_type;
        existingImage.value = dataValue.value.image;

        dataValue.value.ready_to_eat = detail.data.product_type.ready_to_eat == 1;

      }
    } catch (e) {
      loading.value = false;
    }
    loading.value = false;
  }

  await store.GET_UNITS();
  await store.GET_TYPE_PRODUCT();
});


const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "Настройки",
  }, {
    label: "Продукты",
    to: { name: "reference" },
  }, {
    label: "Виды продуктов",
    to: { name: "reference-vid-product" },
  }, {
    label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
    isActionable: true,
  }]);
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push("/reference-vid-product");
  });
};

const deleteFn = () => {
  confirm.delete().then(async () => {
    await store.DELETE_TYPE_PRODUCT(+route.params.id);
    router.push("/reference-vid-product");
  });
};

// const switchChange = async (): Promise<boolean> => {
//   try {
//     const response = await confirm.show();
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      const formData = new FormData();
      formData.append("name[uz]", dataValue.value.name.uz);
      formData.append("name[ru]", dataValue.value.name.ru);
      formData.append("parent_id", dataValue.value.parent_id);
      formData.append("ready_to_eat", dataValue.value.ready_to_eat ? 1 : 0);
      formData.append("place_occupied", dataValue.value.place_occupied);
      formData.append("measurement_unit_id", Number(dataValue.value.measurement_unit_id));
      if (route.params.id) formData.append("_method", "PUT");

      if (dataValue.value.image && dataValue.value.image !== existingImage.value) {
        formData.append("image", dataValue.value.image);
      }

      if (dataValue.value.is_active) {
        formData.append("is_active", +dataValue.value.is_active);
      }

      if (route.params.id) {
        await store.UPDATE_VID_PRODUCT({
          id: route.params.id as string | number,
          data: formData,
        });
      } else {
        await store.CREATE_VID_PRODUCT(formData);
      }

      ElNotification({
        title: "Success",
        type: "success",
      });
      await router.push("/reference-vid-product");
    } catch (e) {
      ElNotification({
        title: "Error",
        type: "error",
      });
    }
  }
};

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>

    <div class="flex items-start mt-[24px]">
      <AppOverlay
        :loading
        :rounded="24"
        parent-class-name="border rounded-[24px] p-[24px] w-[70%]  min-h-[65vh]"
      >
        <AppMediaUploader
          v-model="dataValue.image"
          :value="existingImage"
        />
        <AppForm
          :value="dataValue"
          @validation="setValidation"
        >
          <div class="grid grid-cols-2 gap-4 mt-6">
            <AppInput
              v-model="dataValue.name.ru"
              :label="$t('Наименование (Рус)')"
              label-class="text-[#A8AAAE] text-xs"
              placeholder="Введите"
              required
              prop="name.ru"
              class="mb-0"
            />

            <AppInput
              v-model="dataValue.name.uz"
              :label="$t('Наименование (Ўзб)')"
              label-class="text-[#A8AAAE] text-xs"
              placeholder="Введите"
              required
              prop="name.uz"
              class="mb-0"
            />

            <AppSelect
              v-model="dataValue.parent_id"
              :label="$t('product.type')"
              label-class="text-[#A8AAAE] text-xs"
              placeholder="Введите"
              itemValue="id"
              itemLabel="name"
              :items="store.typeProduct.product_categories"
              required
              prop="parent_id"
              class="mb-0"
            />

            <AppSelect
              v-model="dataValue.measurement_unit_id"
              :label="$t('common.unitMeasurement')"
              label-class="text-[#A8AAAE] text-xs"
              placeholder="Введите"
              itemValue="id"
              itemLabel="name"
              :items="store.units.units"
              required
              prop="measurement_unit_id"
              class="mb-0"
            />
            <AppInput
              v-model="dataValue.place_occupied"
              prop="place_occupied"
              custom-type="number"
              :label="$t('Занимаемое место')"
              label-class="text-[#A8AAAE] text-xs"
              class="mb-0"
              required
            >
              <template #append>
                <span>кг</span>
              </template>
            </AppInput>

            <el-switch
              class="mt-7"
              v-model="dataValue.ready_to_eat"
              active-text="Приготовляемый"
            />

          </div>
        </AppForm>

        <el-switch
          v-model="dataValue.is_active"
          class="mt-6"
          v-if="route.name === 'reference-vid-edit-id'"
          :active-text="dataValue.is_active ? $t('status.activation') : $t('status.deactivation')"
        />
        <!--          :before-change="switchChange"-->
      </AppOverlay>
    </div>

    <div class="flex items-center justify-between mt-[24px] w-[70%]">
      <button
        v-if="$can('delete', 'Button')"
        class="custom-danger-btn"
        v-show="route.name === 'reference-vid-edit-id'"
        @click="deleteFn"
      >
        {{ $t("method.delete") }}
      </button>

      <div class="flex items-center ml-auto">
        <button
          class="custom-cancel-btn"
          @click="cancelFn"
        >
          {{ $t("method.cancel") }}
        </button>

        <button
          class="custom-apply-btn ml-[8px]"
          @click="handleSubmit"
        >
          {{ route.name === "reference-vid-edit-id" ? $t("method.save") : $t("method.add") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>