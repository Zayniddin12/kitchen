<script
  setup
  lang="ts"
>
import { computed, watchEffect } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { check } from "@/mixins/permission";

const { t } = useI18n();

const route = useRoute();

interface MenuInterface {
  title: string;
  subTitle: string;
  index?: string;
}

interface UlItems {
  title: string;
  menu: MenuInterface[];
}

const ulItems = computed<UlItems[]>(() => [{
  title: t("document.title1"),
  permissions: ["admin", "super_admin"],
  menu: [
    {
      title: t("document.typeDoc"),
      subTitle: t("document.typeDoc"),
      router: "reference-type-document",
    },
    {
      title: t("document.type2"),
      subTitle: t("document.type2"),
      router: "reference-vid-document",
    },
  ],
},
  {
    title: t("settings.products"),
    permissions: ['technologist', "admin", "super_admin"],
    menu: [
      {
        title: t("typeProduct.title"),
        subTitle: t("typeProduct.title"),
        router: "reference-type-product",
      },
      {
        title: t("vidProduct.title"),
        subTitle: t("vidProduct.title"),
        router: "reference-vid-product",
      },
    ],
  },
  {
    title: t("settings.rationsDishes"),
    permissions: ['technologist', "admin", "super_admin"],
    menu: [
      {
        title: t("kitchen.ration"),
        subTitle: t("kitchen.ration"),
        router: "reference-ration",
      },
      {
        title: t("monitoring.dishes"),
        subTitle: t("monitoring.dishes"),
        router: "reference-dish",
      },
    ],
  },
  {
    title: t("settings.managementFactoriesAndWarehouses"),
    permissions: ["admin", "super_admin"],
    menu: [
      {
        title: t("regionalDirectorates.title"),
        subTitle: t("regionalDirectorates.title"),
        router: "reference-regional-directorates",
      },
      {
        title: t("combineNutrition.title"),
        subTitle: t("combineNutrition.title"),
        router: "reference-combine-nutrition",
      },
      {
        title: t("warehouseBases.title"),
        subTitle: t("warehouseBases.title"),
        router: "reference-warehouse-bases",
      },
      {
        title: t("baseWarehouses.title"),
        subTitle: t("baseWarehouses.title"),
        router: "reference-main-bases",
      },
      {
        title: t("kitchenWarehouses.title"),
        subTitle: t("kitchenWarehouses.title"),
        router: "reference-kitchen-warehouse",
      },
      {
        title: t("kitchenType.title"),
        subTitle: t("kitchenType.title"),
        router: "reference-kitchen-type",
      },
    ],
  },
  {
    title: t("settings.positionsAndRoles"),
    permissions: ["admin", "super_admin"],
    menu: [
      {
        title: t("position.list"),
        subTitle: t("position.list"),
        router: { name: "position" },
      },
      {
        title: t("role.name"),
        subTitle: t("role.name"),
        router: { name: "role" },
      },
    ],
  },
  {
    title: t("settings.suppliersAndOrganizations"),
    permissions: ["admin", "super_admin"],
    menu: [
      {
        title: t("suppliers.title"),
        subTitle: t("suppliers.title"),
        router: "reference-suppliers",
      },
      {
        title: t("organization.title"),
        subTitle: t("organization.title"),
        router: "reference-organization",
      },
    ],
  },
  {
    title: t("common.unitMeasurement2"),
    permissions: ["admin", "super_admin"],
    menu: [
      {
        title: t("common.unitMeasurement2"),
        subTitle: t("common.unitMeasurement2"),
        router: "reference-unit",
      },
    ],
  }]);

const { setBreadCrumb } = useBreadcrumb();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
  }, {
    label: title.value,
    isTranslate: isTranslate.value,
    isActionable: true,
  }]);
};

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="grid grid-cols-3 gap-8 mt-[24px]">
      <div
        class="space-y-2 mb-[50px]"
        v-for="(item, index) in ulItems"
        :key="index"
      >
        <h3
          v-if="check(item.permissions)"
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
        >
          <router-link :to="menu.router as string">
            <div class="inline-block py-[8px] px-[12px] rounded-[16px] hover:bg-[#F8F9FC]">
              <li
                class="text-[#4F5662] text-[14px] font-medium leading-[20px] cursor-pointer"
              >
                {{ menu.title }}
              </li>
              <li
                class="text-[12px] text-[#A8AAAE] font-normal mt-[4px] leading-[16px] cursor-pointer"
              >
                {{ menu.subTitle }}
              </li>
            </div>
          </router-link>
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
