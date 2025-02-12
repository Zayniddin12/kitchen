<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { Name } from "@/utils/helper";
import { ElNotification } from "element-plus";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Repeater {
  product_type_parent_id: string;
  product_type_id: string;
  quantity: number;
  unit_id: string | number;
}

interface DataValue {
  number: string;
  quantity: string;
  unit_id: string;
  image: string | File;
  compositions: Repeater;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { setBreadCrumb } = useBreadcrumb();
const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },
    {
      label: "Рационы и блюда",
      to: { name: "reference" },
    },
    {
      label: "Блюда",
      to: { name: "reference-dish" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

const dataValue = ref<DataValue>({
  name: new Name(),
  number: "",
  quantity: "",
  unit_id: "",
  image: "",
  compositions: [
    {
      vid_list: [],
      product_type_parent_id: "",
      product_type_id: "",
      quantity: 0,
      unit_id: "",
    },
  ],
});
const existingImage = ref<string>("");
const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    await store.GET_UNITS();
    await store.GET_TYPE_PRODUCT();

    if (route.params.id) {
      const meals = await store.GET_MEALS_DETAIL(route.params.id as string | number);
      if (meals && meals.meal) {
        dataValue.value = meals.meal;
        existingImage.value = dataValue.value.image;


        for (const e of meals.meal.compositions) {

          if (e.product_type_parent_id) {
            await store.GET_MEALS_VID_PRO({ parent_id: e.product_type_parent_id, per_page: 100 });
            e.vid_list = store.parentProductType?.product_types;
          }
        }
      }
    }
  } catch (e) {
    loading.value = false;
  }
  loading.value = false;

});

const repeaterAgain = () => {
  dataValue.value.compositions.push({
    vid_list: [],
    product_type_parent_id: "",
    product_type_id: "",
    quantity: 0,
    unit_id: "",
  });
};

const handleDelete = (index: number) => {
  if (dataValue.value.compositions.length > 1) {
    confirm.delete().then(() => {
      dataValue.value.compositions.splice(index, 1);
    });
  }
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push("/reference-dish");
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_MEALS(route.params.id as string | number);
    router.push("/reference-dish");
    ElNotification({ title: "Success", type: "success" });
  });
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      const formData = new FormData();
      formData.append("name[uz]", dataValue.value.name.uz);
      formData.append("name[ru]", dataValue.value.name.ru);
      formData.append("number", dataValue.value.number);
      // formData.append('quantity', dataValue.value.quantity);
      formData.append("unit_id", dataValue.value.unit_id);
      

      if (route.params.id) {
        formData.append("_method", "PUT");
        if (dataValue.value.image && typeof dataValue.value.image !== "string") {
          formData.append("image", dataValue.value.image);
        }
      } else {
        if (dataValue.value.image) {
          formData.append("image", dataValue.value.image);
        }
      }
      dataValue.value.compositions.forEach((composition, index) => {
        formData.append(`compositions[${index}][product_type_parent_id]`, composition.product_type_parent_id);
        formData.append(`compositions[${index}][product_type_id]`, composition.product_type_id);
        formData.append(`compositions[${index}][quantity]`, composition.quantity);
        formData.append(`compositions[${index}][unit_id]`, composition.unit_id);
      });

      if (route.params.id) {
        await store.UPDATE_MEALS({
          id: route.params.id as string | number,
          data: formData,
        });
      } else {
        await store.CREATE_MEALS(formData);
      }

      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-dish");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

const changeInput = async (event, index) => {
  await store.GET_MEALS_VID_PRO({ parent_id: event, per_page: 100 });
  dataValue.value.compositions[index].vid_list = store.parentProductType?.product_types;
  dataValue.value.compositions[index].unit_id = null;
};

const getUnitId = (id: number) => {
  if (id) {
    return store.units.units.find((unit) => unit.id === id).name;
  }
};

const isDisabled = computed(() => {
  return route.name === "reference-view-id";
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const changeInputProduct = (val, index) => {

  dataValue.value.compositions[index].unit_id = dataValue.value.compositions[index].vid_list.find((e) => e.id === val).unit_id;
};
watch(() => dataValue.value.image, () => {
  console.log(dataValue.value.image);
});
</script>

<template>
  <AppOverlay :loading="loading">
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ t(route.meta.title) }}</h1>

    <div class="mt-[24px] flex items-start">
      <div class="w-[70%]">
        <div class="border rounded-[24px] p-[24px]">
          <!--          {{ existingImage }}-->
