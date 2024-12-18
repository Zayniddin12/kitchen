<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";

const { t } = useI18n();

const positionStore = usePositionStore();

const route = useRoute();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "common.settings",
      isTranslate: true,
      to: { name: "reference" },
    },
    {
      label: "settings.directories",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: "settings.positionsAndRoles",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: "position.list",
      isTranslate: true,
      to: { name: "position-list" },
    },
    {
      label: "method.add",
      isActionable: true,
      isTranslate: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  positionStore.fetchPosition(+route.params.id);
});

</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-x-8">
      <h1 class="text-black-text text-[32px] font-semibold">
        {{ isTranslate ? t(title) : title }}
      </h1>
      <RouterLink
        :to="{name: 'position-edit'}"
        class="rounded-lg bg-[#E2E6F3] py-2.5 px-5 inline-flex items-center gap-x-2"
      >
        <img
          src="/icons/edit.svg"
          alt="edit icon"
          class="size-5"
        />
        <span class="text-lg font-medium text-dark-gray">
          {{ t("method.edit") }}
        </span>
      </RouterLink>
    </div>
    <div class="mt-6 rounded-3xl border border-[#E2E6F3]  p-6 min-h-[65vh]">
      <AppOverlay
        :loading="positionStore.positionLoading"
        :rounded="16"
        class="p-4 rounded-2xl bg-[#F8F9FC] grid grid-cols-2 gap-3 text-sm font-medium"
      >
        <div>
          <div class="text-blue-500">
            {{ t("position.name", { lang: t("lang.ru") }) }}:
          </div>
          <div class="text-dark-gray mt-1">
            {{ positionStore.position?.name.ru ?? "-" }}
          </div>
        </div>
        <div>
          <div class="text-blue-500">
            {{ t("position.name", { lang: t("lang.uz") }) }}:
          </div>
          <div class="text-dark-gray mt-1">
            {{ positionStore.position?.name.uz ?? "-" }}
          </div>
        </div>
        <div>
          <div class="text-blue-500">
            {{ t("position.affiliation") }}:
          </div>
          <div class="text-dark-gray mt-1">
            {{ positionStore.position?.work_place_name ?? "-" }}
          </div>
        </div>
      </AppOverlay>
    </div>
  </section>
</template>