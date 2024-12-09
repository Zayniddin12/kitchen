<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

const route = useRoute();

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
      label: "Поставщики и организации",
      to: { name: "reference" },
    },

    {
      label: "Организации",
      to: { name: "reference-organization" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_ORGANIZATION_DETAIL(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.organizationDetailLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-2 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.organizationDetail">
          <div>
          <span class="app-card__item-title">
            Наименование
          </span>
            <p>
              {{settingsStore.organizationDetail.name || "-"}}
            </p>
          </div>
          <div>
          <span class="app-card__item-title">
            Юр. адрес
          </span>
            <p>
              {{settingsStore.organizationDetail.address || "-"}}
            </p>
          </div>
          <div>
          <span class="app-card__item-title">
            ИНН
          </span>
            <p>
              {{settingsStore.organizationDetail.tin || "-"}}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-organization-edit'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
        />
        Редактировать
      </RouterLink>
    </div>
  </section>
</template>

<style lang="scss">

</style>