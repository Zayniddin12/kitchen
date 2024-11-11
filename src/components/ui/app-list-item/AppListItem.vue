<script
    setup
    lang="ts"
>

import { AppListItemPropsType } from "@/components/ui/app-list-item/app-list-item.types";

const props = defineProps<AppListItemPropsType>();

</script>

<template>
  <component
      :is="to ? 'RouterLink' : 'div'"
      :to
      class="app-list-item"
  >

  </component>
</template>

<style lang="scss">
.app-list-item {
  padding: 10px 10px 10px 12px;
  @apply rounded-lg flex items-center justify-center;
}
</style>