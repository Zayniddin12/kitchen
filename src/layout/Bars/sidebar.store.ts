import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebarStore", () => {
  const childSideBarOpen = ref(false);

  const setChildSideBarOpen = (value: boolean) => {
    childSideBarOpen.value = value;
  };

  return {
    childSideBarOpen,
    setChildSideBarOpen,
  };
});