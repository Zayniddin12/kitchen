<script lang="ts" setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const breadcrumbList = computed(() => {
  const breadcrumbs = route.meta.breadcrumb ? [...route.meta.breadcrumb] : [];

  if (breadcrumbs.length > 1 && route.params.title) {
    breadcrumbs[1].label = route.params.title;
  }
  if (breadcrumbs.length > 2 && route.params.title) {
    breadcrumbs[2].label = route.params.id3;
  }
  if (breadcrumbs.length > 3 && route.params.title) {
    breadcrumbs[3].label = route.params.kithchen;
  }

  return breadcrumbs;
});

const changeRoute = (item: any) => {
  if (item.redirectWithParams) {
    router.push(item.redirectWithParams(route));
  } else if (item.to) {
    router.push({ name: item.to, query: item.query });
  }
};

watch(
  () => route.params,
  (newParams, oldParams) => {
    console.log(`Route params changed from ${oldParams.title} to ${newParams.title}`);
  }
);

const handleClickHome = () => {
  router.push('/home')
  localStorage.setItem('current-menu', 0)
}
</script>

<template>
  <div class="mb-[26px] md:mt-0 -mt-5">
    <div class="flex flex-wrap">
      <button
        @click="handleClickHome"
        class="cursor-pointer"
      >
        <img
          src="@/assets/home-breadcrumb.svg"
          class="h-[20px] w-[20px]"
          alt="home icon"
        />
      </button>
      <div
        class="flex items-center"
        v-for="breadcrumb in breadcrumbList"
        :key="breadcrumb.label"
      >
        <span class="mx-3">
          <img
            src="@/assets/arrow-right.svg"
            alt="arrow icon"
          />
        </span>
        <p
          class="text-[#A8AAAE] font-medium text-[14px] leading-[16px]"
          :class="{
            'text-[#4F5662] dark:text-primary': breadcrumb.isActionable,
            'cursor-pointer': breadcrumb.to,
          }"
          @click="changeRoute(breadcrumb)"
        >
          {{ breadcrumb.label }}
        </p>
      </div>
    </div>
  </div>
</template>
