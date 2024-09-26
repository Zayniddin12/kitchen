<script setup lang="ts">
import {
  AppInputPropsType,
  AppInputValueType,
} from "@/components/ui/form/app-input/app-input.type";
import { computed, useSlots } from "vue";
import { vMaska } from "maska";

const [model, modifiers] = defineModel<AppInputValueType>();

const updateModelValue = (value: AppInputValueType) => {
  model.value = value;
};

const props = withDefaults(defineProps<AppInputPropsType>(), {
  type: "text",
  labelPosition: "top",
});

const appInputClasses = computed<string[]>(() => {
  const classes = [`app-input app-form-item`];

  if (props.size) {
    classes.push(`app-input--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const slots = useSlots();

const computedMask = computed(() =>
  props.type === "tel" && !props.mask ? "+998 ## ###-##-##" : props.mask
);

const inputMask = computed(() => {
  return { mask: computedMask.value };
});
</script>
<template>
  <ElFormItem
    :label
    :label-position
    :required
    :class="appInputClasses"
    :size
  >
    <template
      v-if="slots.label"
      #label
    >
      {{ slots.label }}
    </template>
    <ElInput
      v-bind="{
        modelValue: model,
        'onUpdate:modelValue': updateModelValue,
        ...modifiers,
      }"
      :type
      :formatter
      :parser
      :show-password
      v-maska:[inputMask]
      :readonly
      :disabled
      :placeholder
      :size
      :clearable
      :name
      :suffix-icon
      :prefix-icon
      :rows
      :autosize
      :maxlength
      :minlength
      :showWordLimit
      :inputStyle
      class="app-input__input"
    />
  </ElFormItem>
</template>
