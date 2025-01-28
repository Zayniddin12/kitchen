<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { computed, reactive, ref, watch } from "vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { ModalPropsType, ModalValueType } from "@/layout/Create/components/modal.types";
import {
  DocumentCreateDataDocumentType,
  DocumentProductType,
  DocumentStatusType,
} from "@/modules/Document/document.types";
import { useSettingsStore } from "@/modules/Settings/store";
import { useCommonStore } from "@/stores/common.store";
import { useDocumentStore } from "@/modules/Document/document.store";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { deepEqual, formatDate2, formatNumber } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import deleteIcon from "@/assets/images/icons/delete-danger-icon.svg";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";


const model = defineModel<ModalValueType>();

const props = defineProps<ModalPropsType>();

const settingsStore = useSettingsStore();
const commonStore = useCommonStore();
const documentStore = useDocumentStore();
const authStore = useAuthStore();

const { t } = useI18n();

const defaultProduct: DocumentProductType = {
  category_id: "",
  product_type_id: "",
  quantity: null,
  unit_id: "",
  price: null,
};


const form = reactive<DocumentCreateDataDocumentType>({
  doc_type_id: null,
  number: "",
  date: formatDate2(new Date()),

  to: "",
  to_id: null,
  to_type: "",
  from: "",
  from_id: null,
  from_type: "",
  subject: "",
  content: "",
  status: "",
  products: [
    { ...defaultProduct },
  ],
});

const requestType = computed(() => {
  if (props.id === 4) return t("document.monthlyRequest.title");
  else return t("document.annualRequest.title");
});

const required = ref(false);

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any> | null>(null);

const sendForm = async (status: DocumentStatusType) => {
  if (status === "sent") required.value = true;

  form.status = status;

  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast(t("error.validation"));
    return;
  }

  const newForm = { ...form };
  delete newForm.to;

  try {

    await documentStore.create(newForm);

    commonStore.successToast();
    validationErrors.value = null;
    model.value = false;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const clear = () => {
  v$.value?.clear();
  form.to_id = null;
  form.to_type = "";
  form.to = "";
  form.from_id = null;
  form.from_type = "";
  form.products = [{ ...defaultProduct }];
};

const respondentChange = (value: string, type: "from" | "to") => {
  form[type] = value;
  const values = value.split("_");
  form[`${type}_id`] = Number(values[0]);
  form[`${type}_type`] = values[1];
};

const to = computed<string>(() => {
  if (!form.to_id || !form.to_type) return "";
  const activeEl = settingsStore.respondents.find(
    el => el.model_type === form.to_type && el.id === form.to_id,
  );

  if (!activeEl) return "";

  return activeEl.name;
});

const from = computed(() => {
  if (form.from_id && form.from_type) return authStore.getUserWorkplace(form.from_id, form.from_type);
  return null;
});

const loading = computed(() => documentStore.createLoading || documentStore.updateLoading);

const vidProducts = ref<Map<number, Record<string, any>[]>>(new Map);

const fetchVidProductsList = async (product: DocumentProductType) => {
  if (!product.category_id) return;

  await settingsStore.GET_VID_PRODUCT({
    parent_id: product.category_id,
    per_page: 100,
  });

  vidProducts.value.set(product.category_id, settingsStore.vidProduct.product_types);
  product.product_type_id = "";
  product.unit_id = "";
};

const changeProduct = (product: DocumentProductType) => {
  if (!(product.category_id && product.product_type_id)) return;

  const activeVidProducts = vidProducts.value.get(product.category_id);

  if (!activeVidProducts) return;

  const activeProduct = activeVidProducts.find(el => el.id === product.product_type_id);

  if (!activeProduct) return;

  product.unit_id = activeProduct.unit_id;
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
    ...defaultProduct,
  });
};

const deleteProduct = (index: number) => {
  form.products?.splice(index, 1);
};

const { confirm } = useConfirm();

const closeModal = async () => {
  if (oldForm.value && !deepEqual(form, oldForm.value)) {
    const response = await confirm.cancel();

    if (response === "save") {
      await sendForm("sent");
      return;
    }
  }

  model.value = false;
};

