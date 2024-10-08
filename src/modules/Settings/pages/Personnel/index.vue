<script setup lang="ts">
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted } from "vue";

const {setBreadCrumb} = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Главная",
      isActionable: true,
    },
  ]);
}

onMounted(() => {
  setBreadCrumbFn();
})
</script>

<template>
<div>логи</div>
</template>

<style lang="scss">

</style>