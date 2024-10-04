<script
    setup
    lang="ts"
>
import { computed } from "vue";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import menuIcon from "@/assets/images/icons/kitchen/menu-icon.svg";
import calculatorIcon from "@/assets/images/icons/kitchen/calculator-icon.svg";

const boxes = computed(() => {
  return [
    {
      id: 1,
      icon: menuIcon,
      title: "Меню",
      description: "Есть 4 плана",
      link: {name: "KitchenMealPlanIndex"}
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Рационы",
      description: "80 рационов",
      link: {name: "KitchenRation"}
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: "Калькулятор",
      description: "Расчет",
      link: {name: "KitchenCalculator"}
    }
  ];
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

<style lang="scss">

</style>