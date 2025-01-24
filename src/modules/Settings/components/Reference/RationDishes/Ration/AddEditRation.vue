<script
  setup
  lang="ts"
>
import { useRoute, useRouter } from "vue-router";
import { Name } from "@/utils/helper";
import { computed, onMounted, ref, watch } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

interface DataValue {
  kitchen_type_ids: string;
  start_time: string;
  end_time: string;
  duration_in_days: string;
  number: string | number,
}

interface Repeater {
  meal_id: null | string;
  typeProduct: null | string;
  product_type_id: null | string;
  quantity: null | string;
  unit_id: null | string;
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


const value = ref<boolean>(true);
const dataValue = ref<DataValue[]>({
  name: new Name(),
  kitchen_type_ids: [],
  start_time: "",
  end_time: "",
  duration_in_days: "",
  number: "",
});
const compositions = ref<Repeater[]>([
  {
    meal_id: null,
    typeProduct: null,
    product_type_id: null,
    parent_id: null,
    quantity: null,
    unit_id: null,
  },
]);
const loading = ref<boolean>(false);
const status = ref<boolean>(false);


onMounted(async () => {
  let limit = {
    per_page: 100,
  };
  loading.value = true;
  try {
    await store.GET_KITCHEN_TYPE(limit);
    await store.GET_MEALS(limit);
    await store.GET_TYPE_PRODUCT();
    if (route.params.id) {
      const ration = await store.GET_SHOW_ITEM(route.params.id);
      if (ration && ration.ration) {
        dataValue.value = ration.ration;
        status.value = ration.ration.is_active;

        let product_types = ration.ration.product_types || [];
        let meals = ration.ration.meals || [];

        compositions.value = [
          ...meals.map(meal => ({
            meal_id: meal.id,
            typeProduct: null,
            product_type_id: null,
            quantity: meal.quantity,
            unit_id: meal.unit_id,
          })),
          ...product_types.map(product => ({
            meal_id: null,
            typeProduct: product.parent_id,
            product_type_id: product.id,
            parent_id: product.parent_id,
            quantity: product.quantity,
            unit_id: product.unit_id,
          })),
        ];


        let arr = product_types;
        for (let i = 0; i < arr.length; i++) {
          const data1 = await store.GET_MEALS_VID_PRO({ parent_id: arr[i].parent_id });
          if (data1 && data1.product_types) {
            store.dynamicVid.product_types[i] = data1.product_types;
          }
        }
      }
    }
  } catch (e) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
});


const repeaterAgain = () => {
  compositions.value.push({});
};

const handleDelete = (index: number) => {
  if (compositions.value.length > 1) {
    confirm.delete().then(() => {
      compositions.value.splice(index, 1);
    });
  }
};

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

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push("/reference-ration");
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_RATION(route.params.id);
    router.push({ name: "reference-ration" });
    ElNotification({ title: "Success", type: "success" });
  });
};

const handleSubmit = async () => {
  if (!v$.value || !(await v$.value.validate())) return;

  const rationData = {
    ...dataValue.value,
    is_active: +status.value,
    ...(route.params.id && { _method: "PUT" }),
  };

  try {
    let arr = compositions.value;
    let result = {
      meals: [],
      product_types: [],
    };

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      if (item.meal_id) {
        result.meals.push({
          id: item.meal_id,
          quantity: item.quantity,
          unit_id: item.unit_id,
        });
      } else {
        result.product_types.push({
          id: item.product_type_id,
          quantity: item.quantity,
          unit_id: item.unit_id,
        });
      }
    }

    if (route.params.id) {
      await store.UPDATE_RATION({
        id: route.params.id,
        data: {
          ...rationData,
          ...result,
        },
      });
    } else {
      await store.CRETE_RATION({
        ...result,
        ...dataValue.value,
      });
    }
    ElNotification({ title: "Success", type: "success" });
    await router.push("/reference-ration");
  } catch (error) {
    ElNotification({ title: error.message || "An error occurred", type: "error" });
  }
};


const changeInput = async (event: any, type: string, index: number) => {
  const data = await store.GET_MEALS_VID_PRO({ parent_id: event });
  if (data && data.product_types) {
    store.dynamicVid.product_types[index] = data.product_types;
  }
};
const getUnitId = (id: number) => {
  if (id) {
    return store.units.units.find((e) => e.id === id).name;
  }
};
const getTypeProduct = (id: number) => {
  if (id) {
    return store.typeProduct.product_categories.find((e) => e.id === id).name;
  }
};

const isDisabled = computed(() => {
  return route.name === "reference-ration-view-id";
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });
</script>

