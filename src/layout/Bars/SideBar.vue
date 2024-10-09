<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {useLayoutStore} from "@/navigation"
import ChildSidebar from "@/layout/Bars/ChildSidebar.vue";

const emit = defineEmits(["update:childSidebar", "closeChildSidebar2"]);

const store = useLayoutStore()
const router = useRouter();
let route = useRoute();

let currentIndex = ref<number>(0);
let currentMenu = ref<number>(0);

let childIsOpen = ref<boolean>(localStorage.getItem("child-sidebar") === "true");

onMounted(() => {
  currentMenu.value = JSON.parse(localStorage.getItem('current-menu') as string)
});

watch(() => route.path, () => {
  const storedMenu = localStorage.getItem('current-menu');
  currentMenu.value = storedMenu ? JSON.parse(storedMenu) : 0;
});

const activeMenu = (index: number, item: any) => {
  currentIndex.value = index;
  currentMenu.value = index;
  childIsOpen.value = !!item.children;
  emit("update:childSidebar", !!item.children);

  localStorage.setItem("child-sidebar", "true");
  localStorage.setItem("current-menu", currentMenu.value as any);

  if (item.route) {
    router.push(item.route);
  }
};

const logOut = () => {
  localStorage.removeItem('current-menu')
  localStorage.removeItem('child-sidebar')
  router.push("/login");
};

const closeChildSidebar = () => {
  currentIndex.value = 0;
  emit("update:childSidebar", false);
};

const pinSidebar = () => {
  // currentIndex.value = currentMenu.value
}

onMounted(() => {
  const storedMenu = localStorage.getItem('current-menu');
  const storedSidebar = localStorage.getItem('child-sidebar');

  currentMenu.value = storedMenu ? JSON.parse(storedMenu) : 0;
  childIsOpen.value = storedSidebar === "true";
  document.body.addEventListener('click', closeChildSidebar);
});

onUnmounted(() => {
  document.body.removeEventListener('click', closeChildSidebar);
});
</script>

<template>
  <div class="sidebar w-[128px]">
    <div class="sidebar-wrapper bg-white-blue dark:bg-dark text-center relative flex flex-col justify-between">
      <div class="overflow-auto">
        <img
          src="@/assets/images/logo.svg"
          class="m-auto pt-[16px] pb-[40px]"
          alt="logo"
        />

        <div
          v-for="(item, index) in store.menuItems"
          :key="index"
          class="px-[11px]"
          @click.stop="activeMenu(index, item)"
        >
          <div
            :class="{ activeListItem: currentMenu == index }"
            class="h-[88px] flex flex-col justify-center items-center cursor-pointer p-[12px] hover:bg-white hover:shadow-menu hover:font-medium rounded-lg"
          >
            <svg
              :data-src="'/sidebar/' + item.icon + '.svg'"
              class="svg-class shrink-1"
              width="24px"
              height="24px"
            />

            <h1 class="text-[13px] font-medium font-500 mt-[4px] text-[#4F5662]">{{ item.title }}</h1>
          </div>

          <!-----------------------------------child sidebar----------------------------------->
          <div
            v-if="currentIndex === index && item.children && childIsOpen"
            class="w-[260px] bg-white-blue rounded-[16px] h-[100%] absolute top-0 left-[120px] transition overflow-auto"
          >
            <ChildSidebar
              :children="item.children"
              :header="item.title"
              @closeSidebar="closeChildSidebar"
              @pinSidebar="pinSidebar"
            />
          </div>
        </div>
      </div>

      <!------------------------log out---------------------------->
      <div
        class="flex flex-col items-center cursor-pointer mb-[10px]"
        @click="logOut"
      >
        <img
          src="@/assets/images/logout.svg"
          alt="logout"
        />
        <div class="text-[#EA5455] text-[14px] font-medium">Выход</div>
      </div>
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
  @apply bg-white shadow-menu font-medium;
}

.activeListItem .svg-class path {
  stroke: #000d24;
}

.activeListItem h1 {
  color: #000d24 !important;
}

.svg-class path {
  stroke: #8f9194;
}

.svg-class h1 {
  color: #4f5662;
}
</style>
