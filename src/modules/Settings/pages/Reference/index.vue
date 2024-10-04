<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div>
    <div class="grid grid-cols-3 gap-8 p-10">
      <!-- Section 1 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Документы
        </h3>
        <ul class="text-gray-600">
          <li>Типы документов</li>
          <li>Виды документов</li>
        </ul>
      </div>

      <!-- Section 2 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Продукты
        </h3>
        <ul class="text-gray-600">
          <li>Типы документов</li>
          <li>Виды документов</li>
        </ul>
      </div>

      <!-- Section 3 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Рационы и блюда
        </h3>
        <ul class="text-gray-600">
          <li>Рационы</li>
          <li>Блюда</li>
        </ul>
      </div>

      <!-- Section 4 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Базы и Склады
        </h3>
        <ul class="text-gray-600">
          <li>Региональные управления</li>
          <li>Комбинаты питания</li>
          <li>Базы складов</li>
          <li>Склады базы</li>
          <li>Склады кухни</li>
          <li>Типы кухни</li>
        </ul>
      </div>

      <!-- Section 5 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Должности и роли
        </h3>
        <ul class="text-gray-600">
          <li>Типы документов</li>
          <li>Виды документов</li>
        </ul>
      </div>

      <!-- Section 6 -->
      <div class="space-y-2">
        <h3 class="text-blue-600 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.8V12m0 0v7.2M12 12H4.8M12 12h7.2M20 12A8 8 0 1 1 12 4a8 8 0 0 1 8 8z"></path>
          </svg>
          Поставщики и организации
        </h3>
        <ul class="text-gray-600">
          <li>Поставщики</li>
          <li>Организации</li>
        </ul>
      </div>
    </div>
  </div>
</template>

