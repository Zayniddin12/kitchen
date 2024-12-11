<script
  setup
  lang="ts"
>

import { AppEmptyPropsType } from "@/components/ui/app-empty/app-empty.types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<AppEmptyPropsType>();

const computedDescription = computed(() => {
  return props.description ?? t("common.empty");
});

</script>

<template>
  <ElEmpty
    class="h-[60vh]"
    :description="computedDescription"
  />
</template>