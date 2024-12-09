<script
  setup
  lang="ts"
>

import { useSettingsStore } from "@/modules/Settings/store";
import { useRoute, useRouter } from "vue-router";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { computed, onMounted, ref } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const settingsStore = useSettingsStore();

const router = useRouter();
const route = useRoute();

const routeId = computed(() => {
  return route.params.id ? +route.params.id : 0;
});

const dataValue = ref({
  name: {
    uz: "",
    ru: "",
  },
  is_active: true,
});

const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const typeDoc = await settingsStore.GET_TYPE_PRODUCT_DETAIL(routeId.value);
    if (typeDoc && typeDoc.data && typeDoc.data.product_type) {
      dataValue.value = typeDoc.data.product_type;
    }
  } catch (error: any) {
    if (error?.error?.code === 404) {
      await router.replace({ name: "reference-type-product" });
    }
  } finally {
    loading.value = false;
  }
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Типы продуктов",
      to: { name: "reference-type-product" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};


onMounted(() => {
  fetchData();
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading
        parent-class-name="app-card w-[70%] min-h-[50vh]"
        class="grid grid-cols-2 gap-6"
      >
        <div>
          <span class="app-card__item-title">Наименование (RU)</span>
          <p>{{ dataValue.name.ru ?? "—" }}</p>
        </div>
        <div>
          <span class="app-card__item-title">Наименование (UZ)</span>
          <p>{{ dataValue.name.uz ?? "—" }}</p>
        </div>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-type-product-edit-id'}"
        class="custom-light-btn flex items-center ml-[24px]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
        />
        Редактировать
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss">

</style>