const setForm = async () => {
  form.doc_type_id = props.id ?? null;

  if (authStore.disabledUserWorkplace) {
    const activeWorkplace = authStore.user.workplaces[0];
    form.from_id = activeWorkplace.workplace_id;
    form.from_type = activeWorkplace.workplace_type;
    form.from = `${activeWorkplace.workplace_id}_${activeWorkplace.workplace_type}`;
  }

  if (!props.uuid) return;
  await documentStore.fetchDocument(props.uuid);

  if (!documentStore.document) return;
  form.date = documentStore.document.date;
  form.number = documentStore.document.number;
  form.to_id = documentStore.document.to_id ?? null;
  form.to_type = documentStore.document.to_type ?? "";
  form.subject = documentStore.document.subject ?? "";
  form.content = documentStore.document.content ?? "";
  // form.products = documentStore.document.products;

  if (form.to_id && form.to_type) form.to = `${form.to_id}_${form.to_type}`;
};

const openModal = async () => {
  required.value = false;
  settingsStore.fetchRespondents();
  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_UNITS();

  await setForm();

  oldForm.value = JSON.parse(JSON.stringify(form));
};

watch(model, (newModel) => {
  if (newModel) openModal();
  else {
    required.value = false;
    clear();
  }
});

</script>

<template>
  <el-dialog
    v-model="model"
    :show-close="false"
    class="w-[70%]"
    align-center
    append-to-body
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">{{ title }}</div>
    </template>

    <div class="flex">
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[65%] mr-0">
        <AppOverlay
          :loading="documentStore.documentLoading"
          class="px-[72px] pb-[150px]"
        >
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img
              src="@/assets/images/logo.svg"
              alt="logo"
            >
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">{{ t("logo.title") }}</b>
              <span class="text-[#CBCCCE]">{{ t("logo.subtitle") }}</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px] uppercase">
            {{ t("document.freeRequest.title") }}
          </h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">
              {{ t("common.date") }}:
            </h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.date }}</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.number || "NK-00000" }}</span>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662] font-semibold">{{ t("common.recipient") }}: </span>
              <span class="text-[#A8AAAE] ml-2">{{ to }}</span>
            </h1>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662] font-semibold">{{ t("document.freeRequest.type") }}:</span>
              <span class="text-[#A8AAAE] ml-2">{{ requestType }}</span>
            </h1>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">{{ t("common.theme") }}:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.subject }}</span>
          </div>

          <div class="text-[#4F5662] text-[14px] mb-[24px]">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ form.content }}
          </div>

          <el-table
            :data="form.products"
            stripe
            class="custom-element-table custom-element-table--has-append"
            header-cell-class-name="custom-cell-header"
            cell-class-name="custom-cell-header"
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
                <h1 class="text-[#8F9194] text-sm font-bold mr-[5px]">
                  {{ t("common.totalSum") }}:
                </h1>
                <h1 class="text-[#000D24] text-sm font-bold mr-5">
                  {{ formatNumber(productsTotalSum) }} {{ t("currency.sum") }}
                </h1>
              </div>
            </template>
          </el-table>
          <!--          <div class="mt-[40px] flex items-center justify-between">-->
          <!--            <div class="flex items-baseline mb-[24px] w-[200px]">-->
          <!--              <h1 class=" text-[14px] font-medium">-->
          <!--          <span v-if="from" class="text-[#A8AAAE] ml-2">{{ from.position }} ({{from.workplace}})</span>-->
          <!--                <span class="text-[#A8AAAE] ml-2">{{ authStore.user?.position }}</span>-->
          <!--              </h1>-->
          <!--            </div>-->
          <!--            <img-->
          <!--                src="@/assets/images/icons/qr.svg"-->
          <!--                alt="qr"-->
          <!--            />-->
          <!--            <h1 class="text-[#A8AAAE] text-sm mr-[100px]">{{ authStore.userFullName }}</h1>-->
          <!--          </div>-->
        </AppOverlay>
      </div>

      <div class="w-[35%] ml-[24px] flex flex-col justify-between">
        <AppForm
          :value="form"
          @validation="(value:ValidationType) => v$ = value"
          @submit.prevent
          :validation-errors
        >
          <AppInput
            :label="t('document.overlay')"
            :placeholder="t('document.freeRequest.title')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            :label="t('document.freeRequest.type')"
            :placeholder="requestType"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppDatePicker
            :label="t('document.creationDate')"
            :placeholder="form.date"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            v-model="form.number"
            prop="number"
            :label="t('document.number')"
            :placeholder="t('common.automatically')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppSelect
            v-model="form.to"
            prop="to"
            :label="t('common.recipient')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :loading="settingsStore.respondentsLoading"
            @change="(value) => respondentChange(value as string, 'to')"
            :required
            trigger="blur"
            filterable
          >
            <ElOption
              v-for="item in settingsStore.respondents"
              :key="`${item.id}_${item.model_type}`"
              :value="`${item.id}_${item.model_type}`"
              :label="item.name"
            />
          </AppSelect>

          <AppInput
            v-model="form.subject"
            prop="subject"
            :placeholder="t('common.theme')"
            :label="t('common.theme')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :required
            :max="100"
          />

          <AppInput
            v-model="form.content"
            prop="content"
            type="textarea"
            :rows="5"
            :label="t('document.freeRequest.contents')"
            :placeholder="t('document.freeRequest.contents')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :required
            :max="1000"
          />
          <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-3">
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
                  {{ t("document.tableReceivedProducts") }}
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
                  <span class="text-[#EA5455]">{{ t("method.delete") }}</span>
                </button>
              </div>
              <AppSelect
                v-model="product.category_id"
                :prop="`products[${index}].category_id`"
                :items="settingsStore.typeProduct.product_categories"
                item-value="id"
                item-label="name"
                filterable
                :label="t('product.type')"
                :placeholder="t('product.type')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                @change="fetchVidProductsList(product)"
                :required
              />
              <AppSelect
                v-model="product.product_type_id"
                :prop="`products[${index}].product_type_id`"
                :items="vidProducts.get(product.category_id as number)"
                item-label="name"
                item-value="id"
                filterable
                :label="t('product.view')"
                :placeholder="t('product.view')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                :required
                :disabled="!product.category_id"
                @change="changeProduct(product)"
              />
              <div class="grid grid-cols-2 gap-x-4">
                <AppInput
                  v-model="product.quantity"
                  :prop="`products[${index}].quantity`"
                  custom-type="number"
                  :placeholder="t('common.quantity')"
                  :label="t('common.quantity')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  :required
                />
                <AppSelect
                  v-model="product.unit_id"
                  :prop="`products[${index}].unit_id`"
                  :items="settingsStore.units.units"
                  item-label="name"
                  item-value="id"
                  filterable
                  :placeholder="t('common.measurement')"
                  :label="t('common.measurement')"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  :required
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
              {{ t("method.add") }}
            </button>
          </div>
          <AppSelect
            v-model="form.from"
            prop="from"
            :placeholder="t('common.sender')"
            :label="t('common.sender')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :disabled="authStore.disabledUserWorkplace"
            filterable
            @change="(value) => respondentChange(value as string, 'to')"
          >
            <template v-if="authStore.user">
              <ElOption
                v-for="item in authStore.user.workplaces"
                :key="`${item.workplace_type}_${item.workplace_type}`"
                :value="`${item.workplace_id}_${item.workplace_type}`"
                :label="item.workplace"
              />
            </template>
          </AppSelect>
        </AppForm>
        <div class="flex items-start justify-between gap-x-2">
          <button
            class="custom-cancel-btn"
            @click="closeModal"
          >
            {{ t("method.cancel") }}
          </button>
          <ElButton
            :loading="form.status ==='draft' ? loading : false"
            type="primary"
            size="large"
            @click="sendForm('draft')"
            class="custom-apply-btn h-[41px] w-[212px]"
            :disabled="!form.to"
          >
            {{ t("method.saveAsDraft") }}
          </ElButton>
          <ElButton
            :loading="form.status ==='sent' ? loading : false"
            type="success"
            size="large"
            @click="sendForm('sent')"
            class="custom-send-btn h-[41px] w-[116px] !ml-0"
            :disabled="!form.to"
          >
            {{ t("method.send") }}
          </ElButton>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
