<script
  setup
  lang="ts"
>
import { computed, inject, onMounted, provide, reactive, useTemplateRef, watch, watchEffect } from "vue";
import {
  AppFormPropsType,
  ValidationType,
} from "@/components/ui/form/app-form/app-form.type";

const props = withDefaults(defineProps<AppFormPropsType>(), {
  labelPosition: "top",
  validationErrors: null,
});

const emit = defineEmits<{
  (event: "validation", value: ValidationType): void;
}>();

const appForm = useTemplateRef("app-form");

const validation = reactive<ValidationType>({
  validate: (): Promise<boolean> => {
    return new Promise(async resolve => {
      if (!appForm.value) return resolve(false);

      return await appForm.value.validate(valid => {
        if (valid) resolve(true);
        else {
          return resolve(false);
        }
      });
    });
  },
  clearValidate: (): void => {
    if (!appForm.value) return;
    appForm.value.clearValidate();
  },
  resetForm: (): void => {
    if (!appForm.value) return;

    appForm.value.resetFields();
  },

  clear: async function(): void {
    await this.resetForm();
    await this.clearValidate();
  },
});

const appValidationErrors = computed(() => props.validationErrors);

provide("validation-errors", appValidationErrors);

onMounted(() => {
  emit("validation", validation);
});

const submit = () => {
  if (props.submit) props.submit();
};

</script>
<template>
  <ElForm
      ref="app-form"
      class="app-form"
      :model="props.value"
      :label-position
      :size
      :status-icon
      @submit.prevent="submit"
  >
    <slot />
  </ElForm>
</template>
