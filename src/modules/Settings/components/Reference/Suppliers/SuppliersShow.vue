<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { phoneFormatter } from "@/utils/helper";
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
  }, {
    label: "settings.directories",
    isTranslate: true,
    to: { name: "reference" },
  },

    {
      label: "settings.suppliersAndOrganizations",
      isTranslate: true,
      to: { name: "reference" },
    },

    {
      label: "suppliers.title",
      isTranslate: true,
      to: { name: "reference-suppliers" },
    }, {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isTranslate: !!route.meta.breadcrumbItemIsTranslate,
      isActionable: true,
    }]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_PROVIDERS_DETAIL(+route.params.id);
});

</script>
<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">
      {{ route.meta.title }}
    </h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.providerDetailLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-3 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.providerDetail">
          <div>
            <span class="app-card__item-title">
              {{ t("common.name2") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.name || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.legalAddress") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.address || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.oked") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.oked || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.tin") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.tin || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("licence.number") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.license || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.certificate") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.sertificate || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.certificateDuration") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.sert_end_date || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.supervisor") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.director || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{ t("common.contact") }}
            </span>
            <p>
              {{ settingsStore.providerDetail.phone ? phoneFormatter(settingsStore.providerDetail.phone) : "-" }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('update', 'Button')"
        :to="{name: 'reference-suppliers-edit'}"
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