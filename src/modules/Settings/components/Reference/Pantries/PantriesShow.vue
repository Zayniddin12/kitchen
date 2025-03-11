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
      label: "pantries.title",
      isTranslate: true,
      to: { name: "reference-workshop" },
    }, {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isTranslate: !!route.meta.breadcrumbItemIsTranslate,
      isActionable: true,
    }]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_PANTRIES_ITEM(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.pantriesItemLoading"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-2 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.pantriesItem">
          <div>
            <span class="app-card__item-title">
              {{ t("Наименование цеха Рус:") }}
            </span>
            <p>
              {{ settingsStore.pantriesItem.name['ru'] && settingsStore.pantriesItem.name['ru']}}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("Наименование цеха Ўзб:") }}
            </span>
            <p>
              {{ settingsStore.pantriesItem.name['uz'] && settingsStore.pantriesItem.name['uz'] }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("Вместимость склада цеха:") }}
            </span>
            <p>
              {{ settingsStore.pantriesItem.capacity && settingsStore.pantriesItem.capacity }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
             {{ t("combineNutrition.title") }}
            </span>
            <p>
              {{ settingsStore.pantriesItem.factory_name && settingsStore.pantriesItem.factory_name }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('update', 'Button')"
        :to="{name: 'reference-pantries-edit'}"
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