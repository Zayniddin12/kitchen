<script setup lang="ts">
import {
  AppSelectPropsType,
  AppSelectValueType,
} from "@/components/ui/form/app-select/app-select.type";
import { computed, readonly, useSlots } from "vue";
import { getRules, setRules } from "@/components/ui/form/validate";

const model = defineModel<AppSelectValueType>({
  default: "",
});

const props = withDefaults(defineProps<AppSelectPropsType>(), {
  labelPosition: "top",
  itemValue: "",
  itemLabel: "",
});

const slots = useSlots();

const appSelectClasses = computed<string[]>(() => {
  const classes = ["app-select app-form-item"];

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
    :class="appSelectClasses"
    :size
    :prop
    :error
    :rules="setRules(getRules(props))"
  >
    <template
      v-if="slots.label"
      #label
    >
      {{ slots.label }}
    </template>
    <ElSelect
      v-model="model"
      :value-key="itemValue"
      :size
      :placeholder
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
    >
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
      <template #footer v-if="slots.footer">
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
