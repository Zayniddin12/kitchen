<script
  lang="ts"
  setup
>
import { computed, ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import i18n from "@/localization";
import { getItem, setItem } from "@/utils/localStorage";

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

const langStorageKey = "language";

const storedLanguage = getItem(langStorageKey);
const lang = ref<Language>(storedLanguage ? langItems.value.find((item) => item.value === storedLanguage)! : {
  title: "Русский",
  value: "ru",
});

const changeLanguage = (item: Language): void => {
  lang.value = item;
  i18n.global.locale.value = item.value;
  setItem(langStorageKey, item.value);
};

const currentLanguageTitle = computed(() => lang.value.title);
</script>

<template>
  <el-dropdown
    trigger="click"
    class="w-[100px]"
  >
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
