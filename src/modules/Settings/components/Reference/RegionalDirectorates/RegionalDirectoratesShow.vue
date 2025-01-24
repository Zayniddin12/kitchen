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

const route = useRoute();

const settingsStore = useSettingsStore();

const { setBreadCrumb } = useBreadcrumb();

const { t } = useI18n();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "common.settings",
    isTranslate: true,
    isActionable: false,
  }, {
    label: "settings.directories",
    isTranslate: true,
    isActionable: false,
    to: { name: "reference" },
  },

    {
      label: "settings.managementFactoriesAndWarehouses",
      isTranslate: true,
      isActionable: false,
      to: { name: "reference" },
    },

    {
      label: "regionalDirectorates.title",
      isTranslate: true,
      isActionable: false,
      to: { name: "reference-regional-directorates" },
    }, {
      label: "common.view",
      isTranslate: true,
      isActionable: true,
    }]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_REGIONAL_DETAIL(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.regionalDetailLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-2 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.regionalDetail">
          <div>
            <span class="app-card__item-title">
              {{ t("common.name2") }}
            </span>
            <p>
              {{ settingsStore.regionalDetail.name[activeLocale] }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.subordination") }}
            </span>
            <p>
              {{ settingsStore.regionalDetail.responsible_position }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('update', 'Button')"
        :to="{name: 'reference-regional-directorates-edit'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        {{t("method.edit")}}
      </RouterLink>
    </div>
  </section>
</template>