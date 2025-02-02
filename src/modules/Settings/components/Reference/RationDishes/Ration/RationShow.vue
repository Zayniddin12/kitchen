<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { LOCALES } from "@/localization/localization.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { useI18n } from "vue-i18n";
import { RationProductTypeType } from "@/modules/Settings/settings.types";

const route = useRoute();
const { locale } = useI18n();
const { t } = useI18n();

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
      label: "Рационы и блюда",
      to: { name: "reference" },
    },
    {
      label: "Рационы",
      to: { name: "reference-ration" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  settingsStore.GET_SHOW_ITEM(+route.params.id);
});

</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ t(route.meta.title) }}</h1>
    <div class="flex items-start mt-6">
      <AppOverlay
        :loading="settingsStore.rationLoading"
        :loading-size="60"
        parent-class-name="app-card w-[70%] min-h-[65vh]"
      >
        <template v-if="settingsStore.ration">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <span class="app-card__item-title">Наименование</span>
              <p>{{ settingsStore.ration.name[locale as LOCALES] || "-" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Уникальный номер рациона</span>
              <p>{{ settingsStore.ration.number || "-" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Тип кухни</span>
              <p>{{ settingsStore.ration.kitchen_type_ids.length ? settingsStore.ration.kitchen_type_ids.join(",") : "-"
                }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Длительность</span>
              <p>{{ settingsStore.ration.duration_in_days || "-" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Время начало</span>
              <p>{{ settingsStore.ration?.start_time.split(":").slice(0, 2).join(":") || "-" }}</p>
            </div>
            <div>
              <span class="app-card__item-title">Время окончания</span>
              <p>{{ settingsStore.ration?.end_time.split(":").slice(0, 2).join(":") || "-" }}</p>
            </div>
          </div>
          <h4 class="text-dark text-lg font-medium mt-10">Состав рациона</h4>
          <ElTable
            v-if="settingsStore.ration.meals && settingsStore.ration.meals.length"
            :data="settingsStore.ration.meals"
            class="custom-element-table mt-3"
            :empty-text="$t('common.empty')"
          >
            <ElTableColumn
              width="80"
              prop="idx"
              label="№"
            >
              <template #default="{$index}">
                {{ $index + 1 }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="name"
              label="Блюдо"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.name }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="Количество"
              prop="quantity"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.quantity }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="Ед. измерения"
              prop="unit"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.unit_name }}
              </template>
            </ElTableColumn>
          </ElTable>
          <ElTable
            v-if="settingsStore.ration.product_types && settingsStore.ration.product_types.length"
            :data="settingsStore.ration.product_types"
            class="custom-element-table mt-3"
            :empty-text="$t('common.empty')"
          >
            <ElTableColumn
              width="80"
              prop="idx"
              label="№"
            >
              <template #default="{$index}">
                {{ $index + 1 }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product_parent"
              label="Тип продукта"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.parent_id }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="product"
              label="Вид продукта"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.id }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="Количество"
              prop="quantity"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.quantity }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="Ед. измерения"
              prop="unit"
              align="center"
            >
              <template #default="{row}:{row: RationProductTypeType}">
                {{ row.unit_id }}
              </template>
            </ElTableColumn>
          </ElTable>
        </template>
      </AppOverlay>
      <RouterLink
        v-if="$can('update', 'Button')"
        :to="{name: 'reference-ration-edit-id'}"
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