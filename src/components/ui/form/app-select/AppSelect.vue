<script setup lang="ts">
import {
  AppSelectPropsType,
  AppSelectValueType,
} from "@/components/ui/form/app-select/app-select.type";
import { computed, readonly, useSlots } from "vue";

const model = defineModel<AppSelectValueType>();

const props = withDefaults(defineProps<AppSelectPropsType>(), {
  labelPosition: "top",
  itemValue: "",
  itemLabel: "",
});

const slots = useSlots();

const appSelectClasses = computed<string[]>(() => {
  const classes = ["app-input app-form-item"];

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
    >
      <ElOption
        v-for="item in items"
        :key="item[itemValue]"
        :label="item[itemLabel]"
        :value="item[itemValue]"
      />
    </ElSelect>
  </ElFormItem>
</template>
