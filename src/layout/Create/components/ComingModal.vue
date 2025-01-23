<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {
  DocumentCreateDataActType,
  DocumentCreateDataDocumentType, DocumentCreateDataType,
  DocumentProductType,
} from "@/modules/Document/document.types";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { computed, reactive, ref, watch } from "vue";
import {
  ModalPropsType,
  ModalValueType,
} from "@/layout/Create/components/modal.types";
import { useSettingsStore } from "@/modules/Settings/store";
import {
  deepEqual, filterObjectValues,
  formatDate2,
  formatNumber,
  togglePageScrolling,
} from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";
import deleteIcon from "@/assets/images/icons/delete-danger-icon.svg";
import { useDocumentStore } from "@/modules/Document/document.store";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import { useUsersStore } from "@/modules/Users/users.store";
import { UserType } from "@/modules/Users/users.types";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { useI18n } from "vue-i18n";

interface ProviderFormType {
  name: string;
  oked: number | null;
  address: string;
  tin: number | null;
  license: string;
  sertificate: string;
  sert_end_date: string;
  director: string;
  phone: string;
}

const commonStore = useCommonStore();

const model = defineModel<ModalValueType>();

const props = defineProps<ModalPropsType>();

const settingsStore = useSettingsStore();
const documentStore = useDocumentStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const { t } = useI18n();

const date = ref(formatDate2(new Date()));

const form = reactive<DocumentCreateDataDocumentType>({
  doc_type_id: null,
  date: "",
  number: "",
  from: "",
  from_id: null,
  from_type: "",
  to: "",
  to_id: null,
  to_type: "",
  subject: "",
  through_whom: "",
  basis: "",
  shipping_method: "",
  status: "",
  products: [
    {
      category_id: "",
      product_type_id: "",
      quantity: null,
      unit_id: "",
      price: null,
    },
  ],
});

const signersList = reactive<any>({
  warehouseman: [],
  merchandiser: [],
  manager_base: [],
  head_warehouse: [],
});

const formNumberAndDate = computed(() => {
  if (!form.number && !form.date) return "";
  return `${form.number} ${form.date}`;
});

const validationErrors = ref<Record<string, any> | null>({
  Document: {},
  Act: {},
});

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);


const actForm = reactive<any>({
  number: "",
  subject: "",
  content: "",
  shipping_method: "",
  products: [
    {
      product: {},
      quantity: null,
      count_product: null,
      contract_details: null,
      contract_details_date: null,
      manufacturer: null,
      shipping_method: null,
      licence: null,
      licence_date: null,
      sanitary: null,
      sanitary_date: null,
      vetirinary: null,
      vetirinary_date: null,
      quality: null,
      quality_date: null,
    },
  ],
  // doc_details: {
  //   licence: "",
  //   licence_date: "",
  //   sanitary: "",
  //   sanitary_date: "",
  //   vetirinary: "",
  //   vetirinary_date: "",
  //   quality: "",
  //   quality_date: "",
  //   contract_details: "",
  //   contract_details_date: "",
  //   manufacturer: "",
  // },
  doc_signers: [],
  doc_signer_obj: {
    signer_id_1: "",
    signer_id_2: "",
    signer_id_3: "",
    signer_id_4: "",
    signer_id_5: "",
  },
});

const oldActForm = ref<DocumentCreateDataActType | null>(null);

const from = computed<string>(() => {
  if (!form.from_id || !form.from_type) return "";
  const activeEl = settingsStore.respondents.find(
    el => el.model_type === form.from_type && el.id === form.from_id,
  );

  if (!activeEl) return "";

  return activeEl.name;
});

