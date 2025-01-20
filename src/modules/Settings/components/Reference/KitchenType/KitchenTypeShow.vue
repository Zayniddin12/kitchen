<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { onMounted } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useSettingsStore } from "@/modules/Settings/store";
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
      label: "Типы кухни",
      to: { name: "reference-kitchen-type" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_KITCHEN_TYPE_DETAIL(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    <div class="flex gap-x-6 items-start mt-6">
      <AppOverlay
        :loading="settingsStore.kitchenTypeDetailLoading"
        :rounded="16"
        parent-class-name="w-[70%] app-card border border-[#E2E6F3] p-[24px] min-h-[60vh]"
        class="grid grid-cols-2 gap-6"
      >
        <template v-if="settingsStore.kitchenTypeDetail">
          <div>
            <span class="app-card__item-title">
              {{$t('common.name2')}}
            </span>
            <p>
              {{ settingsStore.kitchenTypeDetail.name[activeLocale] }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              {{$t('common.status')}}
            </span>
            <p>
              {{ settingsStore.kitchenTypeDetail.is_paid ? $t('kitchen.paid') : $t('kitchen.free') }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-kitchen-type-edit'}"
        class="custom-light-btn flex items-center justify-center w-full max-w-[17%]"
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
