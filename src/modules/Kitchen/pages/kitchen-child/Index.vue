<script
  setup
  lang="ts"
>
import { computed, watchEffect } from "vue";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import menuIcon from "@/assets/images/icons/kitchen/menu-icon.svg";
import calculatorIcon from "@/assets/images/icons/kitchen/calculator-icon.svg";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";

const { setBreadCrumb } = useBreadcrumb();
const route = useRoute();

const kitchenStore = useKitchenStore();

const menuBoxes = computed(() => {
  return [
    {
      id: 1,
      icon: menuIcon,
      title: "Меню",
      description: "Есть 4 плана",
      link: { name: "KitchenMenuIndex" },
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Рационы",
      description: "80 рационов",
      link: { name: "KitchenRation" },
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: "Калькулятор",
      description: "Расчет",
      link: { name: "KitchenCalculator" },
    },
  ];
});

const salesBoxes = computed(() => {
  return [
    {
      id: 1,
      icon: menuIcon,
      title: "Меню",
      description: "Есть 4 плана",
      link: { name: "KitchenMenuIndex" },
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Блюди",
      description: "80 рационов",
      link: { name: "KitchenDishesIndex" },
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: "Калькулятор",
      description: "Расчет",
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

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.name,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: "Лагерь",
      to: { name: "KitchenShowIndex" },
    },
    {
      label: "Паҳлавон",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section class="kitchen-child">
    <div>
      <div class="boxes">
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
    </div>
  </section>
</template>