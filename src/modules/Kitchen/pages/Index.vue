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
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";

const { setBreadCrumb } = useBreadcrumb();

const route = useRoute();
const kitchenStore = useKitchenStore();

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
      label: "kitchen.title",
      isTranslate: true
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
});

</script>

<template>
  <section class="kitchen">
    <div>
      <div
        v-if="kitchenStore.kitchenVid.length"
        class="boxes"
      >
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
      </div>
      <AppEmpty
        v-else
        class="h-[60vh]"
      />
    </div>
  </section>
</template>