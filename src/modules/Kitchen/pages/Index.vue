<script
    setup
    lang="ts"
>

import { computed, onMounted, watch } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";
import medicalKitchenIcon from "@/assets/images/icons/kitchen/medical-kitchen.svg";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import cookieIcon from "@/assets/images/icons/kitchen/cookie.svg";
import buildingHospitalIcon from "@/assets/images/icons/kitchen/building-hospital.svg";
import healthFoodIcon from "@/assets/images/icons/kitchen/health-food.svg";
import soupIcon from "@/assets/images/icons/kitchen/soup.svg";

const route = useRoute();
const router = useRouter();
const kitchenStore = useKitchenStore();


onBeforeRouteUpdate((to, from, next) => {
  kitchenStore.fetchPart(+to.params.department_id, to.params.part_name);

  if (!kitchenStore.part) return next({ name: "notFound" });

  to.meta.breadcrumb = [
    {
      label: "Кухня"
    },
    {
      label: kitchenStore.part.name
    },
    {
      label: kitchenStore.part.department_name,
      isActionable: true
    }
  ];

  next();
});

const boxes = computed(() => {
  return [
    {
      id: 1,
      icon: medicalKitchenIcon,
      title: "Кухни ЛПП",
      description: "4 кухни"
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Кухня",
      description: "4 кухни"
    },
    {
      id: 3,
      icon: cookieIcon,
      title: "Буфет",
      description: "2 Буфета"
    },
    {
      id: 4,
      icon: buildingHospitalIcon,
      title: "Больница",
      description: "3 Больници"
    },
    {
      id: 5,
      icon: healthFoodIcon,
      title: "Профилакторий",
      description: "3 Профилактории"
    },
    {
      id: 6,
      icon: soupIcon,
      title: "Лагерь",
      description: "6 лагерей"
    }
  ];
});

</script>

<template>
  <section class="kitchen">
    <div>
      <div class="boxes">
        <RouterLink
            v-for="box in boxes"
            :key="box.id"
            class="box"
            :to="{name: 'KitchenShow', params: {kitchen_id: box.id}}"
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