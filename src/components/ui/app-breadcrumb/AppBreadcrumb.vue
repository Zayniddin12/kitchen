<script
  setup
  lang="ts"
>
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { setItem } from "@/utils/localStorage";
import { BreadcrumbItemType } from "@/components/ui/app-breadcrumb/app-breadcrumb.type";
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const { breadcrumb, setBreadCrumb } = useBreadcrumb();
const route = useRoute();

const clickHome = () => {
  setItem("current-menu", "0");
};

type itemComponentTagType = "span" | "RouterLink" | "button";

const itemComponentTag = (breadcrumbItem: BreadcrumbItemType): itemComponentTagType => {
  if (breadcrumbItem.to) return "RouterLink";
  else if (breadcrumbItem.click) return "button";

  return "span";
};

watch(() => route.name, () => {
  setBreadCrumb([]);
});

</script>

<template>
  <div
    v-if="breadcrumb.length>0"
    class="mb-[26px] md:mt-0 -mt-5"
  >
    <div class="flex flex-wrap">
      <RouterLink
        :to="{name: 'home'}"
        @click="clickHome"
      >
        <img
          src="@/assets/home-breadcrumb.svg"
          class="h-5 w-5"
          alt="home icon"
        />
      </RouterLink>
      <div
        v-for="breadcrumbItem in breadcrumb"
        :key="breadcrumbItem.label"
        class="flex items-center"
      >
        <img
          src="@/assets/arrow-right.svg"
          alt="arrow icon"
          class="mx-3 w-1.5 h-2.5"
        />
        <component
          :is="itemComponentTag(breadcrumbItem)"
          :to="breadcrumbItem.to"
          @click="breadcrumbItem.click"
          :class="['text-[#A8AAAE] font-medium text-sm', {'text-dark-gray dark:text-primary': breadcrumbItem.isActionable}]"
        >
          {{ breadcrumbItem.label }}
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>