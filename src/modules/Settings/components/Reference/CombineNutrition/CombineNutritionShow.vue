<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { activeLocale } from "@/localization";

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
      label: "Управ, комбинаты и склады",
      to: { name: "reference" },
    },

    {
      label: "Комбинаты питания",
      to: { name: "reference-combine-nutrition" },
    },
    {
      label: route?.meta?.breadcrumbItemTitle as string ?? "",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.showFoodFactory(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.foodFactoryLoading"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
        class="grid grid-cols-2 gap-6"
        :rounded="16"
      >
        <template v-if="settingsStore.foodFactory">
          <div>
            <span class="app-card__item-title">
              {{$t('common.name2')}}
            </span>
            <p>
              {{ settingsStore.foodFactory.name[activeLocale] ?? "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{$t('settings.regionalAdministration')}}
            </span>
            <p>
              {{ settingsStore.foodFactory.management.name[activeLocale] ?? "-" }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-combine-nutrition-edit'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        {{$t('method.edit')}}
      </RouterLink>
    </div>
  </section>
</template>