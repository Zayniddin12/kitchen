<script lang="ts" setup>
import { ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

interface Language {
  title: string,
  value: string
}

interface LangItem {
  title: string,
  value: string
}

const langItems = ref<LangItem[]>([
  {
    title: "O'zbekcha",
    value: "uz",
  },
  {
    title: "Русский",
    value: "ru",
  },
]);

const lang = ref<Language>({
  title: "Русский",
  value: "ru",
});

const changeLanguage = (value: string) => {
  lang.value = value;
};
</script>

<template>
  <el-dropdown>
    <span class="el-dropdown-link text-[#2E90FA] outline-0">
      {{ lang.title }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in langItems"
          :key="index"
          @click="changeLanguage(item)"
        >
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
