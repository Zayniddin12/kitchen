<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import { Name } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { useCommonStore } from "@/stores/common.store";

const kitchenStore = useKitchenStore();
const commonStore = useCommonStore();

const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();
const { t } = useI18n();

const existingImage = ref<string>("");

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const store = useSettingsStore();

interface Repeater {
  product_type_parent_id: string;
  product_vid: object;
  quantity: number;
  unit_id: string | number;
}

interface DataValue {
  name: Name;
  number: string;
  quantity: string;
  unit_id: string;
  image: string | File;
  compositions: Repeater[];
}

const dataValue = ref<DataValue>({
  name: new Name(),
  number: "",
  quantity: "",
  unit_id: "",
  image: "",
  compositions: [{
    product_type_parent_id: "",
    product_vid: {
      id: "",
      data: [],
    },
    quantity: 0,
    unit_id: "",
  }],
});

const mealData = ref<any>([{
  typeProduct: "",
  viewProduct: "",
  total: 0,
  unit: "",
}]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if(!kitchenStore.part) return;

  setBreadCrumb([{
    label: "kitchen.title",
    isTranslate: true,
  }, {
    label: kitchenStore.part.title,
  }, {
    label: kitchenStore.part.department_name,
    to: { name: "KitchenIndex" },
  }, {
    label: kitchenStore.part.kitchen_vid as string,
    isActionable: true,
    to: { name: "KitchenShow" },
  }, {
    label: kitchenStore.part.kitchen_type as string,
    isActionable: true,
  }, {
    label: "common.menu",
    isTranslate: true,
    to: { name: "KitchenMenuIndex" },
  }, {
    label: "kitchen.cookingDish",
    isTranslate: true,
    isActionable: true,
  }]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });


  setBreadCrumbFn();
}, { immediate: true });

const { confirm } = useConfirm();

const cancel = () => {
  confirm.cancel().then(response => {
    router.push({ name: "KitchenMenuIndex" });
  });
};

const changeInput = async (event: number | string, index: number) => {
  const responseVid = await store.GET_MEALS_VID_PRO({ parent_id: event });
  dataValue.value.compositions[index].product_vid.data = responseVid.product_types && responseVid.product_types;
};

const repeaterAgain = () => {
  dataValue.value.compositions.push({
    product_type_parent_id: "",
    product_vid: {
      id: "",
      data: [],
    },
    quantity: 0,
    unit_id: "",
  });
};

const handleDelete = (index: number) => {
  if(dataValue.value.compositions.length > 1) {
    confirm.delete().then(() => {
      dataValue.value.compositions.splice(index, 1);
    });
  }
};

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await store.GET_UNITS();
    await store.GET_TYPE_PRODUCT();

  } catch (e) {
    loading.value = false;
  } finally {

    loading.value = false;
  }

});

const loadingSubmit = ref(false);

const handleSubmit = async () => {
  if(!v$.value) return;

  if((await v$.value.validate())) {
    try {
      loadingSubmit.value = true;
      const formData = new FormData();
      formData.append("name[uz]", dataValue.value.name.uz);
      formData.append("name[ru]", dataValue.value.name.ru);
      // formData.append("number", dataValue.value.number);
      // formData.append('quantity', dataValue.value.quantity);
      formData.append("unit_id", dataValue.value.unit_id);
      formData.append("kitchen_id", route.params.child_id as string);

      if(dataValue.value.image) {
        formData.append("image", dataValue.value.image);
      }

      dataValue.value.compositions.forEach((composition, index) => {
        // formData.append(`compositions[${index}][product_type_parent_id]`, composition.product_type_parent_id);
        formData.append(`compositions[${index}][product_type_id]`, composition.product_vid.id);
        formData.append(`compositions[${index}][quantity]`, composition.quantity);
        formData.append(`compositions[${index}][unit_id]`, composition.unit_id);
      });


      await kitchenStore.CREATE_MEALS(formData);

      loadingSubmit.value = false;

      commonStore.successToast();
      await router.push(`/kitchen/${route.params.department_id}/free-kitchen/${route.params.kitchen_id}/${route.params.child_id}/menu`);
    } catch (e) {
      loadingSubmit.value = false;
    }
  }
};

const changeVid = (id: string | number, index: number) => {

  dataValue.value.compositions[index].unit_id = dataValue.value.compositions[index].product_vid.data.find(v => v.id === id).unit_id;
};

</script>

