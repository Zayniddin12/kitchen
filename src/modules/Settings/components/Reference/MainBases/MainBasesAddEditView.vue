<script
  setup
  lang="ts"
>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { BaseWarehouseDataType } from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";
import { deepEqual, getStatus, getStatusText, Name, setStatus } from "@/utils/helper";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { useCommonStore } from "@/stores/common.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const settingsStore = useSettingsStore();
const commonStore = useCommonStore();
const loading = ref(false);

const routeID = computed(() => {
  return route.params?.id ? +route.params.id : null;
});

const form = reactive<BaseWarehouseDataType>({
  name: new Name(),
  base_id: null,
  capacity: null,
  measure_id: null,
  product_ids: [],
});

const oldForm = ref<null | BaseWarehouseDataType>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const tableData = ref([
  {
    id: 1,
    name: "Овощи",
  },
  {
    id: 2,
    name: "Фрукты",
  },
]);

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
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const cancelFn = async () => {
  if (oldForm.value && !deepEqual(form, oldForm.value)) {
    const response = await confirm.cancel();
    if (response === "save") {
      await sendForm();
      return;
    }
  }

  await router.push({ name: "reference-main-bases" });
};


const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

const sendForm = async () => {
  if (!(v$.value && await v$.value.validate())) return;

  loading.value = true;

  try {
    if (route.name === "reference-main-bases-add") {
      await settingsStore.createBaseWarehouse(form);
    } else if (route.name === "reference-main-bases-edit" && routeID.value) {
      const newForm = { ...form };
      newForm.status = setStatus(form.status);
      await settingsStore.updateBaseWarehouse(routeID.value as number, newForm);
    }

    commonStore.successToast({ name: "reference-main-bases" });

  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteLoading = ref(false);

const deleteFn = () => {
  if (!routeID.value) return;

  confirm.delete().then(async () => {
    deleteLoading.value = true;
    await settingsStore.deleteBaseWarehouse(routeID.value as number);
    commonStore.successToast({ name: "reference-main-bases" });
  }).finally(() => {
    deleteLoading.value = false;
  });
};

const setForm = async () => {
  await settingsStore.fetchBaseWarehouse(routeID.value as number);

  if (!settingsStore.baseWarehouse) return;
  form.name = settingsStore.baseWarehouse.name;
  form.capacity = settingsStore.baseWarehouse.capacity;
  form.base_id = settingsStore.baseWarehouse.base_id;
  form.measure_id = settingsStore.baseWarehouse.measure_id;
  form.status = getStatus(settingsStore.baseWarehouse.status);
  form.product_ids = settingsStore.baseWarehouse.warehouseProducts.map(item => item.id);
};

onMounted(async () => {
  settingsStore.GET_UNITS();
  settingsStore.GET_TYPE_PRODUCT();
  settingsStore.GET_WAREHOUSE_BASES_LIST({ per_page: 100 });

  if (routeID.value) await setForm();

  oldForm.value = JSON.parse(JSON.stringify(form));
});

const disabledFormItems = computed<boolean>(() => {
  return route.name === "reference-main-bases-view";
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    <div class="flex items-start gap-6 mt-6">
      <div class="w-[70%]">
        <AppOverlay
          :loading="settingsStore.baseWarehouseLoading"
          :rounded="16"
          class="border border-[#E2E6F3] p-[24px] min-h-[60vh]"
        >
          <AppForm
            :value="form"
            @validation="setValidation"
            class="gap-x-4 gap-y-1 grid grid-cols-3"
          >
            <app-input
              v-model="form.name.ru"
              prop="name.ru"
              label="Наименование (Рус)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-xs"
              required
              :disabled="disabledFormItems"
            />

            <app-input
              v-model="form.name.uz"
              prop="name.uz"
              label="Наименование (Ўзб)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-xs"
              required
              :disabled="disabledFormItems"
            />

            <app-select
              v-model="form.base_id"
              :items="settingsStore.wareHouseList.bases"
              item-value="id"
              item-label="name"
              prop="base_id"
              label="База складов"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-xs"
              required
              :disabled="disabledFormItems"
            >
            </app-select>
            <app-input
              v-model="form.capacity"
              custom-type="number"
              prop="capacity"
              label="Вместимость склада"
              placeholder="Выберите"
              label-class="text-[#A8AAAE] font-medium text-xs"
              required
              :disabled="disabledFormItems"
            />
            <app-select
              v-model="form.measure_id"
              prop="measure_id"
              :items="settingsStore.units.units"
              item-value="id"
              item-label="name"
              label="Единица измерения"
              placeholder="тонна"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              required
              :disabled="disabledFormItems"
            >

            </app-select>
            <app-select
              v-if="route.name !== 'reference-main-bases-view'"
              v-model="form.product_ids"
              :items="settingsStore.typeProduct.product_categories"
              item-value="id"
              item-label="name"
              prop="product_ids"
              multiple
              label="Типы продуктов хранения"
              placeholder="Мясные"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              required
              :disabled="disabledFormItems"
            />
          </AppForm>

          <div v-if="route.name === 'reference-main-bases-view'">
            <el-table
              :data="settingsStore.baseWarehouse?.warehouseProducts ?? []"
              class="custom-element-table"
              stripe
            >
              <el-table-column
                prop="idx"
                label="№"
                width="100"
              >
                <template #default="{$index}">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="Наименование базы"
              />
            </el-table>
          </div>


          <ElSwitch
            v-if="route.name === 'reference-main-bases-edit' && form.status !== undefined"
            v-model="form.status"
            :active-text="getStatusText(form.status)"
            class="app-switch mt-auto"
          />
        </AppOverlay>

        <div
          v-if="route.name !== 'reference-main-bases-view'"
          class="flex items-center mt-6 justify-between"
        >
          <ElButton
            type="danger"
            size="large"
            :loading="deleteLoading"
            v-if="route.name === 'reference-main-bases-edit'"
            class="custom-danger-btn"
            @click="deleteFn"
          >
            Удалить
          </ElButton>


          <div class="flex items-center gap-x-4 ml-auto">
            <button
              @click="cancelFn"
              class="custom-cancel-btn flex items-center justify-center"
            >
              Отменить
            </button>

            <ElButton
              :loading
              @click="sendForm"
              type="primary"
              size="large"
              class="custom-apply-btn"
            >
              {{ route.params.id ? "Сохранить" : "Добавить" }}
            </ElButton>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <RouterLink
          v-if="route.name === 'reference-main-bases-view'"
          :to="{name: 'reference-main-bases-edit', params: {id: routeID}}"
          class="inline-flex items-center justify-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px] min-w-[260px]"
        >
          <img
            src="/icons/edit.svg"
            alt="edit icon"
            class="size-5"
          />
          Редактировать
        </RouterLink>
      </div>
    </div>
  </div>
</template>

