<script
    setup
    lang="ts"
>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { DocumentProductType } from "@/modules/Document/document.types";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { useDocumentStore } from "@/modules/Document/document.store";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import { deepEqual, formatNumber } from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";

interface FormType {
  from_id: "" | number,
  number: string,
  products: DocumentProductType[],
}

const router = useRouter();
const { confirm } = useConfirm();

const settingsStore = useSettingsStore();
const documentStore = useDocumentStore();
const commonStore = useCommonStore();

const defaultProduct: DocumentProductType = {
  product_type_id: "",
  category_id: "",
  quantity: null,
  unit_id: "",
  price: null
};

const form = reactive<FormType>({
  from_id: "",
  number: "",
  products: [{ ...defaultProduct }]
});

const oldForm = ref<FormType>(JSON.parse(JSON.stringify(form)));

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const validationErrors = ref<Record<string, any> | null>(null);

const addProduct = () => {
  form.products.push({ ...defaultProduct });
};

const permissionProductDelete = computed(() => {
  return form.products.length > 1;
});

const deleteProduct = (index: number) => {
  if (!permissionProductDelete.value) return;

  confirm.delete().then(() => {
    form.products.splice(index, 1);
  });
};

const vidProducts = ref<Map<number, Record<string, any>[]>>(new Map);

const fetchVidProductsList = async (value: AppSelectValueType) => {

  if (typeof value !== "number") return;

  await settingsStore.GET_VID_PRODUCT({
    parent_id: value,
    per_page: 100
  });

  vidProducts.value.set(value, settingsStore.vidProduct.product_types);
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Контракты",
      to: { name: "contracts" }
    },
    {
      label: "Добавить",
      isActionable: true
    }
  ]);
};

const cancel = async () => {
  const isChange = !deepEqual(form, oldForm.value);

  if (isChange) {
    const response = await confirm.cancel();

    if (response === "save") {
      sendForm();
      return;
    }
  }

  v$.value?.clear();
  router.push({ name: "contracts" });
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm = {
    doc_type_id: 9,
    ...form
  };

  try {
    await documentStore.create(newForm as any);
    commonStore.successToast({ name: "contracts" });
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.fetchRespondents();
  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_UNITS();
});

</script>

<template>
  <h1 class="m-0 font-semibold text-[32px]">Добавить</h1>

  <AppForm
      :value="form"
      @validation="setValidation"
      :validation-errors
      class="border rounded-[24px] p-6 my-6"
      :submit="sendForm"
  >
    <div class="grid grid-cols-2 gap-6">
      <AppInput
          v-model="form.number"
          prop="number"
          label="№ контракта"
          label-class="text-[#A8AAAE] text-xs font-medium"
          required
      />
      <AppSelect
          v-model="form.from_id"
          prop="from_id"
          label-class="text-[#A8AAAE] text-xs font-medium"
          label="Поставщик"
          :items="settingsStore.respondents"
          item-label="name"
          item-value="id"
          :loading="settingsStore.respondentsLoading"
          required
      />
    </div>

    <div class="bg-[#F8F9FC] p-4 rounded-[16px] mt-2">
      <div
          class="flex items-end gap-x-5 border-b last:border-b-0 mb-4 last:mb-0"
          v-for="(product, index) in form.products"
          :key="index"
      >
        <div class="grid grid-cols-6 gap-x-5 w-[calc(100%-40px)]">
          <AppSelect
              v-model="product.category_id"
              :prop="`products[${index}].category_id`"
              placeholder="Выберите"
              label="Тип продукта"
              label-class="text-[#A8AAAE] text-xs font-medium"
              :items="settingsStore.typeProduct.product_categories"
              item-value="id"
              item-label="name"
              @change="fetchVidProductsList"
              required
          />
          <AppSelect
              v-model="product.product_type_id"
              :prop="`products[${index}].product_type_id`"
              :items="vidProducts.get(product.category_id as number)"
              item-label="name"
              item-value="id"
              placeholder="Выберите"
              label="Вид продукта"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
              :disabled="!product.category_id"
          />
          <AppInput
              v-model.number="product.quantity"
              :prop="`products[${index}].quantity`"
              label="Количество"
              type="number"
              label-class="text-[#A8AAAE] text-xs font-medium"
              placeholder="0"
              required
          />
          <AppSelect
              v-model="product.unit_id"
              :prop="`products[${index}].unit_id`"
              :items="settingsStore.units.units"
              item-label="name"
              item-value="id"
              label="Ед. измерения"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
          />
          <AppInput
              v-model.number="product.price"
              type="number"
              :prop="`products[${index}].price`"
              placeholder="0"
              label="Цена"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
          />
          <AppInput
              label="Сумма"
              label-class="text-[#A8AAAE] text-xs font-medium"
              :placeholder="product.quantity && product.price ? `${formatNumber(product.quantity*product.price)}` : '0'"
              disabled
          />
        </div>
        <button
            :disabled="!permissionProductDelete"
            class="bg-[#E2E6F3] size-10 rounded-[8px] p-[10px] mb-[19px] inline-flex items-center justify-center"
            @click.stop="deleteProduct(index)"
        >
          <img
              src="@/assets/images/icons/delete.svg"
              alt="delete"
          />
        </button>
      </div>
    </div>

    <button
        class="text-[#2E90FA] flex items-center mt-4 border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-xs font-medium"
        @click.stop="addProduct"
    >
      <img
          src="@/assets/images/icons/plus2.svg"
          class="mr-[4px]"
          alt="plus"
      />
      Добавить еще
    </button>
  </AppForm>

  <div class="flex items-center justify-end">
    <button
        class="custom-cancel-btn"
        @click="cancel"
    >
      Отменить
    </button>
    <button
        @click="sendForm"
        class="custom-apply-btn ml-[8px]"
    >Добавить
    </button>
  </div>
</template>

