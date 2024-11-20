<script
    setup
    lang="ts"
>

import { AppOverlayPropsType } from "@/components/ui/app-overlay/app-overlay.type";
import { useAttrs } from "vue";

const props = withDefaults(defineProps<AppOverlayPropsType>(), {
  loading: false,
  loadingSize: 40,
  tag: "div",
  rounded: 0
});

defineOptions({
  inheritAttrs: false
});

const attrs = useAttrs();

</script>

<template>
  <div :class="['app-overlay relative', parentClassName]">
    <component
        :is="tag"
        v-bind="attrs"
        :style="{borderRadius: `${rounded}px`}"
    >
      <slot/>
    </component>
    <div
        v-show="loading"
        class="absolute inset-0 z-10"
    >
      <div
          class="absolute bg-[#f6f6f6] inset-0 opacity-80 backdrop-blur-sm"
          :style="{borderRadius: `${rounded}px`}"
      ></div>
      <div class="center">
        <div
            aria-hidden="true"
            class="border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin !duration-100"
            :style="{width: `${loadingSize}px`, height: `${loadingSize}px`}"
        ></div>
      </div>
    </div>
  </div>
</template>