<script
    setup
    lang="ts"
>

import { NavListPropsType } from "@/components/layouts/nav/nav-list/nav-list.types";
import { useTemplateRef, watch } from "vue";

const props = defineProps<NavListPropsType>();

const emit = defineEmits<{
  changeWidth: [value: number]
}>();

const navList = useTemplateRef("nav-list");

watch(() => navList.value?.offsetWidth, (newWidth) => {
  console.log(newWidth);
  if (typeof (newWidth) === "number") emit("changeWidth", newWidth);
});

</script>

<template>
  <div
      ref="nav-list"
      class="nav-list"
  >
    <div class="nav-list__header">
      <h6 class="nav-list__title">
        {{ title }}
      </h6>
    </div>
  </div>
</template>

<style lang="scss">
.nav-list {
  @apply px-6 py-4 w-[260px];
}
</style>