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
      label: "Базы складов",
      to: { name: "reference-warehouse-bases" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_WAREHOUSE_BASES_ITEM(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
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
              Наименование
            </span>
            <p>
              {{ settingsStore.wareHouseItem.name[activeLocale]}}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Юр. адрес базы
            </span>
            <p>
              {{ settingsStore.wareHouseItem.address}}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
              Уникальный код базы
            </span>
            <p>
              {{ settingsStore.wareHouseItem.code}}
            </p>
          </div>
          <div>
            <span class="app-card__item-title">
             Комбинаты питания
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
        />
        Редактировать
      </RouterLink>
    </div>
  </section>
</template>

<style lang="scss">

</style>