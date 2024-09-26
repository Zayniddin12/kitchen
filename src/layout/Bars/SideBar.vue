<script setup lang="ts">
import { ref, onMounted } from "vue";
import { menuItems } from "@/navigation";

let currentItem = ref(0);
// let childIsOpen = ref(false);

onMounted(() => {
  currentItem.value = 0;
});

const activeMenu = (index, item) => {
  currentItem.value = index;
  // childIsOpen.value = !!item.children;

  // localStorage.setItem("child-sidebar", childIsOpen.value);
};
</script>

<template>
  <div class="sidebar w-[128px]">
    <div class="sidebar-wrapper text-center relative">
      <img src="@/assets/images/logo.svg" class="m-auto pt-[16px] pb-[40px]" alt="logo">

      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="px-[11px]"
        @click="activeMenu(index, item)"
      >
        <div
          :class="{ activeListItem: currentItem == index }"
          class="h-[88px] flex flex-col justify-center items-center cursor-pointer p-[12px]"
        >
          <svg
            :data-src="item.icon"
            class="svg-class shrink-1"
            width="24px"
            height="24px"
          />
          <h1 class="text-[14px] font-medium font-500 mt-[4px] text-[#4F5662]">{{ item.title }}</h1>
        </div>
        <div
          v-if="currentItem === index && item.children"
          class="w-[260px] bg-[#F8F9FC] rounded-[16px] h-[100%] absolute top-0 left-[120px]"
        >
          <pre>{{ item.children }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  height: 100%;
  width: 128px;
  transition: all .3s ease;
  font-size: 12px;
  padding-top: 16px;
  padding-left: 16px;
}

.sidebar-wrapper {
  background-color: #F8F9FC;
  border-radius: 16px;
  height: 98%;
}

.activeListItem {
  @apply bg-white shadow-menu rounded-lg font-medium
}

.activeListItem .svg-class path {
  stroke: #000D24;
}

.activeListItem h1 {
  color: #000D24 !important;
}

.svg-class path {
  stroke: #8F9194;
}

.svg-class h1 {
  color: #4F5662;
}
</style>