<!--          {{ dataValue.image }}-->
          <AppMediaUploader
            v-model="dataValue.image"
            :value="existingImage"
            class="mt-4"
          />

          <AppForm
            :value="dataValue"
            @validation="setValidation"
          >
            <div class="mt-[24px] grid grid-cols-2 gap-5">
              <app-input
                v-model="dataValue.name.ru"
                :label="$t('Наименование (Рус)')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] text-[12px]"
                required
                prop="name.ru"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.name.uz"
                :label="$t('Наименование (Ўзб)')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] text-[12px]"
                required
                prop="name.uz"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.number"
                :label="$t('kitchen.uniqueDishNumber')"
                :placeholder="$t('common.automatically')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                disabled
                :disabled="isDisabled"
              />

              <app-select
                v-model="dataValue.unit_id"
                :label="$t('common.measurement')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] text-[12px]"
                required
                prop="unit_id"
                itemValue="id"
                itemLabel="name"
                :items="store.units.units"
                :disabled="isDisabled"
              />
            </div>
          </AppForm>

          <template v-if="route.name === 'reference-view-id'">
            <el-table
              :data="dataValue.compositions"
              stripe
              class="custom-element-table mt-[40px]"
              :empty-text="$t('Нет доступных данных')"
            >
              <el-table-column
                prop="product_type_name"
                :label="$t('common.compound')"
              />
              <el-table-column
                prop="quantity"
                :label="$t('common.quantity')"
              />
              <el-table-column prop="product_type_id" :label="$t('common.measurement')">
                <template #default="scope">
                  {{ scope.row.unit_id ? getUnitId(scope.row.unit_id) : "-" }}
                </template>
              </el-table-column>
            </el-table>
          </template>

          <template v-else>
            <div class="mt-[24px]">
              <h1 class="text-[#000D24] text-[18px] font-medium">{{ $t("kitchen.compositionDish") }}</h1>

              <div class="bg-[#F8F9FC] rounded-[16px] p-[16px] mt-[24px]">
                <div class="grid grid-cols-4 gap-4 border-b mt-[16px]"
                     v-for="(item, index) in dataValue.compositions"
                     :key="index"
                >
                  <app-select
                    v-model="item.product_type_parent_id"
                    :label="$t('product.type')"
                    label-class="text-[#A8AAAE] text-[12px]"
                    :placeholder="$t('form.select')"
                    itemValue="id"
                    itemLabel="name"
                    :items="store.typeProduct.product_categories"
                    @change="changeInput($event, index)"
                  />

                  <app-select
                    v-model="item.product_type_id"
                    @change="changeInputProduct($event, index)"
                    :label="$t('product.view')"
                    label-class="text-[#A8AAAE] text-[12px]"
                    :placeholder="$t('form.select')"
                    itemValue="id"
                    itemLabel="name"
                    :items="item.vid_list"
                  />

                  <app-input
                    v-model="item.quantity"
                    :label="$t('common.quantity')"
                    label-class="text-[#A8AAAE] text-[12px]"
                    placeholder="0.0"
                  />

                  <div class="flex items-center">
                    <app-select
                      v-model="item.unit_id"
                      disabled
                      class="w-full"
                      :label="$t('common.measurement')"
                      label-class="text-[#A8AAAE] text-[12px]"
                      :placeholder="$t('form.select')"
                      itemValue="id"
                      itemLabel="name"
                      :items="store.units.units"
                    />

                    <button
                      class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[40px] ml-[16px] mt-2"
                      @click="handleDelete(index)"
                    >
                      <img src="@/assets/images/icons/delete.svg" alt="delete" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[12px]"
                @click="repeaterAgain"
              >
                <img
                  src="@/assets/images/icons/plus2.svg"
                  class="mr-[4px]"
                  alt="plus"
                />
                {{ $t("method.addMore") }}
              </button>
            </div>
          </template>
        </div>

        <div
          class="flex items-center justify-between mt-[24px]"
          v-if="route.name === 'reference-dish-create' || route.name === 'reference-dish-id'"
        >
          <button
            v-if="$can('delete', 'Button')"
            class="custom-danger-btn"
            v-show="route.name === 'reference-dish-id'"
            @click="deleteFn"
          >
            {{ $t("method.delete") }}
          </button>

          <div class="flex items-center justify-end ml-auto">
            <button
              class="custom-cancel-btn"
              @click="cancelFn"
            >
              {{ $t("method.cancel") }}
            </button>

            <button class="custom-apply-btn ml-[8px]" @click="handleSubmit">
              {{ route.name === "reference-dish-id" ? $t("method.save") : $t("method.add") }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="custom-light-btn flex items-center ml-[24px]"
        v-if="route.name === 'reference-view-id'"
        @click="router.push(`/reference-dish-edit/${route.params.id}`)"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="mr-[12px]"
        />
        {{ $t("method.edit") }}
      </button>
    </div>
  </AppOverlay>
</template>

<style scoped lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>