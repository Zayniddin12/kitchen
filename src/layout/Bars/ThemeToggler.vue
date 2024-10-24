<template>
  <button
    class="w-[30px]"
    @click="toggleTheme"
  >
    <img v-if="currentTheme === 'light'" src="@/assets/images/icons/moon.svg" alt="moon" />
    <img v-else src="@/assets/images/icons/sun.svg" alt="sun" />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useLayoutStore } from "@/navigation";

const store = useLayoutStore();
const currentTheme = ref(localStorage.getItem("currentTheme"));


const toggleTheme = () => {
  const darkCircle = document.querySelector(".darkCircle");
  const lightCircle = document.querySelector(".lightCircle");

  darkCircle.classList.toggle("grow");
  lightCircle.classList.toggle("grow");
  currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  store.changeTheme(currentTheme.value);
};

onMounted(() => {
  const bodyElement = document.getElementById("body");
  if (bodyElement) {
    bodyElement.className = store.currentTheme;
  }
});

watch(store, async () => {
  const bodyElement = document.getElementById("body");
  if (bodyElement && store.currentTheme) {
    bodyElement.className = store.currentTheme;
  }
});
</script>
