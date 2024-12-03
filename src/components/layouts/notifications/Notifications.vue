<script
  setup
  lang="ts"
>

import { useTemplateRef } from "vue";

const dropdown = useTemplateRef("dropdown");

</script>

<template>
<ElDropdown
  trigger="click"
  :hide-on-click="false"
  ref="dropdown"
>
  <el-badge
    value="4"
    class="item cursor-pointer text-xs"
  >
    <img
      src="@/assets/images/icons/bell.svg"
      alt="bell"
    />
  </el-badge>
  <template #dropdown>
    <div class="w-[500px] h-[500px] bg-white rounded-[16px] px-6 py-[14px]">
      <div class="flex justify-between items-center"></div>
    </div>
  </template>
</ElDropdown>
</template>

<style
  scoped
  lang="scss"
>

</style>