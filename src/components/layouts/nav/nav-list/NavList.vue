<script
    setup
    lang="ts"
>

import { ModelValueType, NavListPropsType } from "@/components/layouts/nav/nav-list/nav-list.types";
import { useTemplateRef, watch } from "vue";
import PinIcon from "@/assets/images/icons/nav/nav-list/pin.svg";
import CloseIcon from "@/assets/images/icons/nav/nav-list/close.svg";

const model = defineModel<ModelValueType>();

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
  <Transition name="nested-reverse">
    <div
        v-show="model"
        ref="nav-list"
        class="nav-list"
    >
      <div class="nav-list__header">
        <h6 class="nav-list__title">
          {{ title }}
        </h6>
        <div class="flex items-center gap-x-3">
          <button class="size-6">
            <svg
                :data-src="PinIcon"
                class="size-6"
            />
          </button>
          <button
              @click="model = false"
              class="size-6"
          >
            <svg
                :data-src="CloseIcon"
                class="size-6"
            />
          </button>
        </div>
      </div>
      <div class="nav-list__body nav-list__wrapper">
        <div
            v-for="item in items"
            :key="item.key"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.nav-list {
  @apply px-6 py-4 w-[260px];

  &__header {
    @apply flex items-center justify-between gap-x-3;
  }

  &__title {
    @apply text-black font-medium text-xl;
  }

  &__body {
    @apply mt-8;
  }

  &__wrapper {
    @apply flex flex-col gap-y-1;
  }
}
</style>