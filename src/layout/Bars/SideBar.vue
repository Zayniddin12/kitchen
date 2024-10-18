<script
  setup
  lang="ts"
>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLayoutStore } from "@/navigation";
import ChildSidebar from "@/layout/Bars/ChildSidebar.vue";

const emit = defineEmits<{ (e: "update:childSidebar", value: boolean): void; }>();

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
  const storedMenu: number = sessionStorage.getItem("current-menu") | 0;
  const storedSidebar = localStorage.getItem("child-sidebar");

  if (childIsOpenPin.value) {
    currentIndex.value = Number(storedMenu);
  } else {
    currentIndex.value = 0;
  }

  currentMenu.value = storedMenu ? JSON.parse(storedMenu as any) as number : 0;
  childIsOpen.value = storedSidebar === "true";

  document.body.addEventListener("click", () => closeChildSidebar("any"));
  emit("update:childSidebar", false);
});

onUnmounted(() => {
  document.body.removeEventListener("click", () => closeChildSidebar("any"));
  localStorage.setItem("child-sidebar-pin", JSON.stringify(false));
  emit("update:childSidebar", false);
});

watch(() => route.path, () => {
  const storedMenu = sessionStorage.getItem("current-menu");
  currentMenu.value = storedMenu ? JSON.parse(storedMenu) as number : 0;
});

const activeMenu = (index: number, item: MenuItem) => {
  currentIndex.value = index;
  currentMenu.value = index;
  sessionStorage.setItem("current-menu", currentMenu.value.toString());

  if (item.route) {
    router.push(item.route);
    childIsOpenPin.value = false;
  }
};

const closeChildSidebar = (value: string) => {

  if (value == "any") {
    if (!childIsOpenPin.value) {
      currentIndex.value = 0;
    }

  }

  if (value && value == "close" && childIsOpenPin.value) {
    currentIndex.value = 0;
    emit("update:childSidebar", false);

    localStorage.setItem("child-sidebar-pin", JSON.stringify(false));
    childIsOpenPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
    console.log(value);
  }


  if (value && value == "close" && !childIsOpenPin.value) {
    currentIndex.value = 0;
  }

  if (!childIsOpenPin.value) {
    // currentIndex.value = 0;
  }


  emit("update:childSidebar", childIsOpenPin.value);
};

const pinSidebar = () => {
  localStorage.setItem("child-sidebar-pin", JSON.stringify(!JSON.parse(localStorage.getItem("child-sidebar-pin") || "false")));
  childIsOpenPin.value = JSON.parse(localStorage.getItem("child-sidebar-pin") || "false");
  closeChildSidebar("toggle");
};

const logOut = () => {
  localStorage.removeItem("child-sidebar");
  sessionStorage.removeItem("current-menu");
  router.push("/login");
};
</script>

<template>
  <div class="sidebar w-[128px] z-10">
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
            class="h-[88px] flex flex-col justify-center items-center cursor-pointer p-[12px] hover:bg-white dark:hover:bg-body-dark hover:shadow-menu hover:font-medium rounded-lg"
          >
            <li
              :style="{
                  maskImage: `url(/sidebar/${item.icon}.svg)`,
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '24px',
                  height: '24px',
                  maskSize: '24px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                 }"
            />

            <h1 class="text-[13px] font-medium font-500 mt-[4px] text-[#4F5662] dark:text-white">{{ item.title }}</h1>
          </div>

          <!-----------------------------------child sidebar----------------------------------->
          <Transition name="nested-reverse">
            <div
              v-if="currentIndex === index && item.children"
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

          </Transition>
        </div>
      </div>

      <!------------------------log out---------------------------->
      <button
        class="flex flex-col items-center cursor-pointer mb-[10px]"
        @click.stop="logOut"
      >
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

.dark .activeListItem li {
  stroke: #fff;
}

.activeListItem li {
  color: #000d24 !important;
  background-color: #000d24 !important;
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
