<script
    setup
    lang="ts"
>
import { AppInputPropsType, AppInputValueType } from "@/components/ui/form/app-input/app-input.type";
import { computed, useSlots } from "vue";
import { vMaska } from "maska";
import { getRules, setRules } from "@/components/ui/form/validate";

const [model, modifiers] = defineModel<AppInputValueType>();

const updateModelValue = (value: any) => {
  model.value = value;
};

const props = withDefaults(defineProps<AppInputPropsType>(), {
  type: "text",
  labelPosition: "top",
  labelClass: ""
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
      :label-position
      :required
      :class="appInputClasses"
      :size
      :prop
      :error
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
          v-if="slots.prepend"
          #prepend
      >
        <slot name="prepend"/>
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
