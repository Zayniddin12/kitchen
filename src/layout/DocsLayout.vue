<script setup lang="ts">

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="max-w-screen-md  container px-6 mx-auto">
    <div>
      <header class="flex items-center justify-center my-[24px] mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
        />
        <div class="flex flex-col ml-3">
          <b class="text-[#000D24] text-lg">
            {{ t("logo.title") }}
          </b>
          <span class="text-[#CBCCCE]">
                  {{ t("logo.subtitle") }}
                </span>
        </div>
      </header>


      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Tizim manzili:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
               https://wms.ngmkfond.uz
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Vaqti:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
            28.01.2025 17:24
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Imzolovchi:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
           Baxtiyor Risqiyev Botirovich
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Lavozimi:  <span class="ml-2 text-[#4F5662] text-sm font-medium">
       Bosh muhandis (fhdgdgghf sdftsfgdcsvcfgsfds tysfdtysfdgssd styfdtsfcxgs wsdftwssxc)
              </span>
        </h2>

      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Hujjat turi:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
        Служебная записка
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Hujjat №:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
   04-04-01/463
              </span>
      </div>

    </div>
  </div>
</template>