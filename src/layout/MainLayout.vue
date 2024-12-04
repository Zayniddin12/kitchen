<script
    setup
    lang="ts"
>
import { computed, onMounted, onUnmounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import NavBar from "@/layout/Bars/NavBar.vue";
import SideBar from "@/layout/Bars/SideBar.vue";
import AppBreadcrumb from "@/components/ui/app-breadcrumb/AppBreadcrumb.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import tokenManager from "@/utils/token.manager";
import NavDrawer from "@/components/layouts/nav/nav-drawer/NavDrawer.vue";
import HomeIcon from "@/assets/images/icons/nav/nav-drawer/home.svg";
import DocumentsIcon from "@/assets/images/icons/nav/nav-drawer/documents.svg";
import NotebookIcon from "@/assets/images/icons/nav/nav-list/notebook.svg";
import MonitoringIcon from "@/assets/images/icons/nav/nav-drawer/monitoring.svg";
import { useSettingsStore } from "@/modules/Settings/store";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { useCommonStore } from "@/stores/common.store";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const kitchenStore = useKitchenStore();
const settingsStore = useSettingsStore();
const warehouseBasesStore = useWarehouseBasesStore();
const commonStore = useCommonStore();

const childSidebarPin = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar-pin" as string) || "false"));
const childSidebar = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar" as string) || "false"));
const margin = ref("ml-[396px]");

onMounted(async () => {
  if (tokenManager.getAccessToken()) authStore.me();
  // else await router.replace({ name: "login" });
  childSidebarPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
  await settingsStore.GET_REGIONAL({ per_page: 100 });
  warehouseBasesStore.fetchManagementBases();
  commonStore.getTitles();
});

// onUnmounted(() => {
//   commonStore.removeTitles();
// });

watch(() => route.name, function (val) {
  if (val === "home") {
    localStorage.setItem("child-sidebar", JSON.stringify(false));
    childSidebar.value = false;
  }
}, { immediate: true });

const navDrawerItems = computed(() => {
  return [
    {
      title: "Главная",
      to: { name: "home" },
      key: "home",
      icon: HomeIcon
    },
    {
      title: "Документы",
      key: "documents",
      icon: DocumentsIcon,
      items: [
        {
          title: "Служебные записки",
          key: "memos",
          icon: NotebookIcon,
          items: [
            {
              title: "Входящие",
              key: "documentInbox",
              to: { name: "inbox" }
            }
          ]
        }
      ]
    },
    {
      title: "Мониторинг",
      key: "monitoring",
      icon: MonitoringIcon
    }
  ];
});

const navDrawerWidth = ref<number>(0);


</script>

<template>
  <div>
    <SideBar
        v-model:childSidebarPin="childSidebarPin"
        v-model:childSidebar="childSidebar"
    />
    <!--    <NavDrawer-->
    <!--        :items="navDrawerItems"-->
    <!--        @changeWidth="(value:number) => navDrawerWidth = value"-->
    <!--    />-->
    <div
        class="main-layout min-h-screen p-6 pr-7 pt-28 dark:bg-darkLayoutMain dark:bg-body-dark bg-white ml-[128px] transition-all flex flex-col justify-between"
        :class="childSidebarPin && childSidebar ? margin : ''"
    >

      <div class="flex flex-col">
        <AppBreadcrumb/>
        <RouterView />
      </div>

      <span class="mt-[28px] bg-transparent !dark:body-dark w-full text-[#8F9194] text-[12px] select-none">Made by “Anysoft” software & solutions company</span>
    </div>

    <div
        :class="childSidebarPin && childSidebar ? 'top-navbar-margin' : ''"
        class="top-navbar bg-lightLayoutStorm dark:bg-body-dark text-white transition-all bg-[#fff]"
    >
      <NavBar/>
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