<script
  setup
  lang="ts"
>
import {
  AppInputPropsType,
  AppInputValueType,
} from "@/components/ui/form/app-input/app-input.type";
import { computed, inject, ref, Ref, useSlots, watch } from "vue";
import { vMaska } from "maska/vue";
import { setRules } from "@/components/ui/form/validate";
import { ValidationErrorsType } from "@/components/ui/form/form.type";

const [model, modifiers] = defineModel<AppInputValueType>();

const props = withDefaults(defineProps<AppInputPropsType>(), {
  type: "text",
  labelPosition: "top",
  labelClass: "",
  min: 0,
  minLength: 0,
});

const updateModelValue = (value: any) => {
  model.value = value;
};

const emit = defineEmits<{
  change: [value: AppInputValueType];
}>();

const validationErrors = inject<Ref<ValidationErrorsType>>(
  "validation-errors",
  ref(null),
);
const ignoreValidationError = ref(false);

const computedError = computed(() => {
  if (props.error) return props.error;
  else if (ignoreValidationError.value) return "";
  else if (
    validationErrors.value &&
    props.prop &&
    typeof props.prop === "string" &&
    validationErrors.value[props.prop]
  ) {
    return validationErrors.value[props.prop];
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

const computedType = computed(() => {
  return props.customType ?? props.type;
});

const computedMin = computed(() => {
  if (props.min) return props.min;

  if (computedType.value === "passport") return 10;

    if (computedType.value === "number") return 0.1;
});

const computedMax = computed(() => {
  if (props.max) return props.max;

  if (computedType.value === "passport") return 10;
})

const computedRules = computed(() => {
  return setRules({
    required: props.required,
    min: computedMin.value,
    max: computedMax.value,
    type: computedType.value,
  });
});

const computedMask = computed(() => {
  if (props.mask) return props.mask;

  switch (computedType.value) {
    case "tel":
      return "## ###-##-##";
    case "passport":
      return {
        mask: "AA #######",
        tokens: {
          "A": {
            pattern: /[A-Z]/,
            transform: (chr: string) => chr.toUpperCase(),
          },
        },
      };
    default:
      return "";
  }
});

const change = (value: AppInputValueType) => {
  ignoreValidationError.value = !!validationErrors.value;
  emit("change", value);
};

watch(
  validationErrors,
  () => {
    ignoreValidationError.value = false;
  },
  {
    deep: true,
  },
);


</script>

<template>
  <ElFormItem
    :label-position
    :required
    :class="appInputClasses"
    :size
    :prop
    :error="computedError"
    :rules="computedRules"
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
      :parser
      :show-password
      v-maska="computedMask"
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
      :maxlength="props.maxlength ?? computedMax"
      :minlength="props.minlength ?? computedMin"
      :showWordLimit
      :inputStyle
      class="app-input__input"
      @change="change"
    >
      <template
        v-if="slots.prepend || type === 'tel' || prepend"
        #prepend
      >
        <slot
          v-if="slots.prepend"
          name="prepend"
        />
        <template v-else-if="prepend">
          {{ prepend }}
        </template>
        <template v-else>+998</template>
      </template>
      <template
        v-if="slots.append || append"
        #append
      >
        <slot
          v-if="slots.append"
          name="append"
        />
        <template v-else>
          {{ append }}
        </template>
      </template>
    </ElInput>
  </ElFormItem>
</template>

<style lang="scss">
.app-input {
  .el-input__prefix {
    margin-right: 7px;
  }
}
</style>
