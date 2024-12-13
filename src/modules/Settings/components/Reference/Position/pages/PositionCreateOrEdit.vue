<script
  setup
  lang="ts"
>

import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { getStatusText } from "@/utils/helper";

const { t } = useI18n();

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const method = computed(() => route.meta.method ?? "");

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
      label: route.meta.breadcrumbItemTitle ?? "",
      isActionable: true,
      isTranslate: route.meta.breadcrumbItemIsTranslate,
    },
  ]);
};

const form = reactive({
  status: true,
});

onMounted(() => {
  settingsStore.GET_REGIONAL({ per_page: 100 });
  setBreadCrumbFn();
});

</script>

<template>
  <section>
    <h1 class="text-black-text text-[32px] font-semibold">
      {{ isTranslate ? t(title) : title }}
    </h1>
    <div class="min-w-[792px] w-[75%]">
      <AppOverlay
        :rounded="24"
        parent-class-name="border border-[#E2E6F3] rounded-3xl mt-6"
        class="p-6 min-h-[61vh] flex flex-col justify-between"
      >
        <div>
          <div class="grid grid-cols-3 gap-x-6">
            <AppInput
              :label="t('position.name', {lang: t('lang.ru')})"
              label-class="font-medium text-xs text-black-sub"
              class="mb-0"
            />
            <AppInput
              :label="t('position.name', {lang: t('lang.uz')})"
              label-class="font-medium text-xs text-black-sub"
              class="mb-0"
            />
          </div>
          <div class="mt-6">
            <div class="pb-2 border-b border-[#F1F1F1]">
              <h3 class="text-black-text font-medium text-sm">
                {{ t("position.affiliation") }}
              </h3>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-x-6 gap-y-3">
              <AppInput
                :label="t('common.fund')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-1"
                :placeholder="t('logo.name')"
                disabled
              />
              <AppSelect
                :items="settingsStore.regional.managements"
                item-value="id"
                item-label="name"
                prop="management_id"
                :label="t('settings.regionalAdministration')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-0"
                required
              />
              <AppSelect
                :label="t('user.combine')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-0"
              />
              <AppInput
                :label="t('base.warehouse.title')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-0"
              />
              <AppSelect
                :label="t('base.warehouse.reverseTitle')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-0"
              />
              <AppSelect
                :label="t('kitchen.title')"
                label-class="text-[#A8AAAE] text-xs font-medium"
                class="mb-0"
              />
            </div>
          </div>
        </div>
        <ElSwitch
          v-if="method === 'update'"
          v-model="form.status"
          :active-text="getStatusText(form.status)"
          class="app-switch mt-4 inline-flex"
        />
      </AppOverlay>
      <div class="flex justify-between items-center mt-6 gap-x-6">
        <button
          class="custom-danger-btn"
          v-if="method === 'update'"
        >
          {{ t("method.delete")}}
        </button>
        <div class="flex items-center ml-auto gap-x-2">
          <button class="custom-cancel-btn">
            {{ t("method.cancel") }}
          </button>
          <ElButton
            type="primary"
            size="large"
          >
            {{ method === "create" ? t("method.add") : t("method.save") }}
          </ElButton>
        </div>
      </div>
    </div>
  </section>
</template>