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

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const settingsStore = useSettingsStore();
const commonStore = useCommonStore();

const routeID = computed(() => {
  return route.params?.id ? +route.params.id : null;
});

const form = reactive<BaseWarehouseDataType>({
  name: new Name(),
  base_id: null,
  capacity: null,
  measure_id: null,
  status: false
});

const oldForm = ref<null | BaseWarehouseDataType>(null);

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};


const input1 = ref<string>("");
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
  if (oldForm.value && !deepEqual(form, oldForm.value)) await confirm.cancel().then(response => {
    if (response === "save") {
      sendForm();
      return;
    }
  });

  router.push({ name: "reference-main-bases" });
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
      await settingsStore.createFoodFactory(form);
    } else if (route.name === "reference-main-bases-edit") {
      const newForm = { ...form };
      newForm.status = setStatus(form.status);
      await settingsStore.updateFoodFactory(routeID.value, newForm);
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
  confirm.delete().then(async () => {
    deleteLoading.value = true;
    await settingsStore.deleteFoodFactory(+routeID.value);
    commonStore.successToast({ name: "reference-main-bases" });
  }).finally(() => {
    deleteLoading.value = false;
  });
};

const setForm = async () => {
  await settingsStore.showFoodFactory(routeID.value);

  if (!settingsStore.foodFactory) return;
  form.name = settingsStore.foodFactory.name;
  form.management_id = settingsStore.foodFactory.management.id;
  form.status = getStatus(settingsStore.foodFactory.status);
};

onMounted(async () => {
  settingsStore.GET_REGIONAL({ per_page: 100 });

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
        <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
          <div class="flex items-center gap-4">
            <app-input
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />

            <app-input
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />

            <app-select
                label="База складов"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />
          </div>

          <div class="flex items-center gap-4">

            <app-input
                label="Вместимость склада"
                placeholder="Выберите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />

            <app-input
                label="Единица измерения"
                placeholder="тонна"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />

            <app-select
                v-if="!route.query.type"
                label="Типы продуктов хранения"
                placeholder="Мясные"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
            />
            <div
                v-if="route.query.type"
                class="w-full"
            ></div>

          </div>

          <div v-if="route.query.type == 'view'">
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

            <button class="custom-apply-btn">
              {{ $route.params.id ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
            @click="router.push({name: 'reference-main-bases-edit', params: {id: 1}})"
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