<template>
  <div>
    <h1 class="mb-6 text-[32px] text-[#000D24] font-semibold">{{ t("kitchen.cookingDish") }}</h1>

    <div class="border rounded-[24px] p-[24px]">
      <AppMediaUploader
        v-model="dataValue.image"
        :value="existingImage"
        accept="image/*"
        class="mt-4"
      />

      <!--      <pre>-->
      <!--        {{ dataValue }}-->
      <!--      </pre>-->

      <AppForm
        :value="dataValue"
        @validation="setValidation"
      >
        <div class="mt-[24px] grid grid-cols-2 gap-5">
          <app-input
            v-model="dataValue.name.ru"
            :label="t('common.name2Lang', {lang: t('lang.ru')})"
            label-class="text-[#A8AAAE] text-[12px]"
            required
            prop="name.ru"
          />

          <app-input
            v-model="dataValue.name.uz"
            :label="t('common.name2Lang', {lang: t('lang.uz')})"
            label-class="text-[#A8AAAE] text-[12px]"
            required
            prop="name.uz"
          />

          <app-input
            v-model="dataValue.number"
            :label="t('kitchen.uniqueDishNumber')"
            :placeholder="t('common.automatically')"
            label-class="text-[#A8AAAE] font-medium text-[12px]"
            disabled
          />

          <app-select
            v-model="dataValue.unit_id"
            :label="t('common.measurement')"
            label-class="text-[#A8AAAE] text-[12px]"
            required
            prop="unit_id"
            itemValue="id"
            itemLabel="name"
            :items="store.units.units"
          />
        </div>
      </AppForm>


      <div class="mt-[24px]">
        <h1 class="text-[#000D24] text-[18px] font-medium">{{ t("kitchen.compositionDish") }}</h1>

        <div class="bg-[#F8F9FC] rounded-[16px] p-[16px] mt-[24px]">
          <div
            class="grid grid-cols-4 gap-4 border-b mt-[16px]"
            v-for="(item, index) in dataValue.compositions"
            :key="index"
          >
            <app-select
              v-model="item.product_type_parent_id"
              :label="t('product.type')"
              label-class="text-[#A8AAAE] text-[12px]"
              itemValue="id"
              itemLabel="name"
              :items="store.typeProduct.product_categories"
              @change="changeInput($event, index)"
            />

            <app-select
              v-model="item.product_vid.id"
              @change="changeVid($event, index)"
              :label="t('product.view')"
              label-class="text-[#A8AAAE] text-[12px]"
              itemValue="id"
              itemLabel="name"
              :items="item.product_vid.data"
            />

            <app-input
              v-model="item.quantity"
              :label="t('common.quantity')"
              label-class="text-[#A8AAAE] text-[12px]"
            />

            <div class="flex items-center">
              <app-select
                v-model="item.unit_id"
                class="w-full"
                :label="t('common.measurement')"
                label-class="text-[#A8AAAE] text-[12px]"
                itemValue="id"
                itemLabel="name"
                disabled
                :items="store.units.units"
              />

              <button
                class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[40px] ml-[16px] mt-2"
                @click="handleDelete(index)"
              >
                <img
                  src="@/assets/images/icons/delete.svg"
                  alt="delete"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-[12px] flex items-center justify-between">
          <button
            @click="repeaterAgain"
            class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] text-[#2E90FA] text-[14px] font-medium py-[8px] px-[16px]"
          >
          <span
            :style="{
              maskImage: 'url(/icons/plusIcon.svg)',
              backgroundColor: '#2E90FA',
              color: '#2E90FA',
              width: '20px',
              height: '20px',
              maskSize: '20px',
              maskPosition: 'center',
              maskRepeat: 'no-repeat'
            }"
          ></span>
            {{t("method.addMore")}}
          </button>

          <!--          <div class="flex items-center gap-x-8">-->
          <!--            <div class="flex items-center gap-x-1 text-sm">-->
          <!--            <span class="text-cool-gray">-->
          <!--              Цена:-->
          <!--            </span>-->
          <!--              <strong class="font-semibold text-dark">-->
          <!--                25 000 сум-->
          <!--              </strong>-->
          <!--            </div>-->
          <!--            <div class="flex items-center gap-x-1 text-sm">-->
          <!--            <span class="text-cool-gray">-->
          <!--              НДС:-->
          <!--            </span>-->
          <!--              <strong class="font-semibold text-dark">-->
          <!--                3 000 сум-->
          <!--              </strong>-->
          <!--            </div>-->
          <!--            <div class="flex items-center gap-x-1 text-sm">-->
          <!--            <span class="text-cool-gray">-->
          <!--              Общая сумма:-->
          <!--            </span>-->
          <!--              <strong class="font-semibold text-dark">-->
          <!--                28 000 сум-->
          <!--              </strong>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>

        <div class="flex justify-end mt-[24px]">
          <ElButton
            size="large"
            class="!bg-[#E2E6F3] !border-none !text-dark-gray"
            @click="cancel"
          >
          {{t("method.cancel")}}
          </ElButton>
          <ElButton
            @click="handleSubmit"
            :loading="loadingSubmit"
            size="large"
            type="primary"
            class="!bg-blue-500"
          >
          {{t("common.sell")}}
            <!--    send btn text => Применить-->
          </ElButton>
        </div>

      </div>
    </div>

  </div>
</template>