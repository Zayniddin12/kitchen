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
      description: "Есть 4 плана"
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Рационы",
      description: "80 рационов"
    },
    {
      id: 3,
      icon: calculatorIcon,
      title: "Калькулятор",
      description: "Расчет"
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
            :to="{name: 'KitchenMealPlanIndex', params: {meal_plan_id: box.id}}"
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