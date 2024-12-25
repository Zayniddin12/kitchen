<script
  setup
  lang="ts"
>
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { watchEffect } from "vue";

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "navigation.home",
      isTranslate: true,
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>логи</div>
</template>