<script
  setup
  lang="ts"
>
import { computed, watch, watchEffect } from "vue";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import menuIcon from "@/assets/images/icons/kitchen/menu-icon.svg";
import calculatorIcon from "@/assets/images/icons/kitchen/calculator-icon.svg";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";
import { useI18n } from "vue-i18n";

const { setBreadCrumb } = useBreadcrumb();

const { t } = useI18n();

const route = useRoute();

const kitchenStore = useKitchenStore();

const menuBoxes = computed(() => {
  return [
    {
      id: 1,
      icon: menuIcon,
      title: t("common.menu"),
      description: t("kitchen.therePlans", { number: 4 }),
      link: { name: "KitchenMenuIndex" },
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: t("kitchen.ration"),
      description: t("kitchen.rations", { number: 80 }),
      link: { name: "KitchenRation" },
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: t("common.calculator"),
      description: t("kitchen.calculation"),
      link: { name: "KitchenCalculator" },
    },
  ];
});

const salesBoxes = computed(() => {
  return [
    {
      id: 1,
      icon: menuIcon,
      title: t("common.menu"),
      description: t("kitchen.therePlans", { number: 4 }),
      link: { name: "KitchenMenuIndex" },
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: t("kitchen.dishes2"),
      description: t("kitchen.rations", { number: 80 }),
      link: { name: "KitchenDishesIndex" },
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: t("common.calculator"),
      description: t("kitchen.calculation"),
      link: { name: "KitchenCalculator" },
    },
  ];
});

const boxes = computed(() => {
  if (kitchenStore.activeMenuPart) return menuBoxes.value;
  else if (kitchenStore.activeSalesPart) return salesBoxes.value;

  return [];
});

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      isActionable: false,
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
      isActionable: true,
    },
  ]);
};

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });
  setBreadCrumbFn();
}, { immediate: true });

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section class="kitchen-child">
    <div>
      <div
        v-if="boxes.length"
        class="boxes"
      >
        <RouterLink
          v-for="box in boxes"
          :key="box.id"
          class="box"
          :to="box.link"
        >
          <img
            :src="box.icon"
            :alt="box.title"
            class="box__img"
          />
          <strong class="box__title">
            {{ box.title }}
          </strong>
          <span class="box__description">
          {{ box.description }}
        </span>
        </RouterLink>
      </div>
      <AppEmpty
        v-else
        class="h-[60vh]"
      />
    </div>
  </section>
</template>