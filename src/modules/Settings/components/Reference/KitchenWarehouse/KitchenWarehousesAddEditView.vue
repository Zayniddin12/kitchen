<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Name} from "@/utils/helper";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import {ValidationType} from "@/components/ui/form/app-form/app-form.type";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

interface DataValue {
  base_id: string;
  capacity: string;
  kitchen_capacity: string;
  kitchen_type_id: string;
  measure_id: string;
  status: string;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const store = useSettingsStore()
const route = useRoute();
const router = useRouter();
const {confirm} = useConfirm();
const {setBreadCrumb} = useBreadcrumb();

const loading = ref<boolean>(false)
const dataValue = ref<DataValue>({
  name: new Name(),
  base_id: "",
  capacity: '',
  kitchen_capacity: '',
  kitchen_type_id: '',
  measure_id: '',
  status: 'active'
})

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: {name: "reference"},
    },

    {
      label: "Управ, комбинаты и склады",
      to: {name: "reference"},
    },

    {
      label: "Склады кухни",
      to: {name: "reference-kitchen-warehouse"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

onMounted(async () => {
  await store.GET_WAREHOUSE_BASES_LIST({per_page: 100})
  await store.GET_KITCHEN_TYPE()
  if (route.params.id) {
    await getKitchenWarehouseDetail(route.params.id);
  }
})

async function getKitchenWarehouseDetail(id) {
  loading.value = true;
  try {
    const wr = await store.GET_KITCHEN_WAREHOUSE_DETAIL(id);
    if (wr && wr.kitchen_warehouse) {
      dataValue.value = wr.kitchen_warehouse;

      const base = store.wareHouseList.bases.find(e => e.id === dataValue.value.base_id).name;
      const kitchen = store.kitchenTypes.kitchen_types.find(e => e.id === dataValue.value.kitchen_type_id).name;
      if (base) {
        dataValue.value.base_id = base
      }
      if (kitchen) {
        dataValue.value.kitchen_type_id = kitchen
      }
    }
  } catch (e) {
    ElNotification({title: e, type: 'error'});
  } finally {
    loading.value = false;
  }
}

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      if (route.params.id) {
        await store.UPDATE_KITCHEN_WAREHOUSE({
          id: route.params.id as string | number,
          data: dataValue.value as DataValue,
        })
      } else {
        await store.CREATE_KITCHEN_WAREHOUSE(dataValue.value as DataValue);
      }
      ElNotification({title: 'Success', type: 'success'});
      await router.push('/reference-kitchen-warehouse')
    } catch (e) {
      ElNotification({title: 'Error', type: 'error'});
    }
  }
}

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push('/reference-kitchen-warehouse');
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_KITCHEN_WAREHOUSE(route.params.id)
    router.push('/reference-kitchen-warehouse');
    ElNotification({title: 'Success', type: 'success'});
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
  return route.name === 'reference-kitchen-warehouse-view'
})

watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});
</script>

<template>
  <AppOverlay :loading="loading">
    <h1 class="m-0 font-semibold text-[32px] leading-[48px] mb-[24px]">{{ route.meta.title }}</h1>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] min-h-[65vh] flex flex-col">
          <AppForm
              :value="dataValue"
              @validation="setValidation"
              class="mt-6"
          >
            <div class="grid grid-cols-3 gap-4">
              <app-input
                  v-model="dataValue.name.ru"
                  label="Наименование (RU)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="name.ru"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.name.uz"
                  label="Наименование (UZ)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="name.uz"
                  :disabled="isDisabled"
              />

              <app-select
                  v-model="dataValue.base_id"
                  label="База складов"
                  placeholder="Введите"
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
                  label="Вместимость склада"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="capacity"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.measure_id"
                  label="Единица измерения"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  type="number"
                  prop="measure_id"
                  :disabled="isDisabled"
              />

              <app-select
                  v-model="dataValue.kitchen_type_id"
                  label="Тип кухни"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="kitchen_type_id"
                  item-value="id"
                  item-label="name"
                  :items="store.kitchenTypes.kitchen_types"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.kitchen_capacity"
                  label="Вместимость кухни"
                  placeholder="Введите"
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
              active-text="Деактивация"
              class="app-switch mt-auto"
              :before-change="switchChange"
          />
        </div>

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

          <div class="flex items-center gap-4">
            <button
                @click="cancelFn"
                class="custom-cancel-btn"
            >
              Отменить
            </button>

            <button class="custom-apply-btn" @click="handleSubmit">
              {{ $route.params.id ? "Сохранить" : "Добавить" }}
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
          <img src="@/assets/images/icons/edit.svg" alt="#">
          Редактировать
        </button>
      </div>
    </div>
  </AppOverlay>
</template>

