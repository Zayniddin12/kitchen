<script
  setup
  lang="ts"
>

import { useRoute } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { phoneFormatter } from "@/utils/helper";

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
      label: "Поставщики",
      to: { name: "reference-suppliers" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_PROVIDERS_DETAIL(+route.params.id);
});

</script>
<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
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
              Наименование
            </span>
            <p>
              {{ settingsStore.providerDetail.name || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Юр. адрес
            </span>
            <p>
              {{ settingsStore.providerDetail.address || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              ОКЭД
            </span>
            <p>
              {{ settingsStore.providerDetail.oked || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              ИНН
            </span>
            <p>
              {{ settingsStore.providerDetail.tin || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Номер лицензии
            </span>
            <p>
              {{ settingsStore.providerDetail.license || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Сертификат
            </span>
            <p>
              {{ settingsStore.providerDetail.sertificate || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Срок сертификата
            </span>
            <p>
              {{ settingsStore.providerDetail.sert_end_date || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Руководитель
            </span>
            <p>
              {{ settingsStore.providerDetail.director || "-" }}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Контакты
            </span>
            <p>
              {{ settingsStore.providerDetail.phone ? phoneFormatter(settingsStore.providerDetail.phone) : "-" }}
            </p>
          </div>
        </template>
      </AppOverlay>
      <RouterLink
        :to="{name: 'reference-suppliers-edit'}"
        class="custom-light-btn flex items-center ml-6 justify-center w-full max-w-[17%]"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="size-5"
        />
        Редактировать
      </RouterLink>
    </div>
  </section>
</template>

<style lang="scss">

</style>