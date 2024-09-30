<script setup lang="ts">

import { computed, watch } from "vue";

const model = defineModel<boolean>();

const activeNames = computed<string[]>(() => {
  return model.value ? ["1"] : [];
})

</script>

<template>
  <div class="el-collapse-item2 transition-all pt-[24px]">
    <el-collapse v-model="activeNames" class="border-0">
      <el-collapse-item name="1" class="border-b-0">
        <template #title>
          <slot name="header" />
        </template>
        <template #icon="{ isActive }">
          <div />
        </template>
        <div class="border-[#e2e6f3] border bg-[#F8F9FC] rounded-[10px] py-[12px] px-[16px]">
          <h1 class="text-[#4F5662] font-medium text-[18px]">Фильтр</h1>
          <slot name="body" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss">
.el-collapse-item2 .el-collapse-item__header {
  border: none;
  height: 0;
}

.el-collapse-item2 .el-collapse-item__wrap {
  border: none;
  overflow: unset;
}
</style>
