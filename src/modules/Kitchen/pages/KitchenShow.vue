<script
    setup
    lang="ts"
>

import { computed } from "vue";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";

const boxes = computed(() => {
  return [
    {
      id: 1,
      icon: kitchenIcon,
      title: "Ёшлар",
      description: "80 мест"
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Високоволтнй",
      description: "100 мест"
    },
    {
      id: 3,
      icon: kitchenIcon,
      title: "Табассум",
      description: "120 мест"
    },
    {
      id: 4,
      icon: kitchenIcon,
      title: "Мойбулоқ",
      description: "150 мест"
    },
    {
      id: 5,
      icon: kitchenIcon,
      title: "Ёғду",
      description: "80 мест"
    },
    {
      id: 6,
      icon: kitchenIcon,
      title: "Паҳлавон",
      description: "100 мест"
    }
  ];
});

</script>

<template>
  <section class="kitchen-show">
    <div>
      <div class="boxes">
        <RouterLink
            v-for="box in boxes"
            :key="box.id"
            class="box"
            :to="{name: 'KitchenShowChild', params: {child_id: box.id}}"
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

<style
    scoped
    lang="scss"
>

</style>