<script setup lang="ts">
import { computed, useSlots } from "vue";
import {
  AppDatePickerPropsType,
  AppDatePickerValueType,
} from "@/components/ui/form/app-date-picker/app-date-picker.type";

const model = defineModel<AppDatePickerValueType>();

const props = withDefaults(defineProps<AppDatePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "Select",
});

const slots = useSlots();

const appDatePickerClasses = computed<string[]>(() => {
  const classes = ["app-date-picker app-form-item"];

  if (props.size) {
    classes.push(`app-select--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});
</script>
<template>
  <ElFormItem
    :label
    :label-position
    :required
    :size
    :prop
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
      :prefix-icon
      :disabled-date
      :cell-class-name
      :teleported
      :empty-values
      :value-on-clear
      class="app-date-picker__date-picker"
    ></ElDatePicker>
  </ElFormItem>
</template>

<style lang="scss">
.app-date-picker {
  &__date-picker {
    --el-date-editor-width: 100%;
  }
}
</style>
