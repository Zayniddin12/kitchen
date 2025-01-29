<script
  setup
  lang="ts"
>
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { onMounted } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { activeLocale } from "@/localization";
import { useI18n } from "vue-i18n";

const route = useRoute();

const settingsStore = useSettingsStore();
const { t } = useI18n();
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
      label: "Управ, комбинаты и склады",
      to: { name: "reference" },
    },

    {
      label: "Склады кухни",
      to: { name: "reference-kitchen-warehouse" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_KITCHEN_WAREHOUSE_DETAIL(+route.params.id);
});
</script>

<template>
  <section>
    <h1 class="font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    <div class="flex gap-x-6 items-start mt-6">
      <AppOverlay
        :loading="settingsStore.kitchenWarehouseDetailLoading"
        :rounded="16"
        parent-class-name="w-[70%] app-card border border-[#E2E6F3] p-[24px] min-h-[60vh]"
        class="grid grid-cols-2 gap-6"
      >
        <template v-if="settingsStore.kitchenWarehouseDetail">
          <div>
            <span class="app-card__item-title">
              {{ $t("common.name2") }}
            </span>
            <p>
              {{ settingsStore.kitchenWarehouseDetail.name[activeLocale] ?? "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ $t("База складов") }}
            </span>
            <p>
              {{ settingsStore.kitchenWarehouseDetail.base_name || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ $t("Вместимость склада") }}
            </span>
            <p>
              {{ settingsStore.kitchenWarehouseDetail.capacity || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ $t("Ед. изм. вместимости") }}
            </span>
            <p>
              {{ $t("тонна") }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ $t("Тип кухни") }}
            </span>
            <p
              v-if="settingsStore.kitchenWarehouseDetail.kitchen_type_names && settingsStore.kitchenWarehouseDetail.kitchen_type_names.length"
              v-for="item in settingsStore.kitchenWarehouseDetail.kitchen_type_names">
              {{ item }}
            </p>
            <span v-else>
              -
            </span>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ $t("Вместимость кухни") }}
            </span>
            <p>
              {{ settingsStore.kitchenWarehouseDetail.kitchen_capacity ?? "-" }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('update', 'Button')"
        :to="{name: 'reference-kitchen-warehouse-edit'}"
        class="custom-light-btn flex items-center justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        {{ $t("method.edit") }}
      </RouterLink>
    </div>
  </section>
</template>
