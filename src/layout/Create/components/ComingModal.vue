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
  deepEqual,
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

const formNumberAndDate = computed(() => {
  if (!form.number && !form.date) return "";
  return `${form.number} ${form.date}`;
});

const validationErrors = ref<Record<string, any> | null>({
  Document: {},
  Act: {},
});

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);

const actForm = reactive<DocumentCreateDataActType>({
  number: "",
  subject: "",
  content: "",
  shipping_method: "",
  products: [],
  doc_details: {
    licence: "",
    licence_date: "",
    sanitary: "",
    sanitary_date: "",
    vetirinary: "",
    vetirinary_date: "",
    quality: "",
    quality_date: "",
    contract_details: "",
    contract_details_date: "",
    manufacturer: "",
  },
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
  if (activeComingModal.value && actV$.value) actV$.value.clear();
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
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm: DocumentCreateDataType = {
    Document: JSON.parse(JSON.stringify(form)),
  };

  delete newForm.Document.from;
  delete newForm.Document.to;

  newForm.Act = JSON.parse(JSON.stringify(actForm));

  if (newForm.Act && newForm.Act.doc_signer_obj) {
    const signerKeys = ["signer_id_1", "signer_id_2", "signer_id_3", "signer_id_4", "signer_id_5"] as const;

    newForm.Act.doc_signers = signerKeys
      .map((key) => ({
        signer_id: newForm.Act!.doc_signer_obj![key] as number,
      }));
  }

  await documentStore.create(newForm).then(() => {
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

const changeProduct = async (product: DocumentProductType) => {
  if (!(product.product_type_id && product.category_id)) return;

  const activeVidProducts = vidProducts.value.get(product.category_id);

  if (!activeVidProducts) return;

  const activeVidProduct = activeVidProducts.find(el => el.id === product.product_type_id);

  if (!activeVidProduct) return;

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
  form.products?.push({
    category_id: "",
    product_type_id: "",
    quantity: null,
    unit_id: "",
    price: null,
  });
};

const activeComingModal = computed(() => props.id === 7);

const deleteProduct = (index: number) => {
  form.products?.splice(index, 1);
};

const fetchRespondents = (search = "") => {
  settingsStore.fetchRespondents();
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

const openModal = () => {
  form.doc_type_id = props.id;
  fetchRespondents();

  if (authStore.disabledUserWorkplace) {
    const activeWorkplace = authStore.user.workplaces[0];
    const type = activeComingModal.value ? "to" : "from";
    form[`${type}_id`] = activeWorkplace.workplace_id;
    form[`${type}_type`] = activeWorkplace.workplace_type;
    form[type] = `${activeWorkplace.workplace_id}_${activeWorkplace.workplace_type}`;
  }

  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_UNITS();

  oldForm.value = JSON.parse(JSON.stringify(form));
  if (activeComingModal.value) {
    oldActForm.value = JSON.parse(JSON.stringify(actForm));
    usersStore.fetchUsers({
      per_page: 100,
    });
  }
};

watch(model, newValue => {
  if (newValue) openModal();
});

const respondentChange = (value: string, type: "from" | "to") => {
  const values = value.split("_");
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
    commonStore.errorToast("Validation Error");
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
        Создать {{ activeComingModal ? "приход" : " расход" }}
      </div>
    </template>
    <div class="flex gap-x-6 flex-wrap">
      <div class="w-[60%] flex flex-col gap-y-10">
        <div
          :class="['border-[#E2E6F3] bg-[#fff] border rounded-[15px]', `${activeComingModal ? 'min-h-[1258.63px]' : 'min-h-[1319px]'}`]"
        >
          <div class="px-[72px] pb-[150px]">
            <header class="flex items-center justify-center my-[24px] mb-6">
              <img
                src="@/assets/images/logo.svg"
                alt="logo"
              />
              <div class="flex flex-col ml-3">
                <b class="text-[#000D24] text-lg">NKMK</b>
                <span class="text-[#CBCCCE]">Jamg‘armasi</span>
              </div>
            </header>
            <h1
              class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]"
            >
              НАКЛАДНОЙ
            </h1>

            <div class="flex mb-[8px]">
              <h1 class="text-[#4F5662] text-sm font-medium">
                Дата создания в системе:
              </h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ date }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-medium">
                № накладной в системе:
              </h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                NK-00000
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h1 class="text-[#4F5662] text-sm font-medium">
                Дата накладной:
              </h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.date }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-medium">№ накладной:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.number }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-medium">Вид документа:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ name }}
              </span>
            </div>

            <div class="flex items-center mb-[8px]">
              <h1 class="text-[#4F5662] text-sm font-medium">От кого:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ from }}
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h1 class="text-[#4F5662] text-sm font-medium">Кому:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ to }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-medium whitespace-nowrap">
                Через кого:
              </h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.through_whom }}
              </span>
            </div>

            <div class="flex mb-[8px]">
              <h1 class="text-[#4F5662] text-sm font-medium">Основание:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{ form.basis }}
              </span>
            </div>

            <div class="flex mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-medium">
                Способ отправления:
              </h1>
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
            >
              <el-table-column
                prop="title"
                label="Название"
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
                label="Количество"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{ row.quantity ?? "-" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="measurement"
                label="Ед. измерения"
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
                label="Цена"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.price ? `${formatNumber(row.price as number)} сум` : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="total_price"
                label="Сумма"
              >
                <template #default="{ row }: { row: DocumentProductType }">
                  {{
                    row.price && row.quantity
                      ? `${formatNumber(
                        (row.price * row.quantity) as number,
                      )} сум`
                      : "-"
                  }}
                </template>
              </el-table-column>

              <template
                v-if="productsTotalSum"
                #append
              >
                <div class="flex items-center justify-end p-4">
                  <h1 class="text-[#8F9194] text-sm font-bold mr-[5px]">
                    Общая сумма:
                  </h1>
                  <h1 class="text-[#000D24] text-sm font-bold mr-5">
                    {{ formatNumber(productsTotalSum) }} сум
                  </h1>
                </div>
              </template>
            </el-table>
            <template v-if="!activeComingModal">
              <div class="flex items-center justify-between mb-[24px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">Кладовщик:</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_1 && typeof (actForm.doc_signer_obj.signer_id_1) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_1)) : ""
                  }}
              </span>
              </div>

              <div class="flex items-center justify-between mb-[24px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">Товаровед:</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_2 && typeof (actForm.doc_signer_obj.signer_id_2) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_2)) : ""
                  }}
              </span>
              </div>

              <div class="flex items-center justify-between mb-[24px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">Зав. склад</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                    actForm.doc_signer_obj.signer_id_4 && typeof (actForm.doc_signer_obj.signer_id_4) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_4)) : ""
                  }}
              </span>
              </div>

              <div class="flex items-center justify-between mb-[24px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">
                  Начальник базы
                </h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                    actForm.doc_signer_obj.signer_id_5 && typeof (actForm.doc_signer_obj.signer_id_5) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_5)) : ""
                  }}
              </span>
              </div>
            </template>
          </div>
        </div>
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
                <b class="text-[#000D24] text-lg">NKMK</b>
                <span class="text-[#CBCCCE]">Jamg‘armasi</span>
              </div>
            </header>
            <h1
              class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]"
            >
              АКТ
            </h1>
            <div class="flex items-center justify-between mb-[24px]">
              <div class="flex items-center mb-[8px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">№:</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                  {{ actForm.number }}
                </span>
              </div>
              <div class="flex items-center mb-[8px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">Дата:</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                  {{ date }}
                </span>
              </div>
            </div>
            <span
              class="block text-[#4F5662] text-sm font-normal leading-[20px] mb-[24px]"
            >
              {{ actForm.content }}
            </span>
            <div class="overflow-x-auto mb-[24px]">
              <table
                class="min-w-full border border-gray-300 bg-white text-left text-sm text-gray-900 rounded-[8px] border-separate table-my border-spacing-0"
              >
                <colgroup>
                  <col class="w-[60%]">
                </colgroup>
                <tbody>
                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Название продукта
                  </td>
                  <td class="p-2 border-b border-gray-300">{{ activeProductType?.name }}</td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Количество продукта
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.products[0]?.quantity ? formatNumber(actForm.products[0].quantity) : "" }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Единица измерения
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.products[0]?.unit_id ? getProductMeasurement(actForm.products[0].unit_id) : "" }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата договора о поставке
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.doc_details.contract_details }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата накладной
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ formNumberAndDate }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Производитель продукта
                  </td>
                  <td class="p-2 border-b border-gray-300">{{ actForm.doc_details.manufacturer }}</td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">Поставщик</td>
                  <td class="p-2 border-b border-gray-300">
                    {{ from }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Получатель
                  </td>
                  <td class="p-2 border-b border-gray-300">{{ to }}</td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">Транспорт</td>
                  <td class="p-2 border-b border-gray-300">{{ actForm.shipping_method }}</td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата лицензии
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.doc_details.licence }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата заключение Санитарно-эпидемиологического
                    центра
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.doc_details.sanitary }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата удостоверения ветеринарии
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.doc_details.vetirinary }}
                  </td>
                </tr>

                <tr class="border-gray-300">
                  <td class="border-r border-b p-2 font-medium">
                    Номер и дата удостоверения качества
                  </td>
                  <td class="p-2 border-b border-gray-300">
                    {{ actForm.doc_details.quality }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Кладовщик:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                  actForm.doc_signer_obj.signer_id_1 && typeof (actForm.doc_signer_obj.signer_id_1) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_1)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Товаровед:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                {{
                  actForm.doc_signer_obj.signer_id_2 && typeof (actForm.doc_signer_obj.signer_id_2) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_2)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Экспедитор:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                  actForm.doc_signer_obj.signer_id_3 && typeof (actForm.doc_signer_obj.signer_id_3) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_3)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Зав. склад</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
               {{
                  actForm.doc_signer_obj.signer_id_4 && typeof (actForm.doc_signer_obj.signer_id_4) === "number" ? usersStore.getUserFullName(getUser(actForm.doc_signer_obj.signer_id_4)) : ""
                }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">
                Начальник базы
              </h1>
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
        <AppForm
          :value="form"
          @validation="setValidation"
          @submit.prevent
          :validation-errors="validationErrors?.Document ?? null"
          :class="[{'min-h-[830px]': activeComingModal}]"
        >
          <AppInput
            placeholder="Входящий накладной"
            label="Название документа"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppDatePicker
            :placeholder="date"
            label="Дата создания документа"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            placeholder="Автоматически"
            label="№ накладной в системе"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            v-model="form.number"
            prop="number"
            placeholder="№ накладной"
            label="№ накладной"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
            :max="20"
            :maxlength="20"
          />
          <AppDatePicker
            v-model="form.date"
            prop="date"
            placeholder="Дата накладной"
            label="Дата накладной"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />
          <AppSelect
            v-model="form.from"
            prop="from"
            placeholder="От кого"
            label="От кого"
            :items="settingsStore.respondents"
            :loading="settingsStore.respondentsLoading"
            label-class="text-[#A8AAAE] text-xs font-medium"
            @change="(value) => respondentChange(value as string, 'from')"
            required
            :disabled="authStore.disabledUserWorkplace && !activeComingModal"
            trigger="blur"
          >
            <template v-if="activeComingModal">
              <ElOption
                v-for="item in settingsStore.respondents"
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
                Добавить
              </button>
            </template>
          </AppSelect>
          <AppSelect
            v-model="form.to"
            prop="to"
            placeholder="Кому"
            label="Кому"
            :loading="authStore.userLoading"
            label-class="text-[#A8AAAE] text-xs font-medium"
            @change="(value) => respondentChange(value as string, 'to')"
            required
            trigger="blur"
            :disabled="authStore.disabledUserWorkplace && activeComingModal"
          >
            <template v-if="activeComingModal">
              <ElOption
                v-for="item in settingsStore.respondents"
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
            placeholder="Через кого"
            label="Через кого"
            label-class="text-[#A8AAAE] text-xs font-medium"
          />
          <AppInput
            v-model="form.basis"
            prop="basis"
            placeholder="Основание"
            label="Основание"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />
          <AppInput
            v-model="form.shipping_method"
            prop="shipping_method"
            placeholder="Способ отправления"
            label="Способ отправления"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
          />
          <div
            v-if="activeComingModal"
            class="bg-[#FFFFFF] rounded-[8px] p-[12px]"
          >
            <template
              v-for="(product, index) in form.products"
              :key="index + 1"
            >
              <div
                class="flex items-center justify-between mb-[16px] text-sm font-medium"
              >
                <strong class="text-[#4F5662]">
                  <template v-if="form.products && form.products.length > 1">
                    {{ index + 1 }}.
                  </template>
                  Таблица получаемых продуктов
                </strong>
                <button
                  v-if="form.products && form.products.length > 1"
                  @click.stop="deleteProduct(index)"
                  class="flex items-center gap-x-1"
                >
                  <svg
                    :data-src="deleteIcon"
                    class="size-5"
                  />
                  <span class="text-[#EA5455]">Удалить</span>
                </button>
              </div>
              <AppSelect
                v-model="product.category_id"
                placeholder="Тип продукта"
                :prop="`products[${index}].category_id`"
                :items="settingsStore.typeProduct.product_categories"
                item-value="id"
                item-label="name"
                label="Тип продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                @change="fetchVidProductsList(product)"
                required
                trigger="blur"
              />
              <AppSelect
                v-model="product.product_type_id"
                :prop="`products[${index}].product_type_id`"
                :items="vidProducts.get(product.category_id as number)"
                item-label="name"
                item-value="id"
                placeholder="Вид продукта"
                label="Вид продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :disabled="!product.category_id"
                @change="changeProduct(product)"
              />
              <div class="grid grid-cols-2 gap-x-4">
                <AppInput
                  v-model="product.quantity"
                  custom-type="number"
                  :prop="`products[${index}].quantity`"
                  placeholder="Количество"
                  label="Количество"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                />
                <AppSelect
                  v-model="product.unit_id"
                  :prop="`products[${index}].unit_id`"
                  :items="settingsStore.units.units ?? []"
                  item-label="name"
                  item-value="id"
                  placeholder="Ед. измерения"
                  label="Ед. измерения"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                  disabled
                />
              </div>
              <AppInput
                v-model.number="product.price"
                type="number"
                :prop="`products[${index}].price`"
                placeholder="Цена"
                label="Цена"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
            </template>
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
              Добавить
            </button>
          </div>

        </AppForm>
        <AppForm
          :value="actForm"
          @validation="setActValidation"
          @submit.prevent
          :validation-errors="validationErrors?.Act ?? null"
        >
          <template v-if="activeComingModal">
            <AppInput
              placeholder="АКТ"
              label="АКТ"
              label-class="text-[#A8AAAE] text-xs font-medium"
              disabled
            />

            <AppInput
              placeholder="Автоматически"
              label="№ накладной в системе"
              label-class="text-[#A8AAAE] text-xs font-medium"
              disabled
            />

            <AppInput
              v-model="actForm.number"
              prop="number"
              placeholder="АКТ-00000"
              label="№ Акта"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
              :max="20"
              :maxlength="20"
            />

            <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">
              <span class="block text-[#4F5662] text-sm font-medium mb-[16px]">
                Содержание акта
              </span>

              <AppInput
                v-model="actForm.content"
                prop="content"
                placeholder="Поле ввода текст содержания акта с выводом шаблонного заданного текста"
                type="textarea"
                :rows="5"
                required
                :maxlength="1000"
                :max="1000"
              />

              <AppSelect
                v-model="actForm.products[0]"
                :items="selectedProductTypes"
                item-label="name"
                item-value="id"
                prop="products[0]"
                placeholder="Название продукта"
                label="Название продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                @change="actProductTypeChange"
                required
                trigger="blur"
              >
              </AppSelect>
              <AppInput
                :modelValue="actForm.products[0]?.quantity ?? ''"
                label="Количество продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                placeholder="Количество продукта"
                disabled
              />
              <AppInput
                :model-value="actForm.products[0]?.unit_id ? getProductMeasurement(actForm.products[0].unit_id) : ''"
                label="Единица измерения"
                label-class="text-[#A8AAAE] text-xs font-medium"
                placeholder="Единица измерения"
                disabled
              />
              <AppInput
                v-model="actForm.doc_details.contract_details"
                prop="doc_details.contract_details"
                placeholder="Номер договора о поставке"
                label="Номер договора о поставке"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :maxlength="20"
                :max="20"
              />
              <AppDatePicker
                v-model="actForm.doc_details.contract_details_date"
                prop="doc_details.contract_details_date"
                placeholder="Дата договора о поставке"
                label="Дата договора о поставке"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                v-model="formNumberAndDate"
                placeholder="Номер и дата накладной"
                label="Номер и дата накладной"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
              />
              <AppInput
                v-model="actForm.doc_details.manufacturer"
                prop="doc_details.manufacturer"
                placeholder="Производитель продукта"
                label="Производитель продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                :model-value="from"
                label="Поставщик"
                placeholder="Поставщик"
                label-class="text-[#A8AAAE] text-xs font-medium"
                disabled
              />

              <AppInput
                v-model="actForm.shipping_method"
                prop="shipping_method"
                placeholder="Транспорт"
                label="Транспорт"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                v-model="actForm.doc_details.licence"
                prop="doc_details.licence"
                placeholder="Номер лицензии"
                label="Номер лицензии"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :max="20"
                :maxlength="20"
              />
              <AppDatePicker
                v-model="actForm.doc_details.licence_date"
                prop="doc_details.licence_date"
                placeholder="Дата лицензии"
                label="Дата лицензии"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                v-model="actForm.doc_details.sanitary"
                prop="doc_details.sanitary"
                placeholder="Номер заключения Санитарно..."
                label="Номер заключения Санитарно..."
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :max="20"
                :maxlength="20"
              />
              <AppDatePicker
                v-model="actForm.doc_details.sanitary_date"
                prop="doc_details.sanitary_date"
                placeholder="Дата заключения Санитарно..."
                label="Дата заключения Санитарно..."
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                v-model="actForm.doc_details.vetirinary"
                prop="doc_details.vetirinary"
                placeholder="Номер удостоверения ветеринарии"
                label="Номер удостоверения ветеринарии"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :max="20"
                :maxlength="20"
              />
              <AppDatePicker
                v-model="actForm.doc_details.vetirinary_date"
                prop="doc_details.vetirinary_date"
                placeholder="Дата удостоверения ветеринарии"
                label="Дата удостоверения ветеринарии"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
              <AppInput
                v-model="actForm.doc_details.quality"
                prop="doc_details.quality"
                placeholder="Номер удостоверения качества"
                label="Номер удостоверения качества"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
                :max="20"
                :maxlength="20"
              />
              <AppDatePicker
                v-model="actForm.doc_details.quality_date"
                prop="doc_details.quality_date"
                placeholder="Дата удостоверения качества"
                label="Дата удостоверения качества"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
              />
            </div>
          </template>

          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
            <strong class="block text-[#4F5662] text-sm font-medium mb-4">
              Состав комиссии приема продуктов
            </strong>
            <div class="flex flex-col">
              <AppSelect
                v-model="actForm.doc_signer_obj.signer_id_1"
                prop="doc_signer_obj.signer_id_1"
                placeholder="Кладовщик"
                label="Кладовщик"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
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
                v-model="actForm.doc_signer_obj.signer_id_2"
                prop="doc_signer_obj.signer_id_2"
                placeholder="Товаровед"
                label="Товаровед"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
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
                v-if="!activeComingModal"
                v-model="actForm.doc_signer_obj.signer_id_3"
                prop="doc_signer_obj.signer_id_3"
                placeholder="Экспедитор"
                label="Экспедитор"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
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
                v-model="actForm.doc_signer_obj.signer_id_4"
                prop="doc_signer_obj.signer_id_4"
                placeholder="Зав. склад"
                label="Зав. склад"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
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
                v-model="actForm.doc_signer_obj.signer_id_5"
                prop="doc_signer_obj.signer_id_5"
                placeholder="Начальник базы"
                label="Начальник базы"
                label-class="text-[#A8AAAE] text-xs font-medium"
                required
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
        Отменить
      </button>
      <ElButton
        :loading="documentStore.createLoading"
        type="success"
        size="large"
        @click="sendForm"
        class="custom-send-btn"
      >
        Отправить
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
          Добавить нового поставщика
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
            label="Наименование"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            placeholder="Введите"
            required
          />
          <AppInput
            v-model="providerForm.address"
            prop="address"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Юр. адрес"
            required
          />
          <AppInput
            v-model="providerForm.oked"
            type="number"
            prop="oked"
            placeholder="Введите"
            label="ОКЭД"
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
            placeholder="Введите"
            label="ИНН"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            required
            :min="9"
            :max="9"
          />
          <AppInput
            v-model="providerForm.license"
            prop="license"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Номер лицензии"
            required
          />
          <AppInput
            v-model="providerForm.sertificate"
            prop="sertificate"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Сертификат"
            required
          />
          <AppDatePicker
            v-model="providerForm.sert_end_date"
            prop="sert_end_date"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Срок сертификата"
            required
            :disabled-date="(time) => Date.now() >= time.getTime()"
          />
          <AppInput
            v-model="providerForm.director"
            prop="director"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Руководитель"
            required
          />
          <AppInput
            v-model="providerForm.phone"
            prop="phone"
            type="tel"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            label="Контакты"
            required
          />
        </div>
      </AppForm>

      <div class="flex items-center justify-end gap-2 mt-[24px]">
        <button
          class="custom-cancel-btn h-10"
          @click="providerCreateModalClose"
        >
          Отменить
        </button>
        <ElButton
          :loading="settingsStore.createProviderLoading"
          size="large"
          type="primary"
          class="custom-apply-btn"
          @click="sendProviderForm"
        >
          Добавить
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
</style>
