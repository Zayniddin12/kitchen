<script
  setup
  lang="ts"
>
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { activeLocale } from "@/localization";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();

const title = computed(() => route.meta.title || "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const settingsStore = useSettingsStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
  }, {
    label: "settings.directories",
    isTranslate: true,
    to: { name: "reference" },
  },

    {
      label: "settings.managementFactoriesAndWarehouses",
      isTranslate: true,
      to: { name: "reference" },
    },

    {
      label: "warehouseBases.title",
      isTranslate: true,
      to: { name: "reference-warehouse-bases" },
    }, {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isTranslate: !!route.meta.breadcrumbItemIsTranslate,
      isActionable: true,
    }]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_WAREHOUSE_BASES_ITEM(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.wareHouseItemLoading"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-2 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.wareHouseItem">
          <div>
            <span class="app-card__item-title">
              {{ t("common.name2") }}
            </span>
            <p>
              {{ settingsStore.wareHouseItem.name[activeLocale] }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.legalAddressDatabase") }}
            </span>
            <p>
              {{ settingsStore.wareHouseItem.address }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.uniqueDatabaseCode") }}
            </span>
            <p>
              {{ settingsStore.wareHouseItem.code }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
             {{ t("combineNutrition.title") }}
            </span>
            <p>
              -
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-warehouse-bases-edit'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
          {{ t("method.edit") }}
      </RouterLink>
    </div>
  </section>
</template>