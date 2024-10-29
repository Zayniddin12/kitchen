<script
    setup
    lang="ts"
>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import { setStatus } from "@/utils/helper";

const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();

interface TableData {
  id: number;
  name: string;
  type: string;
}

interface Name {
  uz: string;
  ru: string;
}

interface WareHouseType {
  id?: number;
  name: Name;
  address: string;
  code: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
}

const status = ref<boolean>(true);

const warehouseData = ref<WareHouseType>({
  name: {
    ru: "",
    uz: ""
  },
  address: "",
  code: "",
  status: "active"
});


const { setBreadCrumb } = useBreadcrumb();

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

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
      label: "Базы складов",
      to: { name: "reference-warehouse-bases" }
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true
    }
  ]);
};

onMounted(async () => {
  if (route.params.id) {
    const data = await settingsStore.GET_WAREHOUSE_BASES_ITEM(route.params.id as string | number);

    if (data && data.base) {
      warehouseData.value = data.base;
      status.value = data.base.status == "active";
    }
  }
});

watchEffect(() => {
  setBreadCrumbFn();
});

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "reference-warehouse-bases" });
  });
};

const deleteFn = () => {
  confirm.delete().then(async res => {
    await settingsStore.DELETE_WAREHOUSE_BASES(route.params.id as string);
    await router.push({ name: "reference-warehouse-bases" });
  });
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {

    try {

      if (route.params.id) {
        await settingsStore.UPDATE_WAREHOUSE_BASES({
          id: route.params.id as string | number,
          data: warehouseData.value
        });
      } else {
        await settingsStore.CRETE_WAREHOUSE_BASES(warehouseData.value);
      }
      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-warehouse-bases");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

// const switchChange = async (e): Promise<boolean> => {
//   try {
//     console.log(status.value);
//     // if (status.value) {
//     //   warehouseData.value.status = "inactive";
//     // } else {
//     //   warehouseData.value.status = "active";
//     // }
//     // const response = await confirm.show();
//
//     // return true;
//   } catch (error) {
//     return false;
//   }
// };

const switchChange2 = async () => {
  warehouseData.value.status = setStatus(status.value);
};

const isDisabled = computed<boolean>(() => {
  return route.name == "reference-warehouse-bases-view";
});

</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppForm
            :value="warehouseData"
            @validation="setValidation"
            class="mt-6"
        >
          <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
            <div class="flex items-center gap-4">
              <!--              {{ warehouseData }}-->
              <app-input
                  v-model="warehouseData.name.ru"
                  label="Наименование (RU)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="name.ru"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="warehouseData.name.uz"
                  label="Наименование (UZ)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="name.uz"
                  :disabled="isDisabled"
              />
            </div>

            <div class="flex items-center gap-4">
              <app-input
                  v-model="warehouseData.address"
                  label="Юр. адрес базы"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="address"
                  :disabled="isDisabled"
              />
              <app-input
                  v-model="warehouseData.code"
                  label="Уникальный код базы"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="code"
                  :disabled="isDisabled"
              />
            </div>
            <ElSwitch
                v-model="status"
                v-if="route.params.id && !route.query.type"
                :active-text="status ? 'Активация' : 'Деактивация'"
                class="app-switch mt-auto"
                @change="switchChange2"
                :disabled="isDisabled"
            />
          </div>
        </AppForm>
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

            <button
                class="custom-apply-btn"
                @click="handleSubmit"
            >
              {{ $route.params.id ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
            @click="router.push({name: 'reference-warehouse-bases-edit', params: {id: 1}})"
            v-if="route.query.type == 'view'"
            class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <li
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
          ></li>
          Редактировать
        </button>
      </div>
    </div>
  </div>
</template>

