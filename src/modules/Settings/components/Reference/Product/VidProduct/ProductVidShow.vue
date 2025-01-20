<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { useI18n } from "vue-i18n";
import { LOCALES } from "../../../../../../localization/localization.type";

const route = useRoute();

const routeId = computed<number>(() => {
  return +route.params.id;
});

const { locale } = useI18n();

const settingsStore = useSettingsStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Виды продуктов",
      to: { name: "reference-vid-product" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const fetchVidProduct = () => {
  settingsStore.GET_TYPE_PRODUCT_DETAIL(routeId.value);
};

onMounted(() => {
  setBreadCrumbFn();
  fetchVidProduct();
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.typeProductDetailLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        :rounded="16"
      >
        <template v-if="settingsStore.typeProductDetail">
          <img
            v-if="settingsStore.typeProductDetail.image"
            :src="settingsStore.typeProductDetail.image"
            :alt="settingsStore.typeProductDetail.name[(locale as 'uz' | 'ru')]"
            class="w-full h-[250px] object-contain"
          />
          <div class="mt-5 grid grid-cols-2 gap-6">
            <div>
              <span class="app-card__item-title">Наименование</span>
              <p>{{ settingsStore.typeProductDetail.name[locale as LOCALES] || "—" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Тип продукта</span>
              <p>{{ settingsStore.typeProductDetail.parent_name || "—" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Единица измерения</span>
              <p>{{ settingsStore.typeProductDetail.measurement_unit_name || "—" }}</p>
            </div>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-vid-edit-id'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        Редактировать
      </RouterLink>
    </div>
  </section>
</template>