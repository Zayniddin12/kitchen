<script
  lang="ts"
  setup
>
import { ArrowDown } from "@element-plus/icons-vue";

import { activeLanguage, changeLocale, languages } from "@/localization";

</script>

<template>
  <el-dropdown
    trigger="click"
    class="w-[100px]"
  >
    <span class="el-dropdown-link text-[#2E90FA] outline-0">
      {{ activeLanguage.title }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languages"
          :key="item.value"
          @click="changeLocale(item.value)"
        >
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
