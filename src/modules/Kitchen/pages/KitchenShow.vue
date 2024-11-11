<script
  setup
  lang="ts"
>

import { computed, watch, watchEffect } from "vue";
import kitchenIcon from "@/assets/images/icons/kitchen/kitchen.svg";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const kitchenStore = useKitchenStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const boxes = computed(() => {
  return [
    {
      id: 1,
      icon: kitchenIcon,
      title: "Ёшлар",
      description: "80 мест",
    },
    {
      id: 2,
      icon: kitchenIcon,
      title: "Високоволтнй",
      description: "100 мест",
    },
    {
      id: 3,
      icon: kitchenIcon,
      title: "Табассум",
      description: "120 мест",
    },
    {
      id: 4,
      icon: kitchenIcon,
      title: "Мойбулоқ",
      description: "150 мест",
    },
    {
      id: 5,
      icon: kitchenIcon,
      title: "Ёғду",
      description: "80 мест",
    },
    {
      id: 6,
      icon: kitchenIcon,
      title: "Паҳлавон",
      description: "100 мест",
    },
  ];
});

const setBreadcrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);


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
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      isActionable: true,
    },
  ]);
};

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "menu" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "menu" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });
  setBreadcrumbFn();
}, { immediate: true });

watchEffect(() => {
  setBreadcrumbFn();
});

</script>

<template>
  <section class="kitchen-show">
    <div>
      <div class="boxes">
        <!--        {{ kitchenStore.kitchenType}}-->
        <template v-if="kitchenStore.kitchenType.length">
          <RouterLink
            v-for="box in kitchenStore.kitchenType"
            :key="box.id"
            class="box"
            :to="{name: 'KitchenShowChild', params: {child_id: box.id}}"
          >
            <img
              :src="kitchenIcon"
              :alt="box.name"
            />
            <strong class="box__title">
              {{ box.name }}
            </strong>
            <span class="box__description">
          {{ box.kitchen_capacity }}
        </span>
          </RouterLink>
        </template>
      </div>
    </div>
  </section>
</template>

<style
  scoped
  lang="scss"
>

</style>