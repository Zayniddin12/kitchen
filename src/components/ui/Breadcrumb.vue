<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const breadcrumbList = computed(() => {
  return route.meta.breadcrumb ?? [];
});

const changeRoute = (item: any) => {
  if (item.redirectWithParams) {
    router.push(item.redirectWithParams(route));
  } else if (item.to) {
    router.push({ name: item.to, query: item.query });
  }
};
</script>

<template>
  <div class="mb-[24px] md:mt-0 -mt-5">
    <div class="flex flex-wrap">
      <button
        @click="$router.push('/')"
        class="cursor-pointer"
      >
        <img
          src="@/assets/home-breadcrumb.svg"
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
          class="dark:text-gray-300 text-dark"
          :class="{
            'text-dark-gray dark:text-primary': breadcrumb.isActionable,
            'cursor-pointer': breadcrumb.to,
          }"
          @click="changeRoute(breadcrumb)"
        >
          {{ $t(breadcrumb.label) }}
        </p>
      </div>
    </div>
  </div>
</template>
