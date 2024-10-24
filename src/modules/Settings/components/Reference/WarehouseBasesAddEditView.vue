<script
  setup
  lang="ts"
>
import { reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";

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
}

const warehouseData = reactive<WareHouseType>({
  name: {
    ru: "",
    uz: "",
  },
  address: "",
  code: "",
});


const { setBreadCrumb } = useBreadcrumb();

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
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

watchEffect(() => {
  setBreadCrumbFn();
});

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "reference-warehouse-bases" });
  });
};

const deleteFn = () => {
  confirm.delete().then(response => {
    router.push({ name: "reference-warehouse-bases" });
  });
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {

    try {

      if (route.params.id) {
        await settingsStore.UPDATE_WAREHOUSE_BASES({
          id: route.params.id as string | number,
          data: warehouseData,
        });
      } else {
        await settingsStore.CRETE_WAREHOUSE_BASES(warehouseData);
      }
      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-warehouse-bases");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

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
              <app-input
                v-model="warehouseData.name.ru"
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
              />

              <app-input
                v-model="warehouseData.name.uz"
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
              />
            </div>

            <div class="flex items-center gap-4">
              <app-input
                v-model="warehouseData.address"
                label="Юр. адрес базы"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
              />
              <app-input
                v-model="warehouseData.code"
                label="Уникальный код базы"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
              />
            </div>
            <ElSwitch
              v-if="route.params.id && !route.query.type"
              active-text="Деактивация"
              class="app-switch mt-auto"
              :before-change="switchChange"
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

            <button class="custom-apply-btn" @click="handleSubmit">
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

