<template>
  <div class="flex justify-between items-start">
    <input class="bg-[#F8F9FC] w-[552px] rounded-2xl text-black px-[16px] py-[12px] outline-none" placeholder="Поиск">
    <div class="flex items-center gap-6">


      <button class="flex items-center bg-[#2E90FA] rounded-[8px] py-[10px] px-[20px]">
        <svg class="mr-[8px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.3335" y="3.33301" width="13.3333" height="13.3333" rx="2" stroke="white" stroke-width="1.2"
                stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.5 9.99967H12.5" stroke="white" stroke-width="1.2" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M10.0002 7.5V12.5" stroke="white" stroke-width="1.2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>

        <span style="vertical-align: middle"> Создать </span>
      </button>


      <el-badge value="20" class="item">
        <el-icon color="black" size="24">
          <Bell />
        </el-icon>
      </el-badge>

      <el-badge value="20" class="item">
        <el-icon color="black" size="24">
          <Message />
        </el-icon>
      </el-badge>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Bell, Message } from "@element-plus/icons-vue";
</script>