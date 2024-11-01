<script
  setup
  lang="ts"
>

import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import medicalKitchenIcon from "@/assets/images/icons/kitchen/medical-kitchen.svg";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import cookieIcon from "@/assets/images/icons/kitchen/cookie.svg";
import buildingHospitalIcon from "@/assets/images/icons/kitchen/building-hospital.svg";
import healthFoodIcon from "@/assets/images/icons/kitchen/health-food.svg";
import soupIcon from "@/assets/images/icons/kitchen/soup.svg";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const { setBreadCrumb } = useBreadcrumb();

const route = useRoute();
const router = useRouter();
const kitchenStore = useKitchenStore();

const boxes = computed(() => {
  return [
    {
      id: 1,
      icon: medicalKitchenIcon,
      title: "Кухни ЛПП",
      description: "4 кухни",
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Кухня",
      description: "4 кухни",
    },
    {
      id: 3,
      icon: cookieIcon,
      title: "Буфет",
      description: "2 Буфета",
    },
    {
      id: 4,
      icon: buildingHospitalIcon,
      title: "Больница",
      description: "3 Больници",
    },
    {
      id: 5,
      icon: healthFoodIcon,
      title: "Профилакторий",
      description: "3 Профилактории",
    },
    {
      id: 6,
      icon: soupIcon,
      title: "Лагерь",
      description: "6 лагерей",
    },
  ];
});

const setBreadcrumbFn = () => {
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
      isActionable: true,
    },
  ]);
};

watch(() => route.params, () => {
  setBreadcrumbFn();
}, { immediate: true });

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