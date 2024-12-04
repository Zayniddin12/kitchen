<script
  setup
  lang="ts"
>
import { computed, h, inject, ref, Ref, shallowRef, useSlots, watch } from "vue";
import {
  AppDatePickerPropsType,
  AppDatePickerValueType,
} from "@/components/ui/form/app-date-picker/app-date-picker.type";
import CalendarIcon from "@/assets/images/icons/calendar.svg";
import { getRules, setRules } from "@/components/ui/form/validate";
import { ValidationErrorsType } from "@/components/ui/form/form.type";

const model = defineModel<AppDatePickerValueType>();

const props = withDefaults(defineProps<AppDatePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "Выберите",
  format: "DD.MM.YYYY",
  valueFormat: "DD.MM.YYYY",
  type: "date",
  editable: true,
  labelClass: "",
  iconPosition: "end",
  teleported: true,
});

const emit = defineEmits<{
  change: [value: AppDatePickerValueType]
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

const appDatePickerClasses = computed<string[]>(() => {
  const classes = ["app-date-picker app-form-item"];

  if (props.size) {
    classes.push(`app-date-picker--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const icon = shallowRef<any>({
  render() {
    return h("svg", {
      "data-src": CalendarIcon,
      class: "app-date-picker__icon",
    });
  },
});

const change = (value: AppDatePickerValueType) => {
  ignoreValidationError.value = !!validationErrors.value;
  emit("change", value);
};

watch(validationErrors, () => {
  ignoreValidationError.value = false;
}, {
  deep: true,
});

</script>
<template>
  <ElFormItem
    :label-position
    :required
    :size
    :rules="setRules(getRules(props))"
    :prop
    :error="computedError"
    :class="appDatePickerClasses"
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
    <ElDatePicker
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
      :type
      :format
      :popper-class
      :popper-options
      :range-separator
      :default-time
      :default-value
      :value-format
      :unlink-panels
      :prefix-icon="icon"
      :disabled-date
      :teleported
      :empty-values
      :class="['app-date-picker__date-picker', `app-date-picker__date-picker-icon--${iconPosition}`]"
      @change="change"
    />
  </ElFormItem>
</template>

<style lang="scss">
.app-date-picker {
  &__date-picker {
    --el-date-editor-width: 100%;

    &-icon {
      &--end .el-input__wrapper {
        flex-direction: row-reverse;
      }

      &--start .el-input__inner {
        padding-left: 7px;
      }
    }
  }
}
</style>
