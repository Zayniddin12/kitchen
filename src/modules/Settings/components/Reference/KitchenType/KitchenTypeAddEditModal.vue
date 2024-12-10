<script
  setup
  lang="ts"
>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import type { StatusType } from "@/types/common.type";

interface Name {
  uz: string;
  ru: string;
}

interface DataValue {
  name: Name;
  status: boolean | StatusType;
  is_paid: number | string | boolean;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { setBreadCrumb } = useBreadcrumb();

const dataValue = ref<DataValue>({
  name: {
    uz: "",
    ru: "",
  },
  is_paid: false,
  status: "active",
});
const status = ref<boolean>(true);
const loading = ref<boolean>(false);

onMounted(async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      const kitchen = await store.GET_KITCHEN_TYPE_DETAIL(+route.params.id);
      if (kitchen && kitchen.kitchen_type) {
        dataValue.value = kitchen.kitchen_type;
        dataValue.value.is_paid = dataValue.value.is_paid == 1;

        status.value = kitchen.kitchen_type.status == "active";
      }
    } catch (e) {
      loading.value = false;
    }
    loading.value = false;
  }
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
      label: "Типы кухни",
      to: { name: "reference-kitchen-type" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push("/reference-kitchen-type");
  });
};

const deleteFn = () => {
  confirm.delete().then((response: any) => {
    store.DELETE_KITCHEN_TYPE(route.params.id);
    router.push("/reference-kitchen-type");
    ElNotification({ title: "Success", type: "success" });
  });
};

// const switchChange = async (): Promise<boolean> => {
//   try {
//     const response = await confirm.show();
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      dataValue.value.is_paid = dataValue.value.is_paid ? 1 : 0;
      const payload = dataValue.value as DataValue;

      if (route.params.id) {
        await store.UPDATE_KITCHEN_TYPE({
          id: route.params.id as string | number,
          status: dataValue.value.status,
          data: payload,
        });
      } else {
        await store.CREATE_KITCHEN_TYPE(payload);
      }
      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-kitchen-type");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

const changeStatus = () => {
  if (status.value) {
    dataValue.value.status = "active";
  } else {
    dataValue.value.status = "inactive";
  }
};


const isDisabled = computed(() => {
  return route.name === "reference-kitchen-type-view";
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });
</script>

<template>
  <div>
    <section>
      <h1 class="m-0 font-semibold text-[32px] leading-[48px] mb-[24px]">{{ route.meta.title }}</h1>

      <div class="flex gap-6">
        <div class="w-[70%]">
          <AppForm
            :value="dataValue"
            @validation="setValidation"
          >
            <AppOverlay
              :loading
              :rounded="16"
              parent-class-name="border border-[#E2E6F3] rounded-2xl p-[24px] h-[65vh] flex flex-col"
            >
              <div class="flex items-center gap-4">
                <app-input
                  v-model="dataValue.name.ru"
                  label="Наименование (RU)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  :disabled="isDisabled"
                  required
                  prop="name.ru"
                />

                <app-input
                  v-model="dataValue.name.uz"
                  label="Наименование (UZ)"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  :disabled="isDisabled"
                  required
                  prop="name.uz"
                />
              </div>
              <!--              {{ dataValue }}-->
              <template v-if="route.name === 'reference-kitchen-type-view'">
                <span class="text-base text-dark">{{ dataValue.is_paid ? "Продажи" : "Бесплатная кухня" }}</span>
              </template>
              <ElSwitch
                v-else
                v-model="dataValue.is_paid"
                :active-text="dataValue.is_paid ? 'Продажи' : 'Бесплатная кухня'"
                class="app-switch"
                @change="changeStatus"
              />
              <br/>
              <ElSwitch
                v-if="route.params.id && !route.query.type"
                active-text="Деактивация"
                v-model="status"
                :active-text="dataValue.is_active ? 'Активация' : 'Деактивация'"
                class="app-switch mt-2"
                @change="changeStatus"
              />
              <!--            :before-change="switchChange"-->
            </AppOverlay>
          </AppForm>

          <div
            v-if="!route.query.type"
            class="flex items-center mt-[24px] "
            :class="!route.params.id ? 'justify-end' : 'justify-between'"
          >
            <button
              @click="deleteFn"
              v-if="route.params.id"
              class="custom-danger-btn"
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
            @click="router.push({name: 'reference-kitchen-type-edit', params: {id: route.params.id}})"
            v-if="route.query.type == 'view'"
            class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
          >
            <img
              src="@/assets/images/icons/edit.svg"
              alt="#"
            />
            Редактировать
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

