<script setup lang="ts">
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { ElButton } from "element-plus";
</script>

<template>
  <section class="remaining-goods">
    <div>
      <div class="flex justify-between items-start gap-5">
        <h1 class="font-semibold text-[32px] text-dark">Остатка товаров</h1>
        <div class="grid grid-cols-4 gap-2 max-w-[645px]">
          <AppDatePicker
            format="DD.MM.YYYY"
            size="large"
          />
          <AppDatePicker
            format="DD.MM.YYYY"
            size="large"
          />
          <ElButton
            size="large"
            class="h-12 !bg-white-blue !border-white-blue"
          >
            <span class="font-medium text-dark-gray">Скачать</span>
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>