const to = computed<string>(() => {
  if (!form.to_id || !form.to_type) return "";
  const activeEl = settingsStore.respondents.find(
    el => el.model_type === form.to_type && el.id === form.to_id,
  );

  if (!activeEl) return "";

  return activeEl.name;
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const actV$ = ref<ValidationType | null>(null);

const setActValidation = (validation: ValidationType) => {
  actV$.value = validation;
};

const clearValidations = () => {
  v$.value?.clear();
  actV$.value?.clear();
  actForm.products = [];
  form.to = "";
  form.from = "";
  form.to_type = "";
  form.to_id = null;
  form.from_type = "";
  form.from_id = null;

};

const sendForm = async () => {
  if (!v$.value || (activeComingModal.value && !actV$.value)) return;

  const isMainValid = await v$.value.validate();
  const isModalValid = activeComingModal.value ? await actV$.value?.validate() : true;

  if (!isMainValid || !isModalValid) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  form.products.forEach((formProduct, formIndex) => {
    actForm.products[formIndex] = {
      ...actForm.products[formIndex],
      ...formProduct,
    };
  });


  const newForm: DocumentCreateDataType = {
    Document: JSON.parse(JSON.stringify(form)),
  };

  delete newForm.Document.from;
  delete newForm.Document.to;

  newForm.Act = JSON.parse(JSON.stringify(actForm));

  newForm.Act && newForm.Act.products && newForm.Act.products.forEach(item => {
    delete item.product;
  });

  if (newForm.Act && newForm.Act.doc_signer_obj) {
    const signerKeys = ["signer_id_1", "signer_id_2", "signer_id_3", "signer_id_4", "signer_id_5"] as const;

    newForm.Act.doc_signers = signerKeys
      .filter((key) => newForm.Act!.doc_signer_obj![key]) // Faqat qiymati borlarini olish
      .map((key) => ({
        signer_id: +newForm.Act!.doc_signer_obj![key] as number,
      }));

    delete newForm.Act.doc_signer_obj;
  }

  if (!activeComingModal.value) {
    delete newForm.Document.subject;
    delete newForm.Document.status;
    delete newForm.Act?.content;
    delete newForm.Act?.number;
    delete newForm.Act?.products;
    delete newForm.Act?.shipping_method;
    delete newForm.Act?.subject;
  }

  console.log(newForm);
  await documentStore.create(filterObjectValues(newForm)).then(() => {
    commonStore.successToast();
    model.value = false;
    clearValidations();
    validationErrors.value = {
      Document: {},
      Act: {},
    };
  }).catch((error: any) => {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  });
};

const vidProducts = ref<Map<number, Record<string, any>[]>>(new Map);

const fetchVidProductsList = async (product: DocumentProductType) => {

  if (typeof product.category_id !== "number") return;

  await settingsStore.GET_VID_PRODUCT({
    parent_id: product.category_id,
    per_page: 100,
  });

  vidProducts.value.set(product.category_id, settingsStore.vidProduct.product_types);
  product.product_type_id = "";
  product.unit_id = "";
};

const inputQuantity = (index: number, e: string | null) => {

  actForm.products[index].quantity = e;
};

const changeProduct = async (product: DocumentProductType, index: number) => {
  // console.log(product, e);
  if (!(product.product_type_id && product.category_id)) return;

  const activeVidProducts = vidProducts.value.get(product.category_id);

  if (!activeVidProducts) return;

  const activeVidProduct = activeVidProducts.find(el => el.id === product.product_type_id);

  if (!activeVidProduct) return;

  actForm.products[index].product = activeVidProduct;

  product.unit_id = activeVidProduct.unit_id;
};

const getProductTypeTitle = (category_id: number, product_type_id: number) => {
  const vidProduct = vidProducts.value.get(category_id);

  if (!vidProduct) return "";

  const product_type = vidProduct.find(el => el.id === product_type_id);

  if (!product_type) return "";

  return product_type.name;
};

const getProductMeasurement = (id: number) => {
  return (
    settingsStore.units.units.find((el: Record<string, any>) => el.id === id)
      ?.name ?? ""
  );
};

const productsTotalSum = computed(() => {
  return form.products?.reduce((sum: number, product: DocumentProductType) => {
    return (
      sum +
      Number(
        product.price && product.quantity ? product.price * product.quantity : 0,
      )
    );
  }, 0);
});

const createProduct = () => {
  actForm.products.push({
    product: {},
    count_product: null,
    contract_details: null,
    contract_details_date: null,
    manufacturer: null,
    shipping_method: null,
    licence: null,
    licence_date: null,
    sanitary: null,
    sanitary_date: null,
    vetirinary: null,
    vetirinary_date: null,
    quality: null,
    quality_date: null,

  });
  form.products?.push({
    category_id: "",
    product_type_id: "",
    quantity: null,
    unit_id: "",
    unit: "",
    price: null,
  });
};

const activeComingModal = computed(() => props.id === 7);

const deleteProduct = (index: number) => {
  form.products?.splice(index, 1);
  actForm.products.splice(index, 1);
};

const fetchRespondents = (params: any) => {
  settingsStore.fetchRespondents(params);
};

const selectedProductTypes = computed(() => {
  const appSelectedProductTypes: Record<string, any>[] = [];

  form.products?.forEach(el => {
      if (el.category_id && el.product_type_id) {
        const vidProduct = vidProducts.value.get(el.category_id);
        if (vidProduct) {
          const childProduct = vidProduct.find(element => element.id === el.product_type_id);
          if (childProduct) appSelectedProductTypes.push(childProduct);
        }
      }
    },
  );

  return appSelectedProductTypes;
});

const activeProductType = ref<null | Record<string, any>>(null);

const actProductTypeChange = (value: AppSelectValueType) => {
  if (typeof value !== "number") return;

  const selectedProductType = selectedProductTypes.value.find(el => el.id === value);

  activeProductType.value = selectedProductType ?? null;

  if (selectedProductType) {
    const product = form.products?.find(el => el.product_type_id === value);
    if (product) {
      actForm.products[0] = product;
    }
  }
};

const selectedUsers = ref<Map<number, UserType>>(new Map());

const getUser = (id: number): UserType | null => {
  if (!usersStore.users?.users) return null;

  if (selectedUsers.value.has(id)) return selectedUsers.value.get(id) as UserType;

  const user: UserType | undefined = usersStore.users.users.find(user => user.id === id);

  if (!user) return null;

  selectedUsers.value.set(id, user);

  return user;
};

const { confirm } = useConfirm();

const closeModal = async () => {
  const documentFormIsChange = oldForm.value && !deepEqual(form, oldForm.value);
  const actFormIsChange = oldActForm.value && !deepEqual(actForm, oldActForm.value);

  try {
    if (documentFormIsChange || (activeComingModal.value && actFormIsChange)) {
      await confirm.cancel({ disabledBody: true, disabledBtn: "save" });
    }

    clearValidations();
    model.value = false;
  } catch (error) {
  }
};

const fromList = ref<any>([]);
const toList = ref<any>([]);

const openModal = async () => {
    form.doc_type_id = props.id;


    if (authStore.disabledUserWorkplace) {
      console.log(authStore.user);
      const activeWorkplace = authStore.user.workplaces[0];
      const type = activeComingModal.value ? "to" : "from";
      form[`${type}_id`] = activeWorkplace.workplace_id;
      form[`${type}_type`] = activeWorkplace.workplace_type;
      // await fetchRespondents({ type: [activeWorkplace.workplace_type] });

      await settingsStore.fetchRespondents({ type: [activeWorkplace.workplace_type], per_page: 100 });
      toList.value = settingsStore.respondents;
      await settingsStore.fetchRespondents({ type: ["provider"], per_page: 100 });
      fromList.value = settingsStore.respondents;

      form[type] = `${activeWorkplace.workplace_id}_${activeWorkplace.workplace_type}`;
    }

    await settingsStore.GET_TYPE_PRODUCT();
    await settingsStore.GET_UNITS();

    oldForm.value = JSON.parse(JSON.stringify(form));
    if (activeComingModal.value) {
      oldActForm.value = JSON.parse(JSON.stringify(actForm));
    }
    // signersList.warehouseman = await usersStore.fetchUsers({
    //   per_page: 100,
    //   role_name: "accountant-base-warehouse",
    // });

    signersList.merchandiser = await usersStore.fetchUsers({
      per_page: 100,
      role_name: "merchandiser",
    });

    signersList.manager_base = await usersStore.fetchUsers({
      per_page: 100,
      role_name: "manager-base",
    });

    signersList.head_warehouse = await usersStore.fetchUsers({
      per_page: 100,
      role_name: "head-warehouse",
    });
  }
;

watch(model, newValue => {
  if (newValue) openModal();
});

const respondentChange = (value: string, type: "from" | "to") => {
  console.log(value);
  const values = value.split("_");
  form.from = value;
  form[`${type}_id`] = Number(values[0]);
  form[`${type}_type`] = values[1];
};

const providerForm = reactive<ProviderFormType>({
  name: "",
  oked: null,
  address: "",
  tin: null,
  license: "",
  sertificate: "",
  sert_end_date: "",
  director: "",
  phone: "",
});

const oldProviderForm = ref<null | ProviderFormType>(null);

const providerV$ = ref<null | ValidationType>(null);

const clearProviderV$ = () => {
  if (!providerV$.value) return;

  providerV$.value.clearValidate();
  providerV$.value.resetForm();
};

const sendProviderForm = async () => {
  if (!providerV$.value) return;

  if (!(await providerV$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  const newForm = { ...providerForm };
  newForm.phone = `998${newForm.phone}`;

  await settingsStore.CREATE_PROVIDERS(newForm);
  providerCreateModal.value = false;
  clearProviderV$();
  commonStore.successToast();
  fetchRespondents();
};

const providerCreateModal = ref<boolean>(false);

const providerCreateModalClose = async () => {
  if (
    oldProviderForm.value &&
    !deepEqual(providerForm, oldProviderForm.value)
  ) {
    const response = await confirm.cancel();

    if (response === "save") {
      await sendProviderForm();
      return;
    } else {
      clearProviderV$();
    }

    togglePageScrolling(true);
  }

  providerCreateModal.value = false;
};

const providerCreateModalOpen = () => {
  oldProviderForm.value = { ...providerForm };
};

watch(providerCreateModal, newMProviderModal => {
  if (newMProviderModal) providerCreateModalOpen();
});


const activeProduct = ref(1);
const activeActProduct = ref(1);
const value = ref(null);

const changeUser = (val, key) => {
  console.log(val);
  actForm.doc_signer_obj[key] = val;
};

</script>

<template>
  <el-dialog
    v-model="model"
    :show-close="false"
    class="w-[75%]"
    align-center
    append-to-body
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">
        {{ t(activeComingModal ? "document.coming.createComing" : "document.coming.createConsumption") }}
      </div>
    </template>
    <div class="flex gap-x-6 flex-wrap mb-4">
      <div class="w-[60%] flex flex-col gap-y-10">
        <div
          :class="['border-[#E2E6F3] bg-[#fff] border rounded-[15px] grow', `${activeComingModal ? 'min-h-[1258.63px]' : 'min-h-[1753.56px]'}`]"
        >
          <div class="px-[72px] pb-[150px]">
            <header class="flex items-center justify-center my-[24px] mb-6">
              <img
                src="@/assets/images/logo.svg"
                alt="logo"
              />
              <div class="flex flex-col ml-3">
                <b class="text-[#000D24] text-lg">
                  {{ t("logo.title") }}
                </b>
                <span class="text-[#CBCCCE]">
                  {{ t("logo.subtitle") }}
                </span>
              </div>
            </header>
            <h2
              class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]"
            >
              {{ t("document.overhead") }}
            </h2>

            <div class="flex mb-[8px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.dateCreatedSystem") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ date }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.invoiceNumberSystem") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                NK-00000
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.invoiceDate") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.date }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.invoiceNumber") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.number }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.type") }}
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ name }}
              </span>
            </div>

            <div class="flex items-center mb-[8px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.whom.from") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ from }}
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.whom.to") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ to }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-medium whitespace-nowrap">
                {{ t("document.whom.through") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.through_whom }}
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.base") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.basis }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-medium">
                {{ t("document.shippingMethod") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.shipping_method }}
              </span>
            </div>

            <el-table
              :data="form.products"
              stripe
              class="custom-element-table custom-element-table--has-append mb-6"
              header-cell-class-name="custom-cell-header"
              cell-class-name="custom-cell-header"
              :empty-text="t('common.empty')"
            >
              <el-table-column
                prop="title"
                :label="t('common.name')"
                class="!p-0"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.product_type_id
                      ? getProductTypeTitle(row.category_id as number, row.product_type_id as number)
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                :label="t('common.quantity')"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{ row.quantity ?? "-" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="measurement"
                :label="t('common.measurement')"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.unit_id
                      ? getProductMeasurement(row.unit_id as number)
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                :label="t('common.price')"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.price ? `${formatNumber(row.price as number)} ${t("currency.sum")}` : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="total_price"
                :label="t('common.sum')"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.price && row.quantity
                      ? `${formatNumber(
                        (row.price * row.quantity) as number,
                      )} ${t("currency.sum")}`
                      : "-"
                  }}
                </template>
              </el-table-column>

              <template
                v-if="productsTotalSum"
                #append
              >
                <div class="flex items-center justify-end p-4">
                  <h2 class="text-[#8F9194] text-sm font-bold mr-[5px]">
                    {{ t("common.totalSum") }}:
                  </h2>
                  <h2 class="text-[#000D24] text-sm font-bold mr-5">
                    {{ formatNumber(productsTotalSum) }} {{ t("currency.sum") }}
                  </h2>
                </div>
              </template>
            </el-table>
            <template v-if="!activeComingModal">
              <div class="flex items-center justify-between mb-[24px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">
                  {{ t("document.commission.storekeeper") }}:
                </h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_1 && typeof (actForm.doc_signer_obj.signer_id_1) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_1)) : ""
                  }}
              </span>
              </div>

              <div class="flex items-center justify-between mb-[24px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">
                  {{ t("document.commission.commodityExpert") }}:
                </h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_2 && typeof (actForm.doc_signer_obj.signer_id_2) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_2)) : ""
                  }}
              </span>
              </div>
              <div class="flex items-center justify-between mb-[24px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">
                  {{ t("document.commission.forwarder") }}:
                </h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                    actForm.doc_signer_obj.signer_id_3 && typeof (actForm.doc_signer_obj.signer_id_3) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_3)) : ""
                  }}
              </span>
              </div>


              <div class="flex items-center justify-between mb-[24px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">
                  {{ t("document.commission.warehouseManager") }}:
                </h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                    actForm.doc_signer_obj.signer_id_4 && typeof (actForm.doc_signer_obj.signer_id_4) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_4)) : ""
                  }}
              </span>
              </div>

              <div class="flex items-center justify-between mb-[24px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">
                  {{ t("document.commission.baseChief") }}:
                </h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_5 && typeof (actForm.doc_signer_obj.signer_id_5) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_5)) : ""
                  }}
              </span>
              </div>
            </template>
          </div>
        </div>

      </div>
      <div :class="['min-w-[403px] w-[calc(40%-24px)] flex flex-col', `${activeComingModal ? 'gap-y-10' : 'gap-y-6'}`]">
        <AppForm
          :value="form"
          @validation="setValidation"
          @submit.prevent
          :validation-errors="validationErrors?.Document ?? null"
          :class="[{'min-h-[830px]': activeComingModal}]"
        >
          <AppInput
            :placeholder="t('document.coming.incomingConsignment')"
            :label="t('document.title')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppDatePicker
            :placeholder="date"
            :label="t('document.creationDate')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            :placeholder="t('common.automatically')"
            :label="t('document.invoiceNumberSystem')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            v-model="form.number"
            prop="number"
            :placeholder="t('document.invoiceNumber')"
            :label="t('document.invoiceNumber')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
            :max="20"
            :maxlength="20"
          />
          <AppDatePicker
            v-model="form.date"
            prop="date"
            :placeholder="t('document.invoiceDate')"
            :label="t('document.invoiceDate')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />

          <AppSelect
            v-model="form.from"
            prop="from"
            :placeholder="t('document.whom.from')"
            :label="t('document.whom.from')"
            :items="fromList"
            :loading="settingsStore.respondentsLoading"
            label-class="text-[#A8AAAE] text-xs font-medium"
            @change="(value) => respondentChange(value as string, 'from')"
            required
            :disabled="authStore.disabledUserWorkplace && !activeComingModal"
            trigger="blur"
          >
            <template v-if="activeComingModal">
              <ElOption
                v-for="item in fromList"
                :key="`${item.id}_${item.model_type}`"
                :value="`${item.id}_${item.model_type}`"
                :label="item.name"
              />
            </template>
            <template v-else-if="authStore.user">
              <ElOption
                v-for="item in authStore.user.workplaces"
                :key="`${item.workplace_type}_${item.workplace_type}`"
                :value="`${item.workplace_id}_${item.workplace_type}`"
                :label="item.workplace"
              />
            </template>
            <template
              v-if="activeComingModal"
              #footer
            >
              <button
                @click.stop="providerCreateModal = true"
                class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-sm font-medium py-[10px]"
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
                      maskRepeat: 'no-repeat',
                    }"
                  ></span>
                {{ t("method.add") }}
              </button>
            </template>
          </AppSelect>
          <!--{{settingsStore.respondents}}-->
          <AppSelect
            v-model="form.to"
            prop="to"
            :placeholder="t('document.whom.to')"
            :label="t('document.whom.to')"
            :loading="authStore.userLoading"
            label-class="text-[#A8AAAE] text-xs font-medium"
            @change="(value) => respondentChange(value as string, 'to')"
            required
            trigger="blur"

          >
            <!--            :disabled="authStore.disabledUserWorkplace && activeComingModal"-->
            <template v-if="activeComingModal">
              <ElOption
                v-for="item in toList"
                :key="`${item.id}_${item.model_type}`"
                :value="`${item.id}_${item.model_type}`"
                :label="item.name"
              />
            </template>
            <template v-else>
              <ElOption
                v-for="item in authStore.user.workplaces"
                :key="`${item.workplace_type}_${item.workplace_type}`"
                :value="`${item.workplace_id}_${item.workplace_type}`"
                :label="item.workplace"
              />
            </template>
            <!--            <template #footer>-->
            <!--              <button-->
            <!--                @click.stop="providerCreateModal = true"-->
            <!--                class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-sm font-medium py-[10px]"-->
            <!--              >-->
            <!--                  <span-->
            <!--                    :style="{-->
            <!--                      maskImage: 'url(/icons/plusIcon.svg)',-->
            <!--                      backgroundColor: '#2E90FA',-->
            <!--                      color: '#2E90FA',-->
            <!--                      width: '20px',-->
            <!--                      height: '20px',-->
            <!--                      maskSize: '20px',-->
            <!--                      maskPosition: 'center',-->
            <!--                      maskRepeat: 'no-repeat',-->
            <!--                    }"-->
            <!--                  ></span>-->
            <!--                Добавить-->
            <!--              </button>-->
            <!--            </template>-->
          </AppSelect>
          <AppInput
            v-model="form.through_whom"
            prop="through_whom"
            :placeholder="t('document.whom.through')"
            :label="t('document.whom.through')"
            label-class="text-[#A8AAAE] text-xs font-medium"
          />
          <AppInput
            v-model="form.basis"
            prop="basis"
            :placeholder="t('document.base')"
            :label="t('document.base')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />
          <AppInput
            v-model="form.shipping_method"
            prop="shipping_method"
            :placeholder="t('document.shippingMethod')"
            :label="t('document.shippingMethod')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />
          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
            <el-collapse class="border-none product" v-model="activeProduct" accordion>
              <el-collapse-item class="border-none relative" v-for="(product, index) in form.products"
                                :key="index + 1" :name="index + 1">
                <template #title>
                  <div
                    class="flex items-center justify-between mb-[16px] text-sm font-medium"
                  >
                    <strong class="text-[#4F5662]">
                      <template v-if="form.products && form.products.length > 1">
                        {{ index + 1 }}.
                      </template>
                      {{ t("document.tableReceivedProducts") }}
                    </strong>
                    <button
                      v-if="form.products && form.products.length > 1"
                      @click.stop="deleteProduct(index)"
                      class="flex items-center gap-x-1 absolute right-0"
                    >
                      <svg
                        :data-src="deleteIcon"
                        class="size-5"
                      />
                      <!--                      <span class="text-[#EA5455]">-->
                      <!--                    {{ t("method.delete") }}-->
                      <!--                  </span>-->
                    </button>
                  </div>
                </template>
                <div>
                  <AppSelect
                    v-model="product.category_id"
                    :prop="`products[${index}].category_id`"
                    :items="settingsStore.typeProduct.product_categories"
                    item-value="id"
                    item-label="name"
                    :label="t('product.type')"
                    :placeholder="t('product.type')"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                    @change="fetchVidProductsList(product)"
                    required
                    trigger="blur"
                  />
                  <!--                  {{ vidProducts.get(product.category_id as number)[0] }}-->
                  <AppSelect
                    v-model="product.product_type_id"
                    :prop="`products[${index}].product_type_id`"
                    :items="vidProducts.get(product.category_id as number)"
                    item-label="name"
                    item-value="id"
                    :label="t('product.view')"
                    :placeholder="t('product.view')"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                    required
                    :disabled="!product.category_id"
                    @change="changeProduct(product, index)"
                  />
                  <div class="grid grid-cols-2 gap-x-4">
                    <AppInput
                      v-model="product.quantity"
                      @input="inputQuantity(index, product.quantity)"
                      custom-type="number"
                      :prop="`products[${index}].quantity`"
                      :placeholder="t('common.quantity')"
                      :label="t('common.quantity')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                    />
                    <AppInput
                      v-model="product.unit_id"
                      :prop="`products[${index}].unit_id`"
                      :placeholder="t('common.measurement')"
                      :label="t('common.measurement')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                      disabled
                    />
                  </div>
                  <AppInput
                    v-model.number="product.price"
                    type="number"
                    :prop="`products[${index}].price`"
                    :placeholder="t('common.price')"
                    :label="t('common.price')"
                    label-class="text-[#A8AAAE] text-xs font-medium"
                    required
                  />
                </div>
              </el-collapse-item>
            </el-collapse>

            <button
              @click.stop="createProduct"
              class="mt-6 flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-sm font-medium py-[10px]"
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
                    maskRepeat: 'no-repeat',
                  }"
                ></span>
              {{ t("method.add") }}
            </button>
          </div>

        </AppForm>

      </div>
    </div>

    <div class="flex gap-x-6 flex-wrap">
      <div class="w-[60%] flex flex-col gap-y-10">
        <div
          v-if="activeComingModal"
          class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] min-h-[2249.5px]"
        >
          <div class="px-[72px] pb-[150px]">
            <header class="flex items-center justify-center my-[24px] mb-6">
              <img
                src="@/assets/images/logo.svg"
                alt="logo"
              />
              <div class="flex flex-col ml-3">
                <b class="text-[#000D24] text-lg">{{ t("logo.title") }}</b>
                <span class="text-[#CBCCCE]">{{ t("logo.subtitle") }}</span>
              </div>
            </header>
            <h2
              class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]"
            >
              {{ t("document.act.title") }}
            </h2>
            <div class="flex items-center justify-between mb-[24px]">
              <div class="flex items-center mb-[8px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">№:</h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                  {{ actForm.number }}
                </span>
              </div>
              <div class="flex items-center mb-[8px]">
                <h2 class="text-[#4F5662] text-sm font-semibold">{{ t("common.date") }}:</h2>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                  {{ date }}
                </span>
              </div>
            </div>
            <div
              v-if="actForm.content"
              class="text-[#4F5662] text-[14px]"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ actForm.content }}
            </div>
            <span
              class="block text-[#4F5662] text-sm font-normal leading-[20px] mb-[24px]"
            >
