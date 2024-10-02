<script setup lang="ts">
import NavBar from "@/layout/Bars/NavBar.vue";
import SideBar from "@/layout/Bars/SideBar.vue";
import Breadcrumb from "@/components/ui/Breadcrumb.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {useKitchenStore} from "@/modules/Kitchen/store/kitchen.store";

const route = useRoute();
const kitchenStore = useKitchenStore();

const storedSidebar: boolean = JSON.parse(localStorage.getItem("child-sidebar") as string) || false;
const childSidebar = ref<boolean>(storedSidebar);

watch(() => route.path, (newPath) => {
  if (newPath === "/home") {
    childSidebar.value = false;
  }
});

onMounted(() => {
  childSidebar.value = false;
  kitchenStore.fetchDepartments();
});

const closeChildSidebar = () => {
  childSidebar.value = false;
};

</script>

<template>
  <div>
    <SideBar
      v-model:childSidebar="childSidebar"
      @closeChildSidebar2="closeChildSidebar"
    />

    <div
      class="main-layout min-h-screen p-6 pr-7 pt-28 dark:bg-darkLayoutMain bg-white ml-[128px] transition-all"
      :class="childSidebar ? 'ml-[396px]' : ''"
    >
      <Breadcrumb />
      <slot />
    </div>

    <div
      :class="childSidebar ? 'top-navbar-margin' : ''"
      class="top-navbar bg-lightLayoutStorm dark:bg-darkLayoutStorm text-white transition-all bg-[#fff]"
    >
      <NavBar />
    </div>
  </div>
</template>

<style lang="scss">
.top-navbar {
  position: fixed;
  z-index: 99;
  border-bottom: 1px solid #EEEEEF;
  transform: none;
  top: 16px;
  margin-left: 152px;
  width: calc(100% - 180px);
  min-height: 65px !important;
  right: 1.75rem;
}

.top-navbar-margin {
  width: calc(100% - 451px);
}
</style>