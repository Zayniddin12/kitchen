<script
  setup
  lang="ts"
>
import { AppSelectPropsType, AppSelectValueType } from "@/components/ui/form/app-select/app-select.type";
import { computed, inject, onMounted, ref, Ref, useSlots, watch } from "vue";
import { getRules, setRules } from "@/components/ui/form/validate";
import { ValidationErrorsType } from "@/components/ui/form/form.type";
import { AppDatePickerValueType } from "@/components/ui/form/app-date-picker/app-date-picker.type";
import { useI18n } from "vue-i18n";

const model = defineModel<AppSelectValueType>({
  default: "",
});

const emit = defineEmits<{
  change: [value: AppSelectValueType]
  input: [value: AppSelectValueType]
  clear: [value: AppSelectValueType]
}>();

const props = withDefaults(defineProps<AppSelectPropsType>(), {
  labelPosition: "top",
  itemValue: "",
  itemLabel: "",
  labelClass: "",
  persistent: true,
});

const { t } = useI18n();

const computedPlaceholder = computed(() => {
  return props.placeholder ?? t("form.select");
});

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

const appSelectClasses = computed<string[]>(() => {
  const classes = ["app-select app-form-item"];

  if (props.size) {
    classes.push(`app-select--${props.size} app-form-item--${props.size}`);
  }

  return classes;
});

const change = (value: AppSelectValueType): void => {
  ignoreValidationError.value = !!validationErrors.value;
  emit("change", value);
};

const input = (value: AppSelectValueType) => {
  ignoreValidationError.value = !!validationErrors.value;
  emit("input", value);
};
const clear = (value: any) => {
  emit("clear", value);
};

watch(validationErrors, (newErrors) => {
  ignoreValidationError.value = false;
}, {
  deep: true,
});

watch(model, (val) => {
  input(val);
}, {
  immediate: true,
});
</script>

<template>
  <ElFormItem
    :label-position
    :required
    :class="appSelectClasses"
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
    <ElSelect
      v-model="model"
      :value-key="itemValue"
      :size
      :placeholder="computedPlaceholder"
      :readonly
      :disabled
      :clearable
      :name
      :suffix-icon
      :multiple
      :multiple-limit
      :collapse-tags
      :collapseTagsTooltip
      :maxCollapseTags
      :loading
      :loading-text
      :filterable
      :no-match-text
      :no-data-text
      :popper-class
      :default-first-option
      :teleported
      :persistent
      :automatic-dropdown
      :placement
      class="app-select__select"
      @change="change"
      @input="input"
      @clear="clear"
      :remote-method
      :remote-show-suffix
      :remote
    >
      <template v-if="!slots.default">
        <ElOption
          v-for="item in items"
          :key="item[itemValue]"
          :label="item[itemLabel]"
          :value="item[itemValue]"
        >
          <slot
            v-if="slots.option"
            name="option"
            v-bind="item"
          />
        </ElOption>
      </template>
      <slot />
      <template
        #footer
        v-if="slots.footer"
      >
        <slot
          name="footer"
        />
      </template>
    </ElSelect>
  </ElFormItem>
</template>

<style lang="scss">
.app-select {
  --app-select-height: var(--el-component-size);

  &--small {
    --app-select-height: var(--el-component-size-small);
  }

  &--large {
    --app-select-height: var(--el-component-size-large);
  }

  &__select {
    .el-select {
      &__wrapper {
        min-height: var(--app-select-height);
      }

      &__caret {
        color: #4f4d55;
      }

      &-dropdown__item {
        height: var(--app-select-height);
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
