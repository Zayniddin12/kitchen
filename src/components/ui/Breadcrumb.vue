<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";


const route = useRoute();
const breadcrumbList = ref([]);
const router = useRouter();


const changeRoute = (item) => {
  if (item.redirectWithParams) {
    router.push(item.redirectWithParams(route));
  } else if (item.to) {
    router.push({ name: item.to, query: item.query });
  }
};


watch(
  () => route.path,
  () => {
    if (Array.isArray(route.meta.breadcrumb)) {
      breadcrumbList.value = route.meta.breadcrumb;
    }
  },
);

onMounted(() => {
  if (Array.isArray(route.meta.breadcrumb)) {
    breadcrumbList.value = route.meta.breadcrumb;
  }
});

</script>

<template>
  <div class="mb-5 md:mt-0 -mt-5">
    <div class="flex flex-wrap">

      <button @click="$router.push('/')" class="cursor-pointer">
        <img src="@/assets/home-breadcrumb.svg" alt="home icon">
      </button>
      <div class="flex items-center" v-for="breadcrumb in breadcrumbList">
        <span class="mx-3">
          <img src="@/assets/arrow-right.svg" alt="arrow icon">
        </span>
        <p
          class="dark:text-gray-300 text-dark"
          :class="{
            'text-[#4F5662] dark:text-primary cursor-pointer':
              breadcrumb.isActionable,
          }"
          @click="changeRoute(breadcrumb)"
        >
          {{ $t(breadcrumb.label) }}
        </p>
      </div>
    </div>
  </div>

</template>