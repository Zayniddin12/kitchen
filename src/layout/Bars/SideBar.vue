<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLayoutStore } from "@/navigation";
import ChildSidebar from "@/layout/Bars/ChildSidebar.vue";

const emit = defineEmits<{
  (e: "update:childSidebar", value: boolean): void;
  (e: "closeChildSidebar2"): void;
}>();

const store = useLayoutStore();
const router = useRouter();
let route = useRoute();

let currentIndex = ref<number>(0);
let currentMenu = ref<number>(0);
let childIsOpen = ref<boolean>(localStorage.getItem("child-sidebar") === "true");
let childIsOpenPin = ref<boolean>(JSON.parse(localStorage.getItem("child-sidebar-pin") || "false"));

interface MenuItem {
  title?: string;
  icon?: string | null;
  route?: string;
  children?: MenuItem[];
}

onMounted(() => {
  const storedMenu: string | number = sessionStorage.getItem("current-menu") | 0;
  const storedSidebar = localStorage.getItem("child-sidebar");

  if (childIsOpenPin.value) {
    currentIndex.value = Number(storedMenu);
  } else {
    currentIndex.value = 0;
  }

  console.log(currentIndex.value);

  currentMenu.value = storedMenu ? JSON.parse(storedMenu) as number : 0;
  childIsOpen.value = storedSidebar === "true";

  document.body.addEventListener("click", closeChildSidebar);
});

onUnmounted(() => {
  document.body.removeEventListener("click", closeChildSidebar);
  localStorage.setItem("child-sidebar-pin", JSON.stringify(false));
});

watch(() => route.path, () => {
  const storedMenu = sessionStorage.getItem("current-menu");
  currentMenu.value = storedMenu ? JSON.parse(storedMenu) as number : 0;
});

const activeMenu = (index: number, item: MenuItem) => {
  currentIndex.value = index;
  currentMenu.value = index;
  childIsOpen.value = !!item.children;
  emit("update:childSidebar", !!item.children);

  localStorage.setItem("child-sidebar", "true");
  sessionStorage.setItem("current-menu", currentMenu.value.toString());

  if (item.route) {
    router.push(item.route);
  }
};

const closeChildSidebar = () => {
  if (childIsOpenPin.value) {
    emit("update:childSidebar", childIsOpenPin.value);
  } else {
    currentIndex.value = 0;
    emit("update:childSidebar", childIsOpenPin.value);
  }
};

const pinSidebar = () => {
  localStorage.setItem("child-sidebar-pin", JSON.stringify(!JSON.parse(localStorage.getItem("child-sidebar-pin") || "false")));
  childIsOpenPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
};

const logOut = () => {
  const arr = ["current-menu", "child-sidebar"];

  for (let i = 0; i < arr.length; i++) {
    localStorage.removeItem(arr[i]);
  }
  router.push("/login");
};
</script>

<template>
  <div class="sidebar w-[128px]">
    <div class="sidebar-wrapper bg-white-blue dark:bg-dark text-center relative flex flex-col justify-between">
      <div class="overflow-auto">
        <img src="@/assets/images/logo.svg"
             class="m-auto pt-[16px] pb-[40px]"
             alt="logo"
        />

        <div v-for="(item, index) in store.menuItems"
             :key="index"
             class="px-[11px]"
             @click.stop="activeMenu(index, item)"
        >
          <div :class="{ activeListItem: currentMenu == index }"
               class="h-[88px] flex flex-col justify-center items-center cursor-pointer p-[12px] hover:bg-white dark:hover:bg-body-dark hover:shadow-menu hover:font-medium rounded-lg"
          >
            <svg :data-src="'/sidebar/' + item?.icon + '.svg'"
                 class="svg-class shrink-1"
                 width="24px"
                 height="24px"
            />

            <h1 class="text-[13px] font-medium font-500 mt-[4px] text-[#4F5662] dark:text-white">{{ item.title }}</h1>
          </div>

          <!-----------------------------------child sidebar----------------------------------->
          <div v-if="currentIndex === index && item.children"
               class="w-[260px] dark:bg-dark bg-white-blue rounded-[16px] h-[100%] absolute top-0 left-[120px] transition overflow-auto"
          >
            <ChildSidebar
                :childIsOpenPin="childIsOpenPin"
                :children="item.children as any"
                :header="item.title"
                @closeSidebar="closeChildSidebar"
                @toggleSidebarPin="pinSidebar"
            />
          </div>
        </div>
      </div>

      <!------------------------log out---------------------------->
      <button class="flex flex-col items-center cursor-pointer mb-[10px]" @click="logOut">
        <img
            src="@/assets/images/logout.svg"
            alt="logout"
        />
        <span class="text-[#EA5455] text-[14px] font-medium block">Выход</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  height: 100%;
  width: 128px;
  transition: all 0.3s ease;
  font-size: 12px;
  padding-top: 16px;
  padding-left: 16px;
}

.sidebar-wrapper {
  background-color: var(--white-blue);
  border-radius: 16px;
  height: 98%;
}

.activeListItem {
  @apply bg-white dark:bg-body-dark shadow-menu font-medium;
}

.dark .activeListItem .svg-class path {
  stroke: #fff;
}

.activeListItem .svg-class path {
  stroke: #000d24;
}

.activeListItem h1 {
  color: #000d24 !important;
}

.dark .activeListItem h1 {
  color: #fff !important;
}

.svg-class path {
  stroke: #8f9194;
}

.svg-class h1 {
  color: #4f5662;
}
</style>
