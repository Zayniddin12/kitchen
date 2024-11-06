<script
    setup
    lang="ts"
>
import { AppInputPropsType, AppInputValueType } from "@/components/ui/form/app-input/app-input.type";
import { computed, inject, toRefs, useSlots, watch, watchEffect } from "vue";
import { vMaska } from "maska";
import { getRules, setRules } from "@/components/ui/form/validate";
import { ValidationErrorsType } from "@/components/ui/form/form.type";

const [model, modifiers] = defineModel<AppInputValueType>();

const props = withDefaults(defineProps<AppInputPropsType>(), {
  type: "text",
  labelPosition: "top",
  labelClass: ""
});

const updateModelValue = (value: any) => {
  model.value = value;
};

const validationErrors = toRefs(inject<ValidationErrorsType>("validation-errors"));

const computedError = computed(() => {
  if (props.error) return props.error;

  else if (validationErrors && props.prop && typeof (props.prop) === "string" && validationErrors[props.prop]) {
    return validationErrors[props.prop];
  }

  return "";
});

const appInputClasses = computed<string[]>(() => {
  const classes = ["app-input app-form-item"];

  if (props.size) {
    classes.push(`app-input--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const slots = useSlots();

const computedMask = computed(() =>
    props.type === "tel" && !props.mask ? "## ###-##-##" : props.mask
);

const inputMask = computed(() => {
  return { mask: computedMask.value };
});

watch(validationErrors, (newValue) => {
  console.log(newValue);
});

</script>

<template>
  <ElFormItem
      :label-position
      :required
      :class="appInputClasses"
      :size
      :prop
      :error="computedError"
      :rules="setRules(getRules(props))"
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
    >
      <template
          v-if="slots.prepend || type === 'tel'"
          #prepend
      >
        <slot
            v-if="slots.prepend"
            name="prepend"
        />
        <template v-else>
          +998
        </template>
      </template>
      <template
          v-if="slots.append"
          #append
      >
        <slot name="append"/>
      </template>
    </ElInput>
  </ElFormItem>
</template>
