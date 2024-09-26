<template>
  <div>
    <SideBar />
    <div
      class="main-layout min-h-screen p-6 pr-7 pt-28 dark:bg-darkLayoutMain bg-white ml-[128px]"
    >
      <Breadcrumb />
      <slot />
    </div>

    <div
      class="top-navbar bg-lightLayoutStorm dark:bg-darkLayoutStorm text-white"
    >
      <NavBar />
    </div>

    <!--    <ScrollToTop />-->
  </div>
</template>

<script setup lang="ts">

import NavBar from "@/layout/Bars/NavBar.vue";
import SideBar from "@/layout/Bars/SideBar.vue";
import Breadcrumb from "@/components/ui/Breadcrumb.vue";
</script>

<style lang="scss">
.top-navbar {
  position: fixed;
  z-index: 99;
  transition: all .2s ease-in-out;
  border-bottom: 1px solid #EEEEEF;
  transform: none;
  top: 16px;
  margin-left: 152px;
  width: calc(100% - 180px);
  min-height: 65px !important;
  right: 1.75rem;
}
</style>