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
import KitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import WarehouseBasesIcon from "@/assets/images/icons/nav/nav-drawer/warehouse-bases.svg";
import SettingsIcon from "@/assets/images/icons/nav/nav-drawer/settings.svg";
import { useSettingsStore } from "@/modules/Settings/store";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { useCommonStore } from "@/stores/common.store";
import { useI18n } from "vue-i18n";
import AppFaceId from "@/modules/FaceId/Pages/Index.vue";
import { useFaceStore } from "@/modules/FaceId/store";

const authStore = useAuthStore();
const route = useRoute();
const settingsStore = useSettingsStore();
const warehouseBasesStore = useWarehouseBasesStore();
const commonStore = useCommonStore();

const { t } = useI18n();

const childSidebarPin = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar-pin" as string) || "false"));
const childSidebar = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar" as string) || "false"));
const margin = ref("ml-[414px]");

onMounted(async () => {
  if (tokenManager.getAccessToken()) authStore.me();
  // else await index.replace({ name: "login" });
  childSidebarPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
  await settingsStore.GET_REGIONAL({ per_page: 100 });
  warehouseBasesStore.fetchManagementBases();
  commonStore.getTitles();
});

// onUnmounted(() => {
//   commonStore.removeTitles();
// });

watch(() => route.name, function(val) {
  if (val === "home") {
    localStorage.setItem("child-sidebar", JSON.stringify(false));
    childSidebar.value = false;
  }
}, { immediate: true });


const faceStore = useFaceStore();

const model = ref<boolean>(false);

const interval = setInterval(async () => {
 if (route.meta && route.meta.type == 'FACE_ID') {
   const data = await faceStore.FETCH_FACE_ID();
   if (data) {
     if (data && data.user_id) {
       model.value = !model.value;
     }
   }
 }
}, 5000);

watch(() => model.value, (value) => {
  if (route.meta && route.meta.type == 'FACE_ID') {
    alert('2')
    if (value) {
      clearInterval(interval);
    }
  }
});


watch(() => model.value, async (newValue) => {
  if (route.meta && route.meta.type == 'FACE_ID') {
    alert('1')
    if (!newValue && tokenManager.getAccessToken()) {
      const interval = setInterval(async () => {
        const data = await faceStore.FETCH_FACE_ID();
        if (data) {
          if (data && data.user_id) {
            model.value = !model.value;
          }
        }
      }, 5000);

      watch(() => model.value, (value) => {
        if (value) {
          clearInterval(interval);
        }
      });
    }
  }
});

const navDrawerItems = computed(() => {
  return [
    {
      title: "Главная",
      to: { name: "home" },
      key: "home",
      icon: HomeIcon,
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
              to: { name: "inbox" },
            },
          ],
        },
      ],
    },
    {
      title: "Мониторинг",
      key: "monitoring",
      icon: MonitoringIcon,
    },
    {
      title: "Базы складов",
      key: "warehouseBases",
      icon: WarehouseBasesIcon,
    },
    {
      title: "Склад кухни",
      key: "kitchenWarehouse",
      icon: WarehouseBasesIcon,
    },
    {
      title: "Кухня",
      key: "kitchen",
      icon: KitchenIcon,
    },
    {
      title: t("common.settings"),
      key: "settings",
      icon: SettingsIcon,
    },
  ];
});

const navDrawerWidth = ref<number>(0);
console.log(route.meta.type == 'FACE_ID');
</script>

<template>
  <div>

    <div v-if="route.meta && route.meta.type == 'FACE_ID'">
      <AppFaceId v-model="model" />
    </div>
    <div v-else/>

    <SideBar
      v-model:childSidebarPin="childSidebarPin"
      v-model:childSidebar="childSidebar"
    />
    <!--    <NavDrawer-->
    <!--      :items="navDrawerItems"-->
    <!--      @changeWidth="(value:number) => navDrawerWidth = value"-->
    <!--    />-->
    <div
      class="main-layout min-h-screen p-6 pr-7 pt-28 dark:bg-darkLayoutMain dark:bg-body-dark bg-white ml-[128px] transition-all flex flex-col justify-between"
      :class="childSidebarPin && childSidebar ? margin : ''"
    >

      <div class="flex flex-col">
        <AppBreadcrumb />
        <RouterView />
      </div>

      <span
        class="mt-[28px] bg-transparent !dark:body-dark w-full text-[#8F9194] text-[12px] select-none">{{ t("footer")
        }}</span>
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