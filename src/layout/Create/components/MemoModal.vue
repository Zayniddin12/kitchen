<script
  setup
  lang="ts"
>

import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { ModalPropsType, ModalValueType } from "@/layout/Create/components/modal.types";
import {
  DocumentCreateDataDocumentType,
  DocumentStatusType,
  DraftType,
} from "@/modules/Document/document.types";
import { computed, reactive, ref, watch } from "vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { deepEqual, formatDate2 } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";
import { useCommonStore } from "@/stores/common.store";
import { useDocumentStore } from "@/modules/Document/document.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import QrCode from "@/components/workplaces/qr-code/QrCode.vue";
import { useI18n } from "vue-i18n";

const model = defineModel<ModalValueType>();

const document = defineModel<DraftType | null>("document");

const props = defineProps<ModalPropsType>();

const { t } = useI18n();

const settingsStore = useSettingsStore();
const commonStore = useCommonStore();
const documentStore = useDocumentStore();
const authStore = useAuthStore();

const form = reactive<DocumentCreateDataDocumentType>({
  doc_type_id: null,
  date: formatDate2(new Date()),
  to: "",
  to_type: "",
  to_id: null,
  from: "",
  from_id: null,
  from_type: "",
  subject: "",
  number: "",
  content: "",
  status: "",
});

const required = ref(false);

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);

const v$ = ref<ValidationType | null>(null);

const { confirm } = useConfirm();

const validationErrors = ref<Record<string, any> | null>(null);

const sendForm = async (status: DocumentStatusType) => {
  required.value = status === "sent";

  form.status = status;

  if (status == "draft") {

    const newForm = { ...form };
    delete newForm.to;

    try {
      if (document.value) {
        delete newForm.doc_type_id;

        await documentStore.update(document.value.id, newForm);
        document.value.content = form.content ?? "";
        document.value.subject = form.subject ?? "";
        document.value.to_name = to.value;
      } else {
        await documentStore.create(newForm);
      }

      commonStore.successToast();
      validationErrors.value = null;
      model.value = false;
    } catch (error: any) {
      if (error?.error?.code === 422) {
        validationErrors.value = error.meta.validation_errors;
      }
    }
  } else {
    if (!v$.value) return;

    if (!(await v$.value.validate())) {
      commonStore.errorToast(t("error.validation"));
      return;
    }

    const newForm = { ...form };
    delete newForm.to;

    try {
      if (document.value) {
        delete newForm.doc_type_id;

        await documentStore.update(document.value.id, newForm);
        document.value.content = form.content ?? "";
        document.value.subject = form.subject ?? "";
        document.value.to_name = to.value;
      } else {
        await documentStore.create(newForm);
      }

      commonStore.successToast();
      validationErrors.value = null;
      model.value = false;
    } catch (error: any) {
      if (error?.error?.code === 422) {
        validationErrors.value = error.meta.validation_errors;
      }
    }
  }
};

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

const clear = () => {
  v$.value?.clear();
  form.to_id = null;
  form.to_type = "";
  form.to = "";
  form.from_type = "";
  form.from_id = null;
};

const setForm = async () => {
    form.doc_type_id = props.id ?? null;

    if (authStore.disabledUserWorkplace) {
      const activeWorkplace = authStore.user.workplaces[0];
      // if (activeWorkplace.workplace_id) {
      //   form.from_id = activeWorkplace.workplace_id;
      //   form.from_type = activeWorkplace.workplace_type;
      //   // form.from = `${activeWorkplace.workplace_id}_${activeWorkplace.workplace_type}`;
      //   form.from = `${authStore.user.id}_user`;
      //   console.log(authStore.user);
      // } else {
      form.from_id = authStore.user.id;
      form.from_type = "user";

      form.from = `${authStore.user.id}_user`;
      // }
    }
    ;

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
  }
;

const toList = ref<any>([]);

const filterUser = computed(() => {
  if (authStore.user.id) {
    return toList.value.filter(user => user.id !== authStore.user.id);
  }
  return toList.value;
});

const openModal = async () => {
  required.value = false;

  toList.value = await settingsStore.fetchRespondents({ type: ["user"] });

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

const respondentChange = (value: string, type: "from" | "to") => {
  const values = value.split("_");
  form[type] = value;
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
      <div
        v-if="title"
        class="text-center text-[#000000] font-bold text-[18px]"
      >
        {{ title }}
      </div>
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
            {{ t("document.memo.title") }}</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">{{ t("common.date") }}:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.date }}</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.number }}</span>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662]">{{ t("document.whom.to") }}:</span>
              <span class="text-[#A8AAAE] ml-2">{{ to }}</span>
            </h1>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">{{ t("common.theme") }}:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.subject }}</span>
          </div>

          <div
            v-if="form.content"
            class="text-[#4F5662] text-[14px]"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ form.content }}
          </div>
          <div class="mt-[40px] flex items-center gap-x-[100px] justify-between">
            <div class="flex items-baseline  max-w-[200px]">
              <h1 class=" text-[14px] font-medium">
                <span class="text-[#4F5662]">{{ t("common.sender") }}:</span>
                <span
                  v-if="from"
                  class="text-[#A8AAAE] ml-2"
                >{{ from.position }} ({{ from.workplace }})</span>
              </h1>
            </div>

            <!--            <QrCode/>-->

            <h1 class="text-[#A8AAAE] text-[14px]">{{ authStore.userFullName }}</h1>
          </div>
        </AppOverlay>
      </div>

      <div class="w-[35%] ml-[24px] flex flex-col justify-between">
        <AppForm
          :value="form"
          @validation="(value:ValidationType) => v$ = value"
          @submit.prevent
          :validation-errors="validationErrors"
        >
          <AppInput
            :placeholder="t('document.memo.title')"
            :label="t('document.title')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            disabled
          />
          <AppInput
            v-model="form.number"
            prop="number"
            :label="t('document.number')"
            :placeholder="t('document.number')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            required
            :max="20"

          />
          <AppDatePicker
            :placeholder="form.date"
            :label="t('document.creationDate')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            disabled
          />
          <AppSelect
            v-model="form.to"
            prop="to"
            filterable
            :label="t('document.whom.to')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :loading="settingsStore.respondentsLoading"
            @change="(value) => respondentChange(value as string, 'to')"
            required
          >
            <ElOption
              v-for="item in filterUser"
              :key="`${item.id}_${item.model_type}`"
              :value="`${item.id}_${item.model_type}`"
              :label="item.name"
            />
          </AppSelect>
          <AppInput
            v-model="form.subject"
            prop="subject"
            :placeholder="t('form.enter')"
            :label="t('common.theme')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            required
            :max="100"
          />

          <AppInput
            v-model="form.content"
            prop="content"
            :label="t('common.message')"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            :placeholder="t('document.memo.message')"
            type="textarea"
            :rows="5"
            required
            :max="1000"
          />

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
                v-for="item in toList"
                :key="`${item.id}_${item.model_type}`"
                :value="`${item.id}_${item.model_type}`"
                :label="item.name"
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
          >
            {{ t("method.saveAsDraft") }}
          </ElButton>
          <ElButton
            :loading="form.status ==='sent' ? loading : false"
            type="success"
            size="large"
            @click="sendForm('sent')"
            class="custom-send-btn h-[41px] !w-[116px] !ml-0"
          >
            {{ t("method.send") }}
          </ElButton>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
