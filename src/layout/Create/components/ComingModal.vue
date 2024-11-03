<script setup lang="ts">
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {
  DocumentCreateDataType,
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

const date = ref(formatDate2(new Date()));

const form = reactive<DocumentCreateDataType>({
  doc_type_id: null,
  date: "",
  number: "",
  from_id: null,
  from_type: "",
  to_id: null,
  to_type: "",
  subject: "",
  through_whom: "",
  content: "",
  basis: "",
  shipping_method: "",
  status: "",
  products: [
    {
      product_type_id: "",
      quantity: null,
      unit_id: "",
      price: null,
    },
  ],
});

const oldForm = ref<null | DocumentCreateDataType>(null);

const from = computed<string>(() => {
  if (!form.from_id || !form.from_type) return "";
  const activeEl = settingsStore.respondents.find(
    el => el.model_type === form.from_type && el.id === form.from_id
  );

  if (!activeEl) return "";

  return activeEl.name;
});

const to = computed<string>(() => {
  if (!form.to_id || !form.to_type) return "";
  const activeEl = settingsStore.respondents.find(
    el => el.model_type === form.to_type && el.id === form.to_id
  );

  if (!activeEl) return "";

  return activeEl.name;
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const clearV$ = () => {
  if (!v$.value) return;
  v$.value.clearValidate();
  v$.value.resetForm();
};

const sendForm = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  await documentStore.create(form).then(() => {
    model.value = false;
    clearV$();
  });
};

const getProductTypeTitle = (id: number) => {
  return (
    settingsStore.vidProduct.product_types.find(
      (el: Record<string, any>) => el.id === id
    )?.name ?? ""
  );
};

const getProductMeasurement = (id: number) => {
  return (
    settingsStore.units.units.find((el: Record<string, any>) => el.id === id)
      ?.name ?? ""
  );
};

const productsTotalSum = computed(() => {
  return form.products.reduce((sum: number, product: DocumentProductType) => {
    return (
      sum +
      Number(
        product.price && product.quantity ? product.price * product.quantity : 0
      )
    );
  }, 0);
});

const createProduct = () => {
  form.products.push({
    product_type_id: "",
    quantity: null,
    unit_id: "",
    price: null,
  });
};

const deleteProduct = (index: number) => {
  form.products.splice(index, 1);
};

const fetchRespondents = (search = "") => {
  settingsStore.fetchRespondents();
};

const { confirm } = useConfirm();

const closeModal = async () => {
  if (oldForm.value && !deepEqual(form, oldForm.value)) {
    const response = await confirm.cancel({ disabledBody: true });

    if (response === "save") {
      await sendForm();
      return;
    } else {
      clearV$();
    }
  }

  model.value = false;
};

const openModal = () => {
  form.doc_type_id = props.id;
  fetchRespondents();
  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_UNITS();

  oldForm.value = JSON.parse(JSON.stringify(form));
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

  if (!(await providerV$.value.validate())) return;

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
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">
        Создать {{ id === 7 ? "приход" : " расход" }}
      </div>
    </template>
    <AppForm
      :value="form"
      @validation="setValidation"
      @submit.prevent
    >
      <div class="flex">
        <div
          class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[60%] mr-0"
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
                {{ form.date ?? "Нет" }}
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
              class="custom-element-table custom-element-table--has-append"
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
                      ? getProductTypeTitle(row.product_type_id as number)
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
                          (row.price * row.quantity) as number
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
          </div>
        </div>
        <div class="w-[40%] ml-[24px] flex flex-col justify-between">
          <div>
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
              label="NK-00000"
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
            />
            <AppDatePicker
              v-model="form.date"
              prop="date"
              placeholder="Дата накладной"
              label="Дата накладной"
              label-class="text-[#A8AAAE] text-xs font-medium"
              format="DD.MM.YYYY"
              value-format="DD.MM.YYYY"
              required
            />
            <AppSelect
              prop="from_id"
              placeholder="От кого"
              label="От кого"
              :items="settingsStore.respondents"
              item-label="name"
              :loading="settingsStore.respondentsLoading"
              label-class="text-[#A8AAAE] text-xs font-medium"
              @change="(value) => respondentChange(value as string, 'from')"
              required
            >
              <ElOption
                v-for="item in settingsStore.respondents"
                :key="`${item.id}_${item.model_type}`"
                :value="`${item.id}_${item.model_type}`"
                :label="item.name"
              />
              <template #footer>
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
              prop="to_id"
              placeholder="Кому"
              label="Кому"
              :items="settingsStore.respondents"
              item-label="name"
              :loading="settingsStore.respondentsLoading"
              label-class="text-[#A8AAAE] text-xs font-medium"
              @change="(value) => respondentChange(value as string, 'to')"
              required
            >
              <ElOption
                v-for="item in settingsStore.respondents"
                :key="`${item.id}_${item.model_type}`"
                :value="`${item.id}_${item.model_type}`"
                :label="item.name"
              />
              <template #footer>
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
            <AppInput
              v-model="form.through_whom"
              prop="through_whom"
              placeholder="Через кого"
              label="Через кого"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
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
              class="mb-[32px]"
              placeholder="Способ отправления"
              label="Способ отправления"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
            />
            <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
              <template
                v-for="(product, index) in form.products"
                :key="index + 1"
              >
                <div
                  class="flex items-center justify-between mb-[16px] text-sm font-medium"
                >
                  <strong class="text-[#4F5662]">
                    <template v-if="form.products.length > 1">
                      {{ index + 1 }}.
                    </template>
                    Таблица получаемых продуктов
                  </strong>
                  <button
                    v-if="form.products.length > 1"
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
                  placeholder="Тип продукта"
                  :prop="`products[${index}].product_type_id`"
                  :items="settingsStore.typeProduct.product_categories"
                  item-value="id"
                  item-label="name"
                  label="Тип продукта"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  @change="
                    value =>
                      settingsStore.GET_VID_PRODUCT({
                        parent_id: value,
                        per_page: 100,
                      })
                  "
                  required
                  trigger="blur"
                />
                <AppSelect
                  v-model="product.product_type_id"
                  :prop="`products[${index}].product_type_id`"
                  :items="settingsStore.vidProduct.product_types"
                  item-label="name"
                  item-value="id"
                  placeholder="Вид продукта"
                  label="Вид продукта"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                />
                <AppInput
                  v-model.number="product.quantity"
                  :prop="`products[${index}].quantity`"
                  type="number"
                  placeholder="Количество"
                  label="Количество"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                />
                <AppSelect
                  v-model="product.unit_id"
                  :prop="`products[${index}].unit_id`"
                  :items="settingsStore.units.units"
                  item-label="name"
                  item-value="id"
                  placeholder="Ед. измерения"
                  label="Ед. измерения"
                  label-class="text-[#A8AAAE] text-xs font-medium"
                  required
                />
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
          </div>
          <!--        <div class="flex items-start justify-between">-->
          <!--          <button class="custom-cancel-btn" @click="closeModal">Отменить</button>-->
          <!--          <button class="custom-apply-btn">Сохранить как черновик</button>-->
          <!--          <button class="custom-send-btn">Отправить</button>-->
          <!--        </div>-->
        </div>
      </div>
      <div
        v-if="id === 7"
        class="flex mt-10"
      >
        <div
          class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[60%] mr-0"
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
                  04-04-01/463
                </span>
              </div>
              <div class="flex items-center mb-[8px]">
                <h1 class="text-[#4F5662] text-sm font-semibold">Дата:</h1>
                <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                  24.08.2024
                </span>
              </div>
            </div>
            <span
              class="block text-[#4F5662] text-sm font-normal leading-[20px] mb-[24px]"
            >
              На основании данного документа мы подтверждаем, что следующая
              продукция принята в соответствии с правилами приемки продукции по
              количеству и качеству.
            </span>
            <div class="overflow-x-auto mb-[24px]">
              <table
                class="min-w-full border border-gray-300 bg-white text-left text-sm text-gray-900 rounded-[8px] border-separate table-my border-spacing-0"
              >
                <tbody>
                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Название продукта
                    </td>
                    <td class="p-2 border-b border-gray-300">Картофель</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Количество продукта
                    </td>
                    <td class="p-2 border-b border-gray-300">265</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Единица измерения
                    </td>
                    <td class="p-2 border-b border-gray-300">кг</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата договора о поставке
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      K1029745 от 25.07.2024
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата накладной
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      № 365 26.08.2024
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Производитель продукта
                    </td>
                    <td class="p-2 border-b border-gray-300">OOO “Brend”</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">Поставщик</td>
                    <td class="p-2 border-b border-gray-300">
                      OOO “Yuksalish”
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Получатель
                    </td>
                    <td class="p-2 border-b border-gray-300">РУ "Зарафшан"</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">Транспорт</td>
                    <td class="p-2 border-b border-gray-300">85 085 RRR</td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата лицензии
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      № L-86978576 от 05.02.2022
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата заключение Санитарно-эпидемиологического
                      центра
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      № SM-069788 от 05.01.2024
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата удостоверения ветеринарии
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      № ВТ-0365 от 10.01.2024
                    </td>
                  </tr>

                  <tr class="border-gray-300">
                    <td class="border-r border-b p-2 font-medium">
                      Номер и дата удостоверения качества
                    </td>
                    <td class="p-2 border-b border-gray-300">
                      № УК-0614 от 07.02.2024
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Кладовщик:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                Эргашева Л.
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Товаровед:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                Жалилов М.
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Экспедитор:</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                Акромов О.
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">Зав. склад</h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                Каххоров А.
              </span>
            </div>

            <div class="flex items-center justify-between mb-[24px]">
              <h1 class="text-[#4F5662] text-sm font-semibold">
                Начальник базы
              </h1>
              <span class="ml-2 text-[#A8AAAE] text-sm font-medium block">
                Маликов Б.
              </span>
            </div>
          </div>
        </div>

        <div class="w-[40%] ml-[24px] flex flex-col justify-between">
          <div>
            <AppInput
              placeholder="АКТ"
              label="АКТ"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />

            <AppInput
              placeholder="NK-00000"
              label="NK-00000"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />

            <AppInput
              placeholder="АКТ-00000"
              label="АКТ-00000"
              label-class="text-[#A8AAAE] text-xs font-medium"
            />

            <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">
              <span class="block text-[#4F5662] text-sm font-medium mb-[16px]">
                Содержание акта
              </span>

              <AppInput
                placeholder="Поле ввода текст содержания акта с выводом шаблонного заданного текста"
                type="textarea"
                :rows="5"
              />

              <AppInput
                placeholder="Картофель"
                label="Картофель"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppInput placeholder="50" />
              <AppInput placeholder="кг" />
              <AppInput
                placeholder="Номер и дата договора о поставке"
                label="Номер и дата договора о поставке"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppInput
                placeholder="Номер и дата накладной"
                label="Номер и дата накладной"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppInput
                placeholder="Производитель продукта"
                label="Производитель продукта"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppInput placeholder="OOO “Yuksalish”" />
              <AppInput
                placeholder="Транспорт"
                label="Транспорт"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppDatePicker
                placeholder="Номер и дата лицензии"
                label="Номер и дата лицензии"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppDatePicker
                placeholder="Номер и дата заключения Санитарно..."
                label="Номер и дата заключения Санитарно..."
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppDatePicker
                placeholder="Номер и дата удостоверения ветеринарии"
                label="Номер и дата удостоверения ветеринарии"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
              <AppDatePicker
                placeholder="Номер и дата удостоверения качества"
                label="Номер и дата удостоверения качества"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
            </div>

            <div class="bg-[#FFFFFF] rounded-[8px] p-[12px]">
              <span class="block text-[#4F5662] text-sm font-medium mb-[16px]">
                Состав комиссии приема продуктов
              </span>
              <AppSelect
                placeholder="Начальник базы  Маликов Б."
                label="Начальник базы"
                label-class="text-[#A8AAAE] text-xs font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </AppForm>
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
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            required
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
