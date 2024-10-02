<script setup lang="ts">
import { useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

const router = useRouter()
</script>

<template>
  <h1 class="m-0 font-semibold text-[32px]">Добавить</h1>

  <div class="border rounded-[24px] p-[24px] my-[24px]">
   <div class="grid grid-cols-2 gap-6">
     <div>
       <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">№ контракта</label>
       <app-input />
     </div>

     <div>
       <label class="text-[#A8AAAE] text-[12px] font-medium mb-[4px] block">Поставщик</label>
       <app-select placeholder=""/>
     </div>
   </div>
  </div>

  <div class="flex items-center justify-end">
    <button class="custom-cancel-btn" @click="router.push('/contracts')">Отменить</button>
    <button class="custom-apply-btn ml-[8px]">Добавить</button>
  </div>
</template>

