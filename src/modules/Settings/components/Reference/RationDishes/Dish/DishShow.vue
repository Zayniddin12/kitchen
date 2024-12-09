<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { LOCALES } from "@/localization/localization.type";
import { MealDetailCompositionType } from "@/modules/Settings/settings.types";

const route = useRoute();
const { locale } = useI18n();

const settingsStore = useSettingsStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },
    {
      label: "Рационы и блюда",
      to: { name: "reference" },
    },
    {
      label: "Блюда",
      to: { name: "reference-dish" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_MEALS_DETAIL(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.rationLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
      >
        <template v-if="settingsStore.mealDetail">
          <img
            v-if="settingsStore.mealDetail.image"
            :src="settingsStore.mealDetail.image"
            :alt="settingsStore.mealDetail.name[locale as LOCALES]"
            class="h-[250px] w-full mb-6"
          >
          <div class="grid grid-cols-3 gap-6">
            <div>
              <span class="app-card__item-title">Наименование</span>
              <p>{{ settingsStore.mealDetail.name[locale as LOCALES] || "-" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Уникальный номер блюда</span>
              <p>{{ settingsStore.mealDetail.number }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Ед. измерения</span>
              <p>{{ settingsStore.mealDetail.unit }}</p>
            </div>
          </div>
          <h4 class="text-dark text-lg font-medium mt-10">
            Состав блюда
          </h4>
            <ElTable
            :data="settingsStore.mealDetail.compositions"
            class="custom-element-table mt-3"
          >
            <ElTableColumn
              width="80"
              prop="idx"
              label="№"
            >
              <template #default="{$index}">
                {{ $index + 1 }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product_type_parent_name"
              label="Тип продукта"
              align="center"
            >
              <template #default="{row}:{row: MealDetailCompositionType}">
                {{ row.product_type_parent_name || "-"}}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product_type_name"
              label="Тип продукта"
              align="center"
            >
              <template #default="{row}:{row: MealDetailCompositionType}">
                {{ row.product_type_name || "-"}}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="quantity"
              label="Количество"
              align="center"
            >
              <template #default="{row}:{row: MealDetailCompositionType}">
                {{ row.quantity || "-"}}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="unit"
              label="Ед. измерения"
              align="center"
            >
              <template #default="{row}:{row: MealDetailCompositionType}">
                {{ row.unit || "-"}}
              </template>
            </ElTableColumn>
          </ElTable>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-dish-id'}"
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

<style
  scoped
  lang="scss"
>

</style>