<script
    setup
    lang="ts"
>

import type {
  AppTimePickerPropsType,
  AppTimePickerValueType
} from "@/components/ui/form/app-time-picker/app-time-picker.type";
import { computed, inject, ref, Ref, useSlots, watch } from "vue";
import { getRules, setRules } from "@/components/ui/form/validate";
import { ValidationErrorsType } from "@/components/ui/form/form.type";

const model = defineModel<AppTimePickerValueType>();

const props = withDefaults(defineProps<AppTimePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "— : —",
  prefixIcon: "ss",
  format: "HH:mm",
  valueFormat: "HH:mm:ss",
  labelClass: ""
});

const emit = defineEmits<{
  change: [value: AppTimePickerValueType]
}>();

const slots = useSlots();

const validationErrors = inject<Ref<ValidationErrorsType>>("validation-errors", ref(null));
const ignoreValidationError = ref(false);

const computedError = computed(() => {
  if (props.error) return props.error;

  else if (ignoreValidationError.value) return "";

  else if (validationErrors.value && props.prop && typeof (props.prop) === "string" && validationErrors.value[props.prop]) {
    return validationErrors.value[props.prop];
  }

  return "";
});

const appTimePickerClasses = computed<string[]>(() => {
  const classes = ["app-time-picker app-form-item"];

  if (props.size) {
    classes.push(`app-time-picker--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const change = (value: AppTimePickerValueType) => {
  ignoreValidationError.value = !!validationErrors.value;
  emit("change", value);
};

watch(validationErrors, (newErrors) => {
  ignoreValidationError.value = false;
}, {
  deep: true
});

</script>

<template>
  <ElFormItem
      :label
      :label-position
      :required
      :size
      :rules="setRules(getRules(props))"
      :prop
      :error="computedError"
      :class="appTimePickerClasses"
  >
    <template
        v-if="slots.label || label"
        #label
    >
      <span :class="labelClass">
      <slot
          v-if="slots.label"
          name="label"
      />
        <template v-else>
          {{ label }}
        </template>
      </span>
    </template>
    <ElTimePicker
        v-model="model"
        :id
        :placeholder
        :disabled
        :readonly
        :size
        :name
        :clearable
        :editable
        :start-placeholder
        :end-placeholder
        :is-range
        :arrow-control
        :range-separator
        :format
        :default-value
        :value-format
        :prefix-icon
        :disabled-hours
        :disabled-seconds
        :teleported
        :empty-values
        @change="change"
        class="app-time-picker__time-picker"
    />
  </ElFormItem>
</template>