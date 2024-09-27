<script setup lang="ts">
import { computed, h, shallowRef, useSlots } from "vue";
import {
  AppDatePickerPropsType,
  AppDatePickerValueType,
} from "@/components/ui/form/app-date-picker/app-date-picker.type";
import CalendarIcon from "@/assets/images/icons/calendar.svg";
import { getRules, setRules } from "@/components/ui/form/validate";

const model = defineModel<AppDatePickerValueType>();

const props = withDefaults(defineProps<AppDatePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "Select",
  format: "YYYY/MM/DD",
  type: "date",
});

const slots = useSlots();

const appDatePickerClasses = computed<string[]>(() => {
  const classes = ["app-date-picker app-form-item"];

  if (props.size) {
    classes.push(`app-select--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const prefixIcon = shallowRef({
  render() {
    return h("svg", {
      "data-src": CalendarIcon,
      class: "app-date-picker__icon",
    });
  },
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
    :error
    :class="appDatePickerClasses"
  >
    <template
      v-if="slots.label"
      #label
    >
      {{ slots.label }}
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
      :prefix-icon="prefixIcon"
      :disabled-date
      :cell-class-name
      :teleported
      :empty-values
      class="app-date-picker__date-picker"
    />
  </ElFormItem>
</template>

<style lang="scss">
.app-date-picker {
  &__date-picker {
    --el-date-editor-width: 100%;

    .el-input {
      &__wrapper {
        flex-direction: row-reverse;
      }
    }
  }
}
</style>
