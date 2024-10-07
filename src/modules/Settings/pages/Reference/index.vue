<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface MenuInterface {
  title: string;
  subTitle: string;
}

interface UlItems {
  title: string;
  menu: MenuInterface;
}

const router = useRouter()

const ulItems = ref<UlItems[]>([
  {
    title: "Документы",
    menu: [
      {
        title: "Типы документов",
        subTitle: "Типы документов",
        router: 'reference-type-document',
      },
      {
        title: "Виды документов",
        subTitle: "Виды документов",
        router: 'reference-vid-document',
      },
    ],
  },
  {
    title: "Продукты",
    menu: [
      {
        title: "Типы документов",
        subTitle: "Типы документов",
      },
      {
        title: "Виды документов",
        subTitle: "Виды документов",
      },
    ],
  },
  {
    title: "Рационы и блюда",
    menu: [
      {
        title: "Рационы",
        subTitle: "Рационы",
      },
      {
        title: "Блюда",
        subTitle: "Блюда",
      },
    ],
  },
  {
    title: "Базы и Склады",
    menu: [
      {
        title: "Региональные управления",
        subTitle: "Региональные управления",
      },
      {
        title: "Комбинаты питания",
        subTitle: "Комбинаты питания",
      },
      {
        title: "Базы складов",
        subTitle: "Базы складов",
      },
      {
        title: "Склады базы",
        subTitle: "Склады",
      },
      {
        title: "Склады кухни",
        subTitle: "Склады кухни",
      },
      {
        title: "Типы кухни",
        subTitle: "Типы кухни",
      },
    ],
  },
  {
    title: "Должности и роли",
    menu: [
      {
        title: "Типы документов",
        subTitle: "Типы документов",
      },
      {
        title: "Виды документов",
        subTitle: "Виды документов",
      },
    ],
  },
  {
    title: "Поставщики и организации",
    menu: [
      {
        title: "Поставщики",
        subTitle: "Поставщики",
      },
      {
        title: "Организации",
        subTitle: "Организации",
      },
    ],
  },
]);

const detailPage = (value: any) => {
  router.push(value.router)
}
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Справочники</h1>

    <div class="grid grid-cols-3 gap-8 mt-[24px]">
      <div
        class="space-y-2 mb-[84px]"
        v-for="(item, index) in ulItems"
        :key="index"
      >
        <h3 class="text-[#2E90FA] font-medium text-[18px] flex items-center leading-[28px]">
          <svg data-src="/sidebar/document.svg" class="svg__class mr-[12px]" width="24px" height="24px" />
          {{ item.title }}
        </h3>

        <ul
          class="ml-[36px] mt-[15px]"
          v-for="(menu, index2) in item.menu"
          :key="index2"
          @click="detailPage(menu)"
        >
          <li class="text-[#4F5662] text-[14px] font-medium leading-[20px] cursor-pointer hover:underline hover:decoration-[#2E90FA] hover:text-[#2E90FA]">{{ menu.title }}</li>
          <li class="text-[12px] text-[#A8AAAE] font-normal mt-[4px] leading-[16px] cursor-pointer">{{ menu.subTitle }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.svg__class path {
  stroke: #2E90FA;
}
</style>