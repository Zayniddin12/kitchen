<script
    setup
    lang="ts"
>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {
  FoodFactoriesCreateFormType
} from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import { Name } from "@/utils/helper";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const settingsStore = useSettingsStore();

const form = reactive<FoodFactoriesCreateFormType>({
  name: new Name(),
  management_id: ""
});

const v$ = ref<ValidationType | null>(null);

const setValidation = (validation: ValidationType) => {
  v$.value = validation;
};

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
      to: { name: "reference-combine-nutrition" }
    },

    {
      label: "Комбинаты питания",
      to: { name: "reference-regional-directorates" }
    },
    {
      label: route?.meta?.breadcrumbItemTitle as string ?? "",
      isActionable: true
    }
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push({ name: "reference-combine-nutrition" });
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    router.push({ name: "reference-combine-nutrition" });
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

const loading = ref(false);

const sendForm = async () => {
  if (!(v$.value && await v$.value.validate())) return;

  loading.value = true;

  try {
    if (route.name === "reference-combine-nutrition-add") {
      await settingsStore.createFoodFactory(form);
    } else if (route.name === "reference-combine-nutrition-edit") {
      await settingsStore.updateFoodFactory(+route.params.id, form);
    }

    await router.push({ name: "reference-combine-nutrition" });
    ElNotification({
      title: "Успешно",
      message: "Успешно",
      type: "success"
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if(route.params.id){

  }
  settingsStore.GET_REGIONAL({ per_page: 500 });
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
            class="border border-[#E2E6F3] p-[24px] min-h-[60vh] flex flex-col gap-y-6 justify-between"
        >
          <AppForm
              :value="form"
              @validation="setValidation"
              class="grid grid-cols-2 gap-x-4"
          >
            <AppInput
                v-model="form.name.ru"
                prop="name.ru"
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
            />
            <AppInput
                v-model="form.name.uz"
                prop="name.uz"
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
            />
            <AppSelect
                v-model="form.management_id"
                :items="settingsStore.regional.managements"
                item-value="id"
                item-label="name"
                prop="management_id"
                trigger="change"
                label="Региональное управление"
                placeholder="Выберите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                required
            />
          </AppForm>
          <ElSwitch
              v-if="route.params.id && !route.query.type"
              active-text="Деактивация"
              class="app-switch"
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


          <div class="flex items-center gap-4">
            <button
                @click="cancelFn"
                class="custom-cancel-btn"
            >
              Отменить
            </button>

            <button
                type="submit"
                @click="sendForm"
                class="custom-apply-btn"
            >
              {{ route.params.id ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
            @click="router.push({name: 'reference-combine-nutrition-edit', params: {id: 1}})"
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

