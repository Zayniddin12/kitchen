<script
  setup
  lang="ts"
>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Name } from "@/utils/helper";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

interface DataValue {
  management_id: string;
  capacity: string;
  kitchen_capacity: string;
  kitchen_type_id: string;
  measure_id: string;
  status: string | boolean;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const {t} = useI18n()
const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { setBreadCrumb } = useBreadcrumb();

const loading = ref<boolean>(false);
const dataValue = ref<DataValue>({
  name: new Name(),
  base_id: "",
  capacity: "",
  kitchen_capacity: "",
  kitchen_type_ids: [],
  measure_id: 2,
  status: "active",
});

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
      label: "Склады кухни",
      to: { name: "reference-kitchen-warehouse" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

onMounted(async () => {
  try {
    loading.value = true;
    try {
      await store.GET_WAREHOUSE_BASES_LIST({ per_page: 100 });
      await store.GET_KITCHEN_TYPE();
      await store.GET_UNITS();

      if (route.params.id) {
        const wr = await store.GET_KITCHEN_WAREHOUSE_DETAIL(+route.params.id);
        if (wr && wr.kitchen_warehouse) {
          dataValue.value = wr.kitchen_warehouse;
        }

        dataValue.value.status = dataValue.value.status === "active";
      }
    } catch (e) {
      ElNotification({ title: e, type: "error" });
    } finally {
      loading.value = false;
    }
  } catch (e) {

  }
});

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      if (route.params.id) {

        dataValue.value.status = dataValue.value.status ? "active" : "inactive";
        await store.UPDATE_KITCHEN_WAREHOUSE({
          id: route.params.id as string | number,
          data: dataValue.value as DataValue,
        });
      } else {
        dataValue.value.status = dataValue.value.status ? "active" : "inactive";
        await store.CREATE_KITCHEN_WAREHOUSE(dataValue.value as DataValue);
      }
      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-kitchen-warehouse");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push("/reference-kitchen-warehouse");
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_KITCHEN_WAREHOUSE(route.params.id);
    router.push("/reference-kitchen-warehouse");
    ElNotification({ title: "Success", type: "success" });
  });
};

const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

const isDisabled = computed(() => {
  return route.name === "reference-kitchen-warehouse-view";
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });
</script>

<template>
  <section>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px] mb-[24px]">{{ $t(route.meta.title) }}</h1>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppOverlay
          :loading
          :rounded="16"
          class="border border-[#E2E6F3] rounded-2xl p-[24px] min-h-[60vh] flex flex-col"
        >
          <AppForm
            :value="dataValue"
            @validation="setValidation"
          >
            <div class="grid grid-cols-3 gap-4">
              <app-input
                v-model="dataValue.name.ru"
                :label="$t('Наименование (Рус)')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="name.ru"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.name.uz"
                :label="$t('Наименование (Ўзб)')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="name.uz"
                :disabled="isDisabled"
              />

              <app-select
                v-model="dataValue.base_id"
                :label="$t('База складов')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="base_id"
                item-value="id"
                item-label="name"
                :items="store.wareHouseList.bases"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.capacity"
                :label="$t('Вместимость склада')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                custom-type="number"
                prop="capacity"
                :disabled="isDisabled"
              >
                <template #append>
                  <span>тонна</span>
                </template>
              </app-input>

              <!--              <AppSelect-->
              <!--                v-model="dataValue.measure_id"-->
              <!--                :items="store.units.units"-->
              <!--                item-value="id"-->
              <!--                item-label="name"-->
              <!--                :label="$t('Ед. изм. вместимости')"-->
              <!--                :placeholder="$t('form.select')"-->
              <!--                label-class="text-[#A8AAAE] font-medium text-[12px]"-->
              <!--                class="w-full"-->
              <!--                type="number"-->
              <!--                prop="measure_id"-->
              <!--              />-->

              <app-select
                v-model="dataValue.kitchen_type_ids"
                :label="$t('Тип кухни')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                multiple
                prop="kitchen_type_ids"
                item-value="id"
                item-label="name"
                :items="store.kitchenTypes.kitchen_types"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.kitchen_capacity"
                :label="$t('Вместимость кухни')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="kitchen_capacity"
                :disabled="isDisabled"
              />
            </div>
          </AppForm>

          <ElSwitch
            v-model="dataValue.status"
            v-if="route.params.id && !route.query.type"
            :active-text="$t('status.deactivation')"
            class="app-switch mt-auto"
            :before-change="switchChange"
          />
        </AppOverlay>

        <div
          v-if="!route.query.type"
          class="flex items-center mt-[24px] "
          :class="!route.params.id ? 'justify-end' : 'justify-between'"
        >
          <button
            v-if="$can('delete', 'Button')"
            v-show="route.params.id"
            class="custom-danger-btn"
            @click="deleteFn"
          >
            {{ $t("method.delete") }}
          </button>

          <div class="flex items-center gap-4">
            <button
              @click="cancelFn"
              class="custom-cancel-btn"
            >
              {{ $t("method.cancel") }}
            </button>

            <button
              class="custom-apply-btn"
              @click="handleSubmit"
            >
              {{ $route.params.id ? $t("method.save") : $t("method.add") }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
          @click="router.push({name: 'reference-kitchen-warehouse-edit', params: {id: 1}})"
          v-if="route.query.type == 'view'"
          class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <img
            src="@/assets/images/icons/edit.svg"
            alt="#"
          >
          {{ $t("method.edit") }}
        </button>
      </div>
    </div>
  </section>
</template>

