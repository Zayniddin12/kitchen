<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface MenuInterface {
  title: string;
  subTitle: string;
  router?: string; // Router is optional now
}

interface UlItems {
  title: string;
  menu: MenuInterface[];
}

const router = useRouter();

const ulItems = ref<UlItems[]>([
  {
    title: "Документы",
    menu: [
      {
        title: "Типы документов",
        subTitle: "Типы документов",
        router: "reference-type-document",
      },
      {
        title: "Виды документов",
        subTitle: "Виды документов",
        router: "reference-vid-document",
      },
    ],
  },
  {
    title: "Продукты",
    menu: [
      {
        title: "Типы документов",
        subTitle: "Типы документов",
        router: "reference-type-product",
      },
      {
        title: "Виды документов",
        subTitle: "Виды документов",
        router: "reference-vid-product",
      },
    ],
  },
  {
    title: "Рационы и блюда",
    menu: [
      {
        title: "Рационы",
        subTitle: "Рационы",
        router: "reference-ration",
      },
      {
        title: "Блюда",
        subTitle: "Блюда",
        router: "reference-dish",
      },
    ],
  },
  {
    title: "Управ, комбинаты и склады",
    menu: [
      {
        title: "Региональные управления",
        subTitle: "Региональные управления",
        router: "reference-regional-directorates",
      },
      {
        title: "Комбинаты питания",
        subTitle: "Комбинаты питания",
        router: "reference-combine-nutrition",
      },
      {
        title: "Базы складов",
        subTitle: "Базы складов",
        router: "reference-warehouse-bases",
      },
      {
        title: "Склады базы",
        subTitle: "Склады",
        router: "reference-main-bases",
      },
      {
        title: "Склады кухни",
        subTitle: "Склады кухни",
        router: "reference-kitchen-warehouse",
      },
      {
        title: "Типы кухни",
        subTitle: "Типы кухни",
        router: "reference-kitchen-type",
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
        router: "reference-suppliers",
      },
      {
        title: "Организации",
        subTitle: "Организации",
        router: "reference-organization",
      },
    ],
  },
]);

const {setBreadCrumb} = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      isActionable: true,
    }
  ]);
}

onMounted(() => {
  setBreadCrumbFn();
})
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Справочники</h1>

    <div class="grid grid-cols-3 gap-8 mt-[24px]">
      <div
        class="space-y-2 mb-[50px]"
        v-for="(item, index) in ulItems"
        :key="index"
      >
        <h3
          class="text-[#2E90FA] font-medium text-[18px] flex items-center leading-[28px]"
        >
          <svg
            data-src="/sidebar/document.svg"
            class="svg__class mr-[12px]"
            width="24px"
            height="24px"
          />
          {{ item.title }}
        </h3>

        <ul
          class="ml-[36px] !my-[15px]"
          v-for="(menu, index2) in item.menu"
          :key="index2"
          @click="router.push(menu.router as string)"
        >
          <li
            class="text-[#4F5662] text-[14px] font-medium leading-[20px] cursor-pointer hover:underline hover:decoration-[#2E90FA] hover:text-[#2E90FA]"
          >
            {{ menu.title }}
          </li>
          <li
            class="text-[12px] text-[#A8AAAE] font-normal mt-[4px] leading-[16px] cursor-pointer"
          >
            {{ menu.subTitle }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.svg__class path {
  stroke: #2e90fa;
}
</style>
