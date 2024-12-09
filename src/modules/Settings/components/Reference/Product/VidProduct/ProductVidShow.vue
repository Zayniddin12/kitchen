<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

const route = useRoute();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Виды продуктов",
      to: { name: "reference-vid-product" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        parent-class-name="app-card w-[70%] min-h-[50vh]"
      >
        <img
          src=""
          alt=""
        >
      </AppOverlay>
    </div>
  </section>
</template>