<!--              {{ actForm.products }}-->
            </span>
            <div class="overflow-x-auto mb-[24px]">
              <el-collapse accordion class="border-none" v-model="activeActProduct">
                <el-collapse-item class="w-full mb-4 !border-0 !bg-[#F8F9FC] rounded-[8px] overflow-hidden act-left"
                                  v-for="(item, index) in actForm.products"
                                  :title="'Продукт ' + (index + 1)"
                                  :name="index + 1">
                  <table
                    class="mt-4 min-w-full border border-gray-300 bg-white text-left text-sm text-gray-900 rounded-[8px] border-separate table-my border-spacing-0"
                  >
                    <colgroup>
                      <col class="w-[60%]">
                    </colgroup>
                    <tbody>
                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("product.name") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">{{ item.product.name ? item.product.name : "" }}</td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("product.quantity") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.quantity ? formatNumber(item.quantity) : "" }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("common.unitMeasurement") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.product.unit_id ? getProductMeasurement(item.product.unit_id) : "" }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("document.act.numberDateAgreement") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.contract_details }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("document.consignmentNumberDate") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ formNumberAndDate }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("product.manufacturer") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">{{ item.manufacturer }}</td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">{{ t("common.supplier") }}</td>
                      <td class="p-2 border-b border-gray-300">
                        {{ from }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("common.recipient") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">{{ to }}</td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("common.transport") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">{{ item.shipping_method }}</td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("licence.numberAndDate") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.licence }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("document.numberAndDateOfTheConclusionOfTheSanitaryAndEpidemiologicalCenter") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.sanitary }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("document.numberAndDateOfVeterinaryCertificate") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.vetirinary }}
                      </td>
                    </tr>

                    <tr class="border-gray-300">
                      <td class="border-r border-b p-2 font-medium">
                        {{ t("document.numberAndDateOfQualityCertificate") }}
                      </td>
                      <td class="p-2 border-b border-gray-300">
                        {{ item.quality }}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-semibold">
                {{ t("document.commission.storekeeper") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                  actForm.doc_signer_obj.signer_id_1 && typeof (actForm.doc_signer_obj.signer_id_1) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_1)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-semibold">
                {{ t("document.commission.commodityExpert") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                  actForm.doc_signer_obj.signer_id_2 && typeof (actForm.doc_signer_obj.signer_id_2) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_2)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-semibold">
                {{ t("document.commission.warehouseManager") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                  actForm.doc_signer_obj.signer_id_4 && typeof (actForm.doc_signer_obj.signer_id_4) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_4)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h2 class="text-[#4F5662] text-sm font-semibold">
                {{ t("document.commission.baseChief") }}:
              </h2>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                  actForm.doc_signer_obj.signer_id_5 && typeof (actForm.doc_signer_obj.signer_id_5) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_5)) : ""
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div :class="['min-w-[403px] w-[calc(40%-24px)] flex flex-col', `${activeComingModal ? 'gap-y-10' : 'gap-y-6'}`]">
        <!--        {{ actForm }}-->
        <AppForm
          :value="actForm"
          @validation="setActValidation"
          @submit.prevent
          :validation-errors="validationErrors?.Act ?? null"
        >
          <template v-if="activeComingModal">
            <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">
              <div class="grid grid-cols-2 gap-x-4">
                <AppInput
                  :placeholder="t('document.act.title')"
                  :label="t('document.act.title')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
                />

                <AppInput
                  :placeholder="t('common.automatically')"
                  :label="t('document.invoiceNumberSystem')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  disabled
                />
              </div>

              <AppInput
                v-model="actForm.number"
                prop="number"
                placeholder="АКТ-00000"
                :label="t('document.act.number')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :max="20"
                :maxlength="20"
              />

              <span class="block text-[#4F5662] text-sm font-medium mb-[16px]">
                {{ t("document.act.contents") }}
              </span>

              <AppInput
                v-model="actForm.content"
                prop="content"
                :placeholder="t('document.act.specifiedContentText')"
                type="textarea"
                :rows="5"
                required
                :maxlength="1000"
                :max="1000"
              />

            </div>

            <div class="mb-4">
              <el-collapse class="border-0" accordion v-model="activeActProduct">
                <el-collapse-item class=" w-full mb-4 !border-0 act-right rounded-[16px] overflow-hidden"
                                  v-for="(item, index) in actForm.products"
                                  :title="'Продукт ' + (index + 1)"
                                  :name="index + 1">
                  <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">

                    <!--                    {{ form.products }}-->
                    <!--                                        {{ selectedProductTypes }}-->
                    <!--                    {{  actList }}-->
                    <AppInput
                      :modelValue="item.product.name"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      :placeholder="t('product.name')"
                      :label="t('product.name')"
                      disabled
                    />
                    <AppInput
                      :modelValue="item.quantity"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      :placeholder="t('product.quantity')"
                      :label="t('product.quantity')"
                      disabled
                    />
                    <AppInput
                      :modelValue="item.product.unit"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      :label="t('common.unitMeasurement')"
                      :placeholder="t('common.unitMeasurement')"
                      disabled
                    />
                    <AppInput
                      v-model="item.contract_details"
                      :prop="`products[${index}]['contract_details']`"
                      :placeholder="t('document.act.numberAgreement')"
                      :label="t('document.act.numberAgreement')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                      :maxlength="20"
                      :max="20"
                    />
                    <AppDatePicker
                      v-model="item.contract_details_date"
                      :prop="`products[${index}]['contract_details_date']`"
                      :placeholder="t('document.act.dateAgreement')"
                      :label="t('document.act.dateAgreement')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                    />
                    <AppInput
                      v-model="formNumberAndDate"
                      :placeholder="t('document.consignmentNumberDate')"
                      :label="t('document.consignmentNumberDate')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      disabled
                    />
                    <AppInput
                      v-model="item.manufacturer"
                      :prop="`products[${index}]['manufacturer']`"
                      :placeholder="t('product.manufacturer')"
                      :label="t('product.manufacturer')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                    />
                    <AppInput
                      :model-value="from"
                      :label="t('common.supplier')"
                      :placeholder="t('common.supplier')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      disabled
                    />

                    <AppInput
                      v-model="item.shipping_method"
                      :prop="`products[${index}]['shipping_method']`"
                      :placeholder="t('common.transport')"
                      :label="t('common.transport')"
                      label-class="text-[#A8AAAE] text-xs font-medium"
                      required
                    />
                    <div class="grid grid-cols-2 gap-4">
                      <AppInput
                        v-model="item.licence"
                        :prop="`products[${index}]['licence']`"
                        :placeholder="t('licence.number')"
                        :label="t('licence.number')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                        :max="20"
                        :maxlength="20"
                      />
                      <AppDatePicker
                        v-model="item.licence_date"
                        :prop="`products[${index}]['licence_date']`"
                        :placeholder="t('licence.date')"
                        :label="t('licence.date')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                      />
                      <AppInput
                        v-model="item.sanitary"
                        :prop="`products[${index}]['sanitary']`"
                        :placeholder="t('document.sanitaryConclusion.number')"
                        :label="t('document.sanitaryConclusion.number')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                        :max="20"
                      />
                      <AppDatePicker
                        v-model="item.sanitary_date"
                        :prop="`products[${index}]['sanitary_date']`"
                        :placeholder="t('document.sanitaryConclusion.date')"
                        :label="t('document.sanitaryConclusion.date')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                      />
                      <AppInput
                        v-model="item.vetirinary"
                        :prop="`products[${index}]['vetirinary']`"
                        :placeholder="t('document.veterinaryCertificate.number')"
                        :label="t('document.veterinaryCertificate.number')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                        :max="20"
                      />
                      <AppDatePicker
                        v-model="item.vetirinary_date"
                        :prop="`products[${index}]['vetirinary_date']`"
                        :placeholder="t('document.veterinaryCertificate.date')"
                        :label="t('document.veterinaryCertificate.date')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                      />
                      <AppInput
                        v-model="item.quality"
                        :prop="`products[${index}]['quality']`"
                        :placeholder="t('document.qualityCertificate.number')"
                        :label="t('document.qualityCertificate.number')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                        :max="20"
                        :maxlength="20"
                      />
                      <AppDatePicker
                        v-model="item.quality_date"
                        :prop="`products[${index}]['quality_date']`"
                        :placeholder="t('document.qualityCertificate.date')"
                        :label="t('document.qualityCertificate.date')"
                        label-class="text-[#A8AAAE] text-xs font-medium"
                        required
                      />
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>

          </template>

          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
            <strong class="block text-[#4F5662] text-sm font-medium mb-4">
              {{ t("document.commission.title") }}
            </strong>
            <!--            {{ actForm.doc_signer_obj }}-->
            <div class="flex flex-col">
              <!--              <AppSelect-->
              <!--                v-model="actForm.doc_signer_obj.signer_id_1"-->
              <!--                prop="doc_signer_obj.signer_id_1"-->
              <!--                :label="t('document.commission.accountant')"-->
              <!--                :placeholder="t('document.commission.accountant')"-->
              <!--                label-class="text-[#A8AAAE] text-xs font-medium"-->
              <!--                required-->
              <!--                @change="changeUser($event, 'signer_id_1')"-->
              <!--              >-->
              <!--                <template v-if="signersList.warehouseman.users">-->
              <!--                  <ElOption-->
              <!--                    v-for="item in signersList.warehouseman.users"-->
              <!--                    :key="item.id"-->
              <!--                    :label="usersStore.getUserFullName(item)"-->
              <!--                    :value="item.id"-->
              <!--                  />-->
              <!--                </template>-->
              <!--              </AppSelect>-->
              <AppSelect
                v-model="actForm.doc_signer_obj.signer_id_1"
                prop="doc_signer_obj.signer_id_1"
                :placeholder="t('document.commission.commodityExpert')"
                :label="t('document.commission.commodityExpert')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                @change="changeUser($event, 'signer_id_1')"
              >
                <template v-if="signersList.merchandiser.users">
                  <ElOption
                    v-for="item in signersList.merchandiser.users"
                    :key="item.id"
                    :label="usersStore.getUserFullName(item)"
                    :value="item.id"
                  />
                </template>
              </AppSelect>
              <AppSelect
                v-if="!activeComingModal"
                v-model="actForm.doc_signer_obj.signer_id_2"
                prop="doc_signer_obj.signer_id_2"
                :placeholder="t('document.commission.forwarder')"
                :label="t('document.commission.forwarder')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                @change="changeUser($event, 'signer_id_2')"
              >
                <template v-if="usersStore.users">
                  <ElOption
                    v-for="item in usersStore.users.users"
                    :key="item.id"
                    :label="usersStore.getUserFullName(item)"
                    :value="item.id"
                  />
                </template>
              </AppSelect>
              <AppSelect
                v-model="actForm.doc_signer_obj.signer_id_3"
                prop="doc_signer_obj.signer_id_3"
                :placeholder="t('document.commission.warehouseManager')"
                :label="t('document.commission.warehouseManager')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                @change="changeUser($event, 'signer_id_3')"
              >
                <template v-if="signersList.manager_base.users">
                  <ElOption
                    v-for="item in signersList.manager_base.users"
                    :key="item.id"
                    :label="usersStore.getUserFullName(item)"
                    :value="item.id"
                  />
                </template>
              </AppSelect>
              <AppSelect
                v-model="actForm.doc_signer_obj.signer_id_4"
                prop="doc_signer_obj.signer_id_4"
                :placeholder="t('document.commission.baseChief')"
                :label="t('document.commission.baseChief')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                @change="changeUser($event, 'signer_id_4')"
              >
                <template v-if="signersList.head_warehouse.users">
                  <ElOption
                    v-for="item in signersList.head_warehouse.users"
                    :key="item.id"
                    :label="usersStore.getUserFullName(item)"
                    :value="item.id"
                  />
                </template>
              </AppSelect>
            </div>
          </div>
        </AppForm>
      </div>
    </div>

    <div class="flex items-start justify-end gap-2 mt-[24px]">
      <button
        class="custom-cancel-btn"
        @click="closeModal"
      >
        {{ t("method.cancel") }}
      </button>
      <ElButton
        :loading="documentStore.createLoading"
        type="success"
        size="large"
        @click="sendForm"
        class="custom-send-btn"
      >
        {{ t("method.send") }}

      </ElButton>
    </div>

    <ElDialog
      v-model="providerCreateModal"
      :show-close="false"
      class="w-[65%]"
      align-center
      append-to-body
      :before-close="providerCreateModalClose"
    >
      <template #header>
        <div class="text-center text-[#000000] font-bold text-[18px]">
          {{ t("document.supplier.createTitle") }}
        </div>
      </template>

      <AppForm
        :value="providerForm"
        @validation="value => (providerV$ = value)"
        class="bg-[#F8F9FC] p-6 rounded-[24px] border border-[#E2E6F3]"
      >
        <div class="grid grid-cols-3 gap-x-6 gap-y-1">
          <AppInput
            v-model="providerForm.name"
            prop="name"
            :label="t('common.name2')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            required
          />
          <AppInput
            v-model="providerForm.address"
            prop="address"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('common.legalAddress')"
            required
          />
          <AppInput
            v-model="providerForm.oked"
            type="number"
            prop="oked"
            :label="t('common.oked')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            required
            :max="5"
            mask="#####"
          />
          <AppInput
            v-model="providerForm.tin"
            prop="tin"
            type="number"
            :mask="'#'.repeat(9)"
            :label="t('common.tin')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            required
            :min="9"
            :max="9"
          />
          <AppInput
            v-model="providerForm.license"
            prop="license"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('licence.number')"
            required
          />
          <AppInput
            v-model="providerForm.sertificate"
            prop="sertificate"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('common.certificate')"
            required
          />
          <AppDatePicker
            v-model="providerForm.sert_end_date"
            prop="sert_end_date"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('common.certificateDuration')"
            required
            :disabled-date="(time) => Date.now() >= time.getTime()"
          />
          <AppInput
            v-model="providerForm.director"
            prop="director"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('common.supervisor')"
            required
          />
          <AppInput
            v-model="providerForm.phone"
            prop="phone"
            type="tel"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :label="t('common.contact')"
            required
          />
        </div>
      </AppForm>

      <div class="flex items-center justify-end gap-2 mt-[24px]">
        <button
          class="custom-cancel-btn h-10"
          @click="providerCreateModalClose"
        >
          {{ t("method.cancel") }}
        </button>
        <ElButton
          :loading="settingsStore.createProviderLoading"
          size="large"
          type="primary"
          class="custom-apply-btn"
          @click="sendProviderForm"
        >
          {{ t("method.add") }}
        </ElButton>
      </div>
    </ElDialog>
  </el-dialog>
</template>

<style lang="scss">
.custom-cell-header div {
  padding: 0 !important;
}

.table-my tr:last-child td {
  border-bottom: 0;
}

.product .el-collapse-item__arrow {
  margin: 0 0 15px;
}

.act-left .el-collapse-item__wrap {
  border: none;
}

.act-left .el-collapse-item__header {
  border: none;
  background-color: #F8F9FC;
  padding: 12px;
}

.act-right .el-collapse-item__header {
  border: none;
  padding: 16px 12px;
}
</style>
