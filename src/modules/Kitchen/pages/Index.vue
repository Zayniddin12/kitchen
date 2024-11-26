<script
  setup
  lang="ts"
>

import { computed, onMounted, watch, watchEffect } from "vue";
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

// onMounted(async () => {
//   console.log(route.params);
//   await kitchenStore.GET_KITCHEN_TYPE({
//     base_id: route.params.department_id,
//     is_paid: route.params.part_name == "menu" ? 0 : route.params.part_name == "sale" ? 1 : null,
//   });
// });

const setBreadcrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      isActionable: true,
    },
  ]);
};

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  setBreadcrumbFn();
}, { immediate: true });

watch(() => kitchenStore.departments, async () => {

  setBreadcrumbFn();
}, { immediate: true });

watchEffect(() => {
  setBreadcrumbFn();
})

</script>

<template>
  <section class="kitchen">
    <div>
      <div class="boxes">
        <template v-if="kitchenStore.kitchenVid.length">
          <RouterLink
            v-for="box in kitchenStore.kitchenVid"
            :key="box?.id"
            class="box"
            :to="{name: 'KitchenShow', params: {kitchen_id: box?.id}}"
          >
            <img
              :src="kitchenIcon"
              :alt="box.name"
              class="box__img"
            />
            <strong class="box__title">
              {{ box?.name }}
            </strong>
            <span class="box__description">
          {{ box?.kitchens_count }}
        </span>
          </RouterLink>
        </template>
      </div>
    </div>
  </section>
</template>