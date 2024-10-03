<script
    setup
    lang="ts"
>

import type {
  AppTimePickerPropsType,
  AppTimePickerValueType
} from "@/components/ui/form/app-time-picker/app-time-picker.type";
import { computed, useSlots } from "vue";
import { getRules, setRules } from "@/components/ui/form/validate";

const model = defineModel<AppTimePickerValueType>();

const props = withDefaults(defineProps<AppTimePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "— : —",
  prefixIcon: "ss",
  format: "HH:MM",
  labelClass: ""
});

const slots = useSlots();

const appTimePickerClasses = computed<string[]>(() => {
  const classes = ["app-time-picker app-form-item"];

  if (props.size) {
    classes.push(`app-time-picker--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

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
        :disabledHours
        :disabled-second
        :teleported
        :empty-values
        class="app-time-picker__time-picker"
    />
  </ElFormItem>
</template>

<style lang="scss">

</style>