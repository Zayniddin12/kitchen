<script
  setup
  lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { ModalPropsType, ModalValueType } from "@/layout/Create/components/modal.types";
import { computed, reactive, ref, watch } from "vue";
import { DocumentCreateDataDocumentType, DocumentStatusType, DraftType } from "@/modules/Document/document.types";
import { deepEqual, formatDate2 } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { useDocumentStore } from "@/modules/Document/document.store";
import { useCommonStore } from "@/stores/common.store";
import { useSettingsStore } from "@/modules/Settings/store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

const model = defineModel<ModalValueType>();

const document = defineModel<DraftType | null>("document");

const props = defineProps<ModalPropsType>();

const authStore = useAuthStore();
const documentStore = useDocumentStore();
const commonStore = useCommonStore();
const settingsStore = useSettingsStore();

const form = reactive<DocumentCreateDataDocumentType>({
  doc_type_id: null,
  date: formatDate2(new Date()),
  to: "",
  to_id: null,
  to_type: "",
  from: "",
  from_id: null,
  from_type: "",
  number: "",
  subject: "",
  content: "",
});

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const required = ref(false);

const validationErrors = ref<Record<string, any> | null>(null);

const loading = computed(() => documentStore.createLoading || documentStore.updateLoading);

const sendForm = async (status: DocumentStatusType) => {
  form.status = status;

  if (status === "sent") required.value = true;

  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm = { ...form };
  delete newForm.to;

  try {
    if (document.value) {
      await documentStore.update(document.value.id, newForm);
      document.value.content = form.content ?? "";
      document.value.subject = form.subject ?? "";
      document.value.to_name = to.value;
    } else await documentStore.create(newForm);

    commonStore.successToast();
    model.value = false;
    validationErrors.value = null;
    model.value = false;

  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const respondentChange = (value: string, type: "from" | "to") => {
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

const clear = () => {
  v$.value?.clear();
  form.to_id = null;
  form.to_type = "";
  form.from_id = null;
  form.from_type = "";
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

  if (!document.value) return;
  await documentStore.fetchDocument(document.value.id);

  if (!documentStore.document) return;
  form.date = documentStore.document.date;
  form.number = documentStore.document.number;
  form.to_id = documentStore.document.to_id ?? null;
  form.to_type = documentStore.document.to_type ?? "";
  form.subject = documentStore.document.subject ?? "";
  form.content = documentStore.document.content ?? "";

  if (form.to_id && form.to_type) form.to = `${form.to_id}_${form.to_type}`;
};

const openModal = async () => {
  required.value = false;
  if (!settingsStore.respondents.length) settingsStore.fetchRespondents();

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
      <AppOverlay
        :loading="documentStore.documentLoading"
        parent-class-name="w-[65%] border-[#E2E6F3] bg-[#fff] border rounded-[15px]"
        class="px-[72px] pb-[150px]"
      >
        <header class="flex items-center justify-center my-[24px] mb-6">
          <img
            src="@/assets/images/logo.svg"
            alt="logo"
          >
          <div class="flex flex-col ml-3">
            <b class="text-[#000D24] text-lg">NKMK</b>
            <span class="text-[#CBCCCE]">Jamg‘armasi</span>
          </div>
        </header>
        <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">ЗАПРОС</h1>

        <div class="flex items-center mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-semibold">Дата:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.date }}</span>
        </div>

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-semibold">№:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.number || "NK-00000" }}</span>
        </div>

        <div class="flex items-baseline mb-6">
          <h1 class=" text-sm font-medium">
            <span class="text-[#4F5662] font-semibold">Тип запроса:</span>
            <span class="text-[#A8AAAE] ml-2">Свободный запрос</span>
          </h1>
        </div>
        <div class="flex items-baseline mb-[24px]">
          <h1 class=" text-[14px] font-medium">
            <span class="text-[#4F5662] font-semibold">Получатель: </span>
            <span class="text-[#A8AAAE] ml-2">{{ to }}</span>
          </h1>
        </div>

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-semibold">Тема:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.subject }}</span>
        </div>

        <div class="text-[#4F5662] text-[14px]">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ form.content }}
        </div>

        <div class="mt-[40px] flex items-center gap-x-[100px] justify-between">
          <div class="flex items-baseline max-w-[200px]">
            <h1 class=" text-sm font-medium">
              <span class="text-[#4F5662] font-semibold">Отправитель:</span>
              <span
                v-if="from"
                class="text-[#A8AAAE] ml-2"
              >{{ from.position }} ({{ from.workplace }})</span>
            </h1>
          </div>

<!--          <img-->
<!--            src="@/assets/images/icons/qr.svg"-->
<!--            alt="qr"-->
<!--          />-->

          <h1 class="text-[#A8AAAE] text-sm">{{ authStore.userFullName }}</h1>
        </div>
      </AppOverlay>

      <div class="w-[35%] ml-6 flex flex-col justify-between">
        <AppForm
          :value="form"
          :validation-errors
          @validation="setValidation"
          @submit.prevent
        >
          <AppInput
            label="Накладние"
            placeholder="Запрос"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            label="Тип запроса"
            placeholder="Свободный запрос"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />

          <AppSelect
            v-model="form.to"
            prop="to"
            placeholder="Выберите"
            label="Получатель"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :loading="settingsStore.respondentsLoading"
            @change="(value) => respondentChange(value as string, 'to')"
            :required
            trigger="blur"
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
            placeholder="Тема"
            label="Тема"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :required
            :max="100"
            :maxlength="100"
          />
          <AppDatePicker
            label="Дата создания документа"
            :placeholder="form.date"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />
          <AppInput
            v-model="form.number"
            prop="number"
            label="№ документа"
            placeholder="Автоматически"
            label-class="text-[#A8AAAE] text-xs font-medium"
            disabled
          />

          <AppInput
            v-model="form.content"
            prop="content"
            placeholder="Содержание запроса"
            type="textarea"
            :rows="5"
            label="Содержание запроса"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :required
            :maxlength="1000"
            :max="1000"
          />

          <AppSelect
            v-model="form.from"
            prop="from"
            placeholder="Отправитель"
            label="Отправитель"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :disabled="authStore.disabledUserWorkplace"
            @change="(value) => respondentChange(value as string, 'to')"
          >
            <ElOption
              v-for="item in authStore.user.workplaces"
              :key="`${item.workplace_type}_${item.workplace_type}`"
              :value="`${item.workplace_id}_${item.workplace_type}`"
              :label="item.workplace"
            />
          </AppSelect>
        </AppForm>

        <div class="flex items-start justify-between gap-x-2">
          <button
            class="custom-cancel-btn"
            @click="closeModal"
          >
            Отменить
          </button>
          <ElButton
            :loading="form.status ==='draft' ? loading : false"
            type="primary"
            size="large"
            @click="sendForm('draft')"
            class="custom-apply-btn h-[41px] w-[212px]"
          >
            Сохранить как черновик
          </ElButton>
          <ElButton
            :loading="form.status ==='sent' ? loading : false"
            type="success"
            size="large"
            @click="sendForm('sent')"
            class="custom-send-btn h-[41px] w-[116px] !ml-0"
          >
            Отправить
          </ElButton>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
