<script
    setup
    lang="ts"
>

import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { ModalPropsType, ModalValueType } from "@/layout/Create/components/modal.types";
import { DocumentCreateDataDocumentType, DocumentStatusType, DraftType } from "@/modules/Document/document.types";
import { computed, reactive, ref, watch } from "vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { deepEqual, formatDate2 } from "@/utils/helper";
import { useSettingsStore } from "@/modules/Settings/store";
import { useCommonStore } from "@/stores/common.store";
import { useDocumentStore } from "@/modules/Document/document.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

interface PropsType extends ModalPropsType {
  title: string,
}

const model = defineModel<ModalValueType>();

const draft = defineModel<DraftType | null>("draft");

const props = defineProps<PropsType>();

const settingsStore = useSettingsStore();
const commonStore = useCommonStore();
const documentStore = useDocumentStore();

const form = reactive<DocumentCreateDataDocumentType>({
  doc_type_id: null,
  date: formatDate2(new Date()),
  to_type: "",
  to_id: null,
  subject: "",
  number: "",
  content: "",
  status: ""
});

const oldForm = ref<null | DocumentCreateDataDocumentType>(null);

const v$ = ref<ValidationType | null>(null);

const { confirm } = useConfirm();

const validationErrors = ref<Record<string, any> | null>(null);

const sendForm = async (status: DocumentStatusType) => {
  form.status = status;

  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm = { ...form };

  try {
    if (draft.value) {
      delete newForm.doc_type_id;

      await documentStore.update(draft.value.id, newForm);
    } else {
      await documentStore.create(newForm);
    }

    commonStore.successToast();
    validationErrors.value = null;
    model.value = false;
  } catch (error: any) {
    if (error.error.code === 422) {
      validationErrors.value = error.meta.validation_errors;
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

  v$.value?.clear();
  model.value = false;
};

const openModal = () => {
  form.doc_type_id = props.id;
  settingsStore.fetchRespondents();

  if (draft.value) {
    form.date = draft.value.date;
    form.number = draft.value.number;
    form.subject = draft.value.subject ?? "";
    form.content = draft.value.content ?? "";
    // form.to_id = draft.value.to;
  }

  oldForm.value = JSON.parse(JSON.stringify(form));
};

watch(model, (newModel) => {
  if (newModel) openModal();
});

const respondentChange = (value: string, type: "from" | "to") => {
  const values = value.split("_");
  form[`${type}_id`] = Number(values[0]);
  form[`${type}_type`] = values[1];
};

const to = computed<string>(() => {
  if (!form.to_id || !form.to_type) return "";
  const activeEl = settingsStore.respondents.find(
      el => el.model_type === form.to_type && el.id === form.to_id
  );

  if (!activeEl) return "";

  return activeEl.name;
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

    <AppOverlay
        :loading
        class="flex"
    >
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[65%] mr-0">
        <div class="px-[72px] pb-[150px]">
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
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">СЛУЖЕБНАЯ ЗАПИСКА</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.date }}</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.number }}</span>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662]">Кому:</span>
              <span class="text-[#A8AAAE] ml-2">{{ to }}</span>
            </h1>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Тема:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ form.subject }}</span>
          </div>

          <div
              v-if="form.content"
              class="text-[#4F5662] text-[14px]"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ form.content }}
          </div>

          <div class="mt-[40px] flex items-center justify-between">
            <div class="flex items-baseline mb-[24px] w-[200px]">
              <h1 class=" text-[14px] font-medium">
                <span class="text-[#4F5662]">Отправитель:</span>
                <span class="text-[#A8AAAE] ml-2">Руководитель группы отдела координации общественного питания</span>
              </h1>
            </div>

            <img
                src="@/assets/images/icons/qr.svg"
                alt="qr"
            />

            <h1 class="text-[#A8AAAE] text-[14px] mr-[100px]">Эргашева Л.</h1>
          </div>
        </div>
      </div>

      <div class="w-[35%] ml-[24px] flex flex-col justify-between">
        <AppForm
            :value="form"
            @validation="(value:ValidationType) => v$ = value"
            @submit.prevent
            :validation-errors="validationErrors"
        >
          <AppInput
              placeholder="Служебная записка"
              label="Название документа"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              disabled
          />
          <AppDatePicker
              :placeholder="form.date"
              label="Дата создания документа"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              disabled
          />
          <AppInput
              v-model="form.number"
              prop="number"
              label="№ документа"
              placeholder="№ документа"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              required
          />

          <AppSelect
              prop="to_id"
              placeholder="Выберите"
              label="Кому"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              :loading="settingsStore.respondentsLoading"
              @change="(value) => respondentChange(value as string, 'to')"
              required
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
              placeholder="Введите"
              label="Тема"
              label-class="text-[#A8AAAE] text-xs font-medium"
              required
          />

          <AppInput
              v-model="form.content"
              prop="content"
              label="Сообщения"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              placeholder="Отображение сообщения служебки"
              type="textarea"
              :rows="5"
              required
          />

          <AppInput
              placeholder="Выберите"
              label="Отправитель"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              disabled
          />
        </AppForm>

        <div class="flex items-start justify-between">
          <button
              class="custom-cancel-btn"
              @click="closeModal"
          >
            Отменить
          </button>
          <button
              @click="sendForm('draft')"
              class="custom-apply-btn"
          >Сохранить как черновик
          </button>
          <button
              @click="sendForm('sent')"
              class="custom-send-btn"
          >
            Отправить
          </button>
        </div>
      </div>
    </AppOverlay>
  </el-dialog>
</template>
