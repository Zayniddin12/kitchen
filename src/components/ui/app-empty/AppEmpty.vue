<script
    setup
    lang="ts"
>

import { AppEmptyPropsType } from "@/components/ui/app-empty/app-empty.types";

const props = withDefaults(defineProps<AppEmptyPropsType>(), {
  description: "Нет информации"
});

</script>

<template>
  <ElEmpty
      class="h-[60vh]"
      :description
  />
</template>