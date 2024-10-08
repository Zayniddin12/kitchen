<script
    setup
    lang="ts"
>
import { computed, h, shallowRef, useSlots } from "vue";
import {
  AppDatePickerPropsType,
  AppDatePickerValueType
} from "@/components/ui/form/app-date-picker/app-date-picker.type";
import CalendarIcon from "@/assets/images/icons/calendar.svg";
import { getRules, setRules } from "@/components/ui/form/validate";

const model = defineModel<AppDatePickerValueType>();

const props = withDefaults(defineProps<AppDatePickerPropsType>(), {
  labelPosition: "top",
  placeholder: "Выбирать",
  format: "YYYY/MM/DD",
  type: "date",
  labelClass: "",
  iconPosition: "end"
});

const slots = useSlots();

const appDatePickerClasses = computed<string[]>(() => {
  const classes = ["app-date-picker app-form-item"];

  if (props.size) {
    classes.push(`app-date-picker--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const icon = shallowRef({
  render() {
    return h("svg", {
      "data-src": CalendarIcon,
      class: "app-date-picker__icon"
    });
  }
});
</script>
<template>
  <ElFormItem
      :label-position
      :required
      :size
      :rules="setRules(getRules(props))"
      :prop
      :error
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
