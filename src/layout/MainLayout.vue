<script
  setup
  lang="ts"
>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import NavBar from "@/layout/Bars/NavBar.vue";
import SideBar from "@/layout/Bars/SideBar.vue";
import AppBreadcrumb from "@/components/ui/app-breadcrumb/AppBreadcrumb.vue";

const route = useRoute();
const kitchenStore = useKitchenStore();

const childSidebarPin = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar-pin" as string) || "false"));
const childSidebar = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar" as string) || "false"));
const margin = ref("ml-[396px]");

onMounted(() => {
  childSidebarPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
  kitchenStore.fetchDepartments();
});

// watch(() => route.name, function(val) {
//   if (val === "home") {
//     localStorage.setItem("child-sidebar-pin", JSON.stringify(false));
//     childSidebarPin.value = false;
//   } else {
//     margin.value = "ml-[396px]";
//   }
// }, { immediate: true });
</script>

<template>
  <div>
    <SideBar v-model:childSidebarPin="childSidebarPin" v-model:childSidebar="childSidebar" />

    <div
      class="main-layout min-h-screen p-6 pr-7 pt-28 dark:bg-darkLayoutMain dark:bg-body-dark bg-white ml-[128px] transition-all flex flex-col justify-between"
      :class="childSidebarPin && childSidebar ? margin : ''"
    >

      <div class="flex flex-col">
        <AppBreadcrumb />
        <slot />
      </div>

      <span class="mt-[28px] bg-transparent !dark:body-dark w-full text-[#8F9194] text-[12px] select-none">Made by “Anysoft” software & solutions company</span>
    </div>

    <div
      :class="childSidebarPin && childSidebar ? 'top-navbar-margin' : ''"
      class="top-navbar bg-lightLayoutStorm dark:bg-body-dark text-white transition-all bg-[#fff]"
    >
      <NavBar />
    </div>
  </div>
</template>

<style lang="scss">
.dark #app {
  background-color: #171D32;
}

.top-navbar {
  position: fixed;
  border-bottom: 1px solid #EEEEEF;
  top: 0;
  padding-top: 16px;
  padding-bottom: 17px;
  width: calc(100% - 180px);
  min-height: 65px !important;
  right: 1.8rem;
}

.top-navbar-margin {
  width: calc(100% - 451px);
}
</style>