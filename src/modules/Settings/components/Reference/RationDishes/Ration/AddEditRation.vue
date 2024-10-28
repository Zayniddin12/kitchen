<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {Name} from "@/utils/helper";
import {onMounted, ref, watch} from "vue";
import {useSettingsStore} from "@/modules/Settings/store";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {ElNotification} from "element-plus";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import {ValidationType} from "@/components/ui/form/app-form/app-form.type";

interface DataValue {
  kitchen_id: string;
  start_time: string;
  end_time: string;
  duration_in_days: string;
  compositions: Repeater;
}

interface Repeater {
  quantity: string;
  unit_id: number;
  compositionable_id: number;
  compositionable_type: number;
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


const value = ref<boolean>(true);
const dataValue = ref<DataValue>({
  name: new Name(),
  kitchen_id: '',
  start_time: '',
  end_time: '',
  duration_in_days: '',
  compositions: [
    {
      quantity: '',
      unit_id: '',
      compositionable_id: '',
      compositionable_type: '',
    }
  ]
})


onMounted(async () => {
  let limit = {
    per_page: 100
  }
  await store.GET_KITCHEN_TYPE(limit)
  await store.GET_MEALS(limit)
  await store.GET_UNITS()
  await store.GET_TYPE_PRODUCT()
  await store.GET_VID_PRODUCT(limit)
})


const repeaterAgain = () => {
  dataValue.value.compositions.push({
    quantity: '',
    unit_id: '',
    compositionable_id: '',
    compositionable_type: '',
  });
};

const handleDelete = (index: number) => {
  if (dataValue.value.compositions.length > 1) {
    confirm.delete().then(() => {
      dataValue.value.compositions.splice(index, 1);
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
      to: {name: "reference"},
    },
    {
      label: "Рационы и блюда",
      to: {name: "reference"},
    },
    {
      label: "Рационы",
      to: {name: "reference-ration"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push('/reference-ration');
  });
};

const deleteFn = () => {
  confirm.delete().then(response => {
    router.push({name: "reference-ration"});
  });
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      if (route.params.id) {
        await store.UPDATE_RATION({
          id: route.params.id,
          data: dataValue.value
        })
      } else {
        await store.CRETE_RATION(dataValue.value)
      }
      ElNotification({title: 'Success', type: 'success'});
      await router.push('/reference-ration');
    } catch (e) {
      ElNotification({title: e, type: 'error'});
    }
  }
}

// const switchChange = async (): Promise<boolean> => {
//   try {
//     const response = await confirm.show();
//     return true;
//   } catch (error) {
//     return false;
//   }
// };
watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

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
                  label="Наименование (RU)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="name.ru"
              />

              <app-input
                  v-model="dataValue.name.uz"
                  label="Наименование (UZ)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="name.uz"
              />

              <app-input
                  label="Уникальный номер рациона"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  disabled
              />
            </div>

            <div class="grid grid-cols-3 gap-5">
              <app-select
                  v-model="dataValue.kitchen_id"
                  label="Тип кухни"
                  placeholder="Выберите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="kitchen_id"
                  itemValue="id"
                  itemLabel="name"
                  :items="store.kitchenTypes.kitchen_types"
              />

              <div class="grid grid-cols-2">
                <app-time-picker
                    v-model="dataValue.start_time"
                    type="time"
                    label="Время начало"
                    class="w-full"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    required
                    prop="start_time"
                />

                <app-time-picker
                    v-model="dataValue.end_time"
                    label="Время окончания"
                    class="w-full ml-[8px]"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    required
                    prop="end_time"
                />
              </div>

              <app-input
                  v-model="dataValue.duration_in_days"
                  label="Длительность"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  required
                  prop="duration_in_days"
              />
            </div>
          </AppForm>

          <template v-if="route.name === 'reference-ration-view-id'">
            <el-table
                :data="[]"
                stripe
                class="custom-element-table mt-[40px]"
            >
              <el-table-column
                  prop="id"
                  label="Состав"
              />
              <el-table-column
                  prop="name"
                  label="Количество"
              />
              <el-table-column
                  prop="unique"
                  label="Ед. измерения"
              />
            </el-table>
          </template>

          <template v-else>
            <h1 class="text-[#000D24] text-[18px] font-medium mb-[12px]">Состав рациона</h1>

            <div class=" pb-3 bg-[#F8F9FC] rounded-[16px] px-[12px]"
                 v-for="(item, index) in dataValue.compositions"
                 :key="index as any"
            >
              <div class="grid grid-cols-5 gap-5 border-b  py-[16px]">
                <app-select
                    v-model="item.meal"
                    label="Блюдо"
                    placeholder="Выберите"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    itemValue="id"
                    itemLabel="name"
                    :items="store.meals.meals"
                />
                <app-select
                    v-model="item.compositionable_type"
                    label="Тип продукта"
                    placeholder="Выберите"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    itemValue="id"
                    itemLabel="name"
                    :items="store.typeProduct.product_categories"
                />

                <app-select
                    v-model="item.compositionable_id"
                    label="Вид продукта"
                    placeholder="Выберите"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                    itemValue="id"
                    itemLabel="name"
                    :items="store.vidProduct.product_types"
                />
                <app-input
                    v-model="item.quantity"
                    label="Количество"
                    placeholder="0.0"
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                />

                <div class="flex items-center">
                  <app-select
                      v-model="item.unit_id"
                      label="Ед. измерения"
                      placeholder="Введите"
                      label-class="text-[#A8AAAE] font-medium text-[12px]"
                      itemValue="id"
                      itemLabel="name"
                      :items="store.units.units"
                  />

                  <button
                      class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[60px] ml-[16px] mt-2"
                      @click="handleDelete(index as any)"
                  >
                    <img src="@/assets/images/icons/delete.svg" alt="delete"/>
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
              Добавить еще
            </button>

            <el-switch
                v-if="route.name === 'reference-ration-edit-id'"
                class="mt-[120px]"
                v-model="value"
                active-text="Деактивация"
            />
            <!--            :before-change="switchChange"-->
          </template>
        </div>

        <div
            class="mt-[24px] flex items-center justify-between"
            v-if="route.name === 'reference-ration-edit-id' || route.name === 'reference-ration-create'"
        >
          <button
              class="custom-danger-btn"
              v-if="route.name === 'reference-ration-edit-id'"
              @click="deleteFn"
          >
            Удалить
          </button>

          <div class="flex items-center gap-4 ml-auto">
            <button
                class="custom-cancel-btn"
                @click="cancelFn"
            >
              Отменить
            </button>
            <button class="custom-apply-btn" @click="handleSubmit">
              {{ route.name === "reference-ration-edit-id" ? "Сохранить" : "Добавить" }}
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
        Редактировать
      </button>
    </div>
  </div>
</template>