<template>
  <AppOverlay :loading="loading">
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="w-[70%]">
        <div class="border rounded-[24px] p-[24px]">
          <AppForm
            :value="dataValue"
            @validation="setValidation"
          >
            <div class="grid grid-cols-3 gap-5">
              <app-input
                v-model="dataValue.name.ru"
                :label="$t('Наименование (Рус)')"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                prop="name.ru"
                :disabled="isDisabled"
              />
              <app-input
                v-model="dataValue.name.uz"
                :label="$t('Наименование (Ўзб)')"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                prop="name.uz"
                :disabled="isDisabled"
              />
              <app-input
                v-model="dataValue.number"
                :label="$t('Уникальный номер рациона')"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                disabled
              />
            </div>

            <div class="grid grid-cols-3 gap-5">
              <app-select
                v-model="dataValue.kitchen_type_ids"
                :label="$t('Тип кухни')"
                multiple
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                prop="kitchen_type_ids"
                itemValue="id"
                itemLabel="name"
                :items="store.kitchenTypes.kitchen_types"
                :disabled="isDisabled"
              />
              <div class="grid grid-cols-2">
                <app-time-picker
                  v-model="dataValue.start_time"
                  type="time"
                  :label="$t('common.timeToStart')"
                  class="w-full"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="start_time"
                  :disabled="isDisabled"
                />
                <app-time-picker
                  v-model="dataValue.end_time"
                  :label="$t('common.endToTime')"
                  class="w-full ml-[8px]"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="end_time"
                  :disabled="isDisabled"
                />
              </div>

              <app-select
                v-model="dataValue.duration_in_days"
                :label="$t('Длительность')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
                prop="duration_in_days"
                itemValue="value"
                itemLabel="name"
                :items="[{name: '7', value: 7}, {name: '10', value: 10}]"
              />
            </div>
          </AppForm>

          <template v-if="route.name === 'reference-ration-view-id'">
            <el-table
              :data="compositions"
              stripe
              class="custom-element-table mt-[40px]"
              :empty-text="$t('Нет доступных данных')"
            >
              <el-table-column
                prop="typeProduct"
                :label="$t('common.compound')"
              >
                <template #default="scope">
                  {{ scope.row.typeProduct ? getTypeProduct(scope.row.typeProduct) : "-" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                :label="$t('common.quantity')"
              />
              <el-table-column
                prop="unit_id"
                :label="$t('common.measurement')"
              >
                <template #default="scope">
                  {{ scope.row.unit_id ? getUnitId(scope.row.unit_id) : "-" }}
                </template>
              </el-table-column>
            </el-table>
          </template>

          <template v-else>
            <h1 class="text-[#000D24] text-[18px] font-medium mb-[12px]">{{$t('kitchen.compoundRation')}}</h1>

            <div
              class=" pb-3 bg-[#F8F9FC] rounded-[16px] px-[12px]"
              v-for="(item, index) in compositions"
              :key="index as any"
            >
              <div class="grid grid-cols-5 gap-5 border-b  py-[16px]">
                <app-select
                  v-model="item.meal_id"
                  :label="$t('Блюдо')"
                  :placeholder="$t('form.select')"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  clearable
                  :disabled="item.typeProduct || isDisabled"
                  itemValue="id"
                  itemLabel="name"
                  :items="store.meals.meals"

                />
                <app-select
                  v-model="item.typeProduct"
                  :label="$t('product.type')"
                  :placeholder="$t('form.select')"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  clearable
                  :disabled="item.meal_id || isDisabled"
                  itemValue="id"
                  itemLabel="name"
                  :items="store.typeProduct.product_categories"
                  @change="changeInput($event, 'product_type', index)"
                />
                <app-select
                  v-model="item.product_type_id"
                  :label="$t('product.view')"
                  :placeholder="$t('form.select')"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  :disabled="item.meal_id || isDisabled"
                  itemValue="id"
                  itemLabel="name"
                  :items="store.dynamicVid.product_types[index]"
                  @change="value => store.GET_UNITS({product_type_id: value})"
                />
                <app-input
                  v-model="item.quantity"
                  :label="$t('common.quantity')"
                  placeholder="0.0"
                  :disabled="isDisabled"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                />
                <div class="flex items-center w-full">
                  <app-select
                    v-model="item.unit_id"
                    :label="$t('common.measurement')"
                    :placeholder="$t('form.select')"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    class="w-full"
                    itemValue="id"
                    itemLabel="name"
                    :disabled="isDisabled || !item.product_type_id"
                    :items="store.unitsData.get(item.product_type_id) ?? []"
                  />
                  <button
                    class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[60px] ml-[16px] mt-2"
                    @click="handleDelete(index as any)"
                  >
                    <img
                      src="@/assets/images/icons/delete.svg"
                      alt="delete"
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[35px]"
              @click="repeaterAgain"
            >
              <img
                src="@/assets/images/icons/plus2.svg"
                class="mr-[4px]"
                alt="plus"
              />
              {{$t('method.addMore')}}
            </button>

            <el-switch
              v-if="route.name === 'reference-ration-edit-id'"
              v-model="status"
              class="mt-[120px]"
              :active-text="status ? $t('status.activation') : $t('status.deactivation')"
            />
          </template>
        </div>

        <div
          class="mt-[24px] flex items-center justify-between"
          v-if="route.name === 'reference-ration-edit-id' || route.name === 'reference-ration-create'"
        >
          <button
            v-if="$can('delete', 'Button')"
            class="custom-danger-btn"
            v-show="route.name === 'reference-ration-edit-id'"
            @click="deleteFn"
          >
            {{$t('method.delete')}}
          </button>

          <div class="flex items-center gap-4 ml-auto">
            <button
              class="custom-cancel-btn"
              @click="cancelFn"
            >
              {{$t('method.cancel')}}
            </button>
            <button
              class="custom-apply-btn"
              @click="handleSubmit"
            >
              {{ route.name === "reference-ration-edit-id" ? $t('method.save') : $t('method.add') }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="custom-light-btn flex items-center ml-[14px]"
        v-if="route.name === 'reference-ration-view-id'"
        @click="router.push(`/reference-ration-edit/${route.params.id}`)"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          class="mr-[12px]"
          alt="edit"
        />
        {{$t('method.edit')}}
      </button>
    </div>
  </AppOverlay>
</template>
