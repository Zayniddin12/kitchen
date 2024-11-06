<script setup lang="ts">
import { inject, onMounted, provide, reactive, useTemplateRef, watch, watchEffect } from "vue";
import {
  AppFormPropsType,
  ValidationType,
} from "@/components/ui/form/app-form/app-form.type";

const props = withDefaults(defineProps<AppFormPropsType>(), {
  labelPosition: "top",
  validationErrors: null
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
});

// provide("validation-errors", props.validationErrors);

onMounted(() => {
  emit("validation", validation);
});

watchEffect(() =>{
  const  value = inject("validation-errors");
  console.log("ssss",value);
})

</script>
<template>
  <ElForm
    ref="app-form"
    class="app-form"
    :model="props.value"
    :label-position
    :size
    :status-icon
  >
    <slot />
  </ElForm>
</template>
