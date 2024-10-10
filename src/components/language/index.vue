<script lang="ts" setup>
import { ref, computed } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import i18n from "@/localization";

interface Language {
  title: string;
  value: string;
}

const langItems = ref<Language[]>([
  {
    title: "O'zbekcha",
    value: "uz",
  },
  {
    title: "Русский",
    value: "ru",
  },
]);

const storedLanguage = localStorage.getItem("language");
const lang = ref<Language>(storedLanguage ? langItems.value.find((item) => item.value === storedLanguage)! : { title: "Русский", value: "ru" });

const changeLanguage = (item: Language): void => {
  lang.value = item;
  i18n.global.locale.value = item.value;
  localStorage.setItem("language", item.value);
};

const currentLanguageTitle = computed<string>(() => lang.value.title);
</script>

<template>
  <el-dropdown trigger="click" class="w-[100px]">
    <span class="el-dropdown-link text-[#2E90FA] outline-0">
      {{ currentLanguageTitle }}
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
