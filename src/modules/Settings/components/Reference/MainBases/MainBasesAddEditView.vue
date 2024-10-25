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
import { deepEqual, getStatus, Name, setStatus } from "@/utils/helper";
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
  status: false,
  product_ids: []
});

const oldForm = ref<null | BaseWarehouseDataType>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

const tableData = ref([
  {
    id: 1,
    name: "Овощи"
  },
  {
    id: 2,
    name: "Фрукты"
  }
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки"
    },
    {
      label: "Справочники",
      to: { name: "reference" }
    },

    {
      label: "Управ, комбинаты и склады",
      to: { name: "reference" }
    },

    {
      label: "Склады базы",
      to: { name: "reference-main-bases" }
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true
    }
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
    await settingsStore.deleteFoodFactory(routeID.value as number);
    commonStore.successToast({ name: "reference-main-bases" });
  }).finally(() => {
    deleteLoading.value = false;
  });
};

const setForm = async () => {
  await settingsStore.showFoodFactory(routeID.value as number);

  if (!settingsStore.foodFactory) return;
  form.name = settingsStore.foodFactory.name;
  form.measure_id = settingsStore.foodFactory.management.id;
  form.status = getStatus(settingsStore.foodFactory.status);
};

onMounted(async () => {
  settingsStore.GET_UNITS();
  settingsStore.GET_TYPE_PRODUCT();

  if (routeID.value) await setForm();

  oldForm.value = JSON.parse(JSON.stringify(form));
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppOverlay
            :rounded="24"
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
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-xs"
                required
            />

            <app-input
                v-model="form.name.uz"
                prop="name.uz"
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-xs"
                required
            />

            <app-select
                v-model="form.base_id"
                prop="base_id"
                label="База складов"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-xs"
                required
            />
            <app-input
                v-model="form.capacity"
                prop="capacity"
                label="Вместимость склада"
                placeholder="Выберите"
                label-class="text-[#A8AAAE] font-medium text-xs"
                required
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
            />
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
            />
          </AppForm>

          <div v-if="route.name === 'reference-main-bases-view'">
            <el-table
                :data="tableData"
                class="custom-element-table"
                stripe
            >
              <el-table-column
                  prop="id"
                  label="№"
                  width="100"
              />
              <el-table-column
                  prop="name"
                  label="Наименование базы"
              />

            </el-table>
          </div>


          <ElSwitch
              v-if="route.name === 'reference-main-bases-edit'"
              active-text="Деактивация"
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
              v-if="route.params.id"
              class="custom-danger-btn"
              @click="deleteFn"
          >
            Удалить
          </button>


          <div class="flex items-center gap-x-4">
            <button
                @click="cancelFn"
                class="custom-cancel-btn flex items-center justify-center"
            >
              Отменить
            </button>

            <ElButton
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
        <button
            @click="router.push({name: 'reference-main-bases-edit', params: {id: 1}})"
            v-if="route.query.type == 'view'"
            class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <span
              :style="{
                  maskImage: 'url(/icons/edit.svg)',
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          ></span>
          Редактировать
        </button>
      </div>
    </div>
  </div>
</template>

