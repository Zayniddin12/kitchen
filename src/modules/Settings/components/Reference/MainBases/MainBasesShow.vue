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
const {t} = useI18n()
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
      label: "Склады базы",
      to: { name: "reference-main-bases" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.fetchBaseWarehouse(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    <div class="flex items-start gap-x-6 mt-6">
      <AppOverlay
        :loading="settingsStore.baseWarehouseLoading"
        :rounded="16"
        parent-class-name="w-[70%] app-card border border-[#E2E6F3] p-[24px] min-h-[60vh]"
      >
        <template v-if="settingsStore.baseWarehouse">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <span class="app-card__item-title">{{$t('common.name2')}}</span>
              <p>{{ settingsStore.baseWarehouse.name[activeLocale] }}</p>
            </div>
            <div>
              <span class="app-card__item-title">
                {{$t('База складов')}}
              </span>
              <p>-</p>
            </div>
            <div>
              <span class="app-card__item-title">
                {{$t('Вместимость склада')}}
              </span>
              <p>
                {{ settingsStore.baseWarehouse.capacity }}
              </p>
            </div>
            <div>
              <span class="app-card__item-title">
<!--                {{$t('common.unitMeasurement')}}-->
              </span>
              <p>
<!--                - -->
              </p>
            </div>
            <div>
              <span class="app-card__item-title">
                {{$t('Типы продуктов хранения')}}
              </span>
              <p>
                {{ settingsStore.baseWarehouse.warehouseProductTypes.map(el => el.name).join(", ") }}
              </p>
            </div>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('read', 'Button')"
        :to="{name: 'reference-main-bases-edit'}"
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
