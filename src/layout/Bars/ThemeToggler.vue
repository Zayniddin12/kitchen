<template>
  <button
    class="w-[30px]"
    @click="toggleTheme"
  >
    <img v-if="currentTheme === 'light'" src="@/assets/images/icons/moon.svg" alt="">
    <img v-else src="@/assets/images/icons/sun.svg" alt="">
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLayoutStore } from "@/navigation";

const store = useLayoutStore();
const currentTheme = ref(localStorage.getItem('currentTheme'));


const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  store.changeTheme(currentTheme.value);
};
</script>
