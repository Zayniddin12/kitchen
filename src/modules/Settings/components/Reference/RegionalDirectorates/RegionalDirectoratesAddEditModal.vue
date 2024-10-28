<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import {ValidationType} from "@/components/ui/form/app-form/app-form.type";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

interface Name {
  ru: string;
  uz: string;
}

interface DataValue {
  name: Name,
  responsible_position: string | number,
  status: boolean | string
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
const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
      isActionable: false,
    },
    {
      label: "Справочники",
      isActionable: false,
      to: {name: "reference"},
    },

    {
      label: "Управ, комбинаты и склады",
      isActionable: false,
      to: {name: "reference"},
    },

    {
      label: "Региональные управления",
      isActionable: false,
      to: {name: "reference-regional-directorates"},
    },
    {
      label: activeBreadCrumbItemTitle.value,
      isActionable: true,
    },
  ]);
};

const dataValue = ref<DataValue>({
  name: {
    ru: '',
    uz: ''
  },
  responsible_position: '',
  status: 'active'
})
const loading = ref<boolean>(false)
const status = ref<boolean>(true)


onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    try {
      const managements = await store.GET_REGIONAL_DETAIL(route.params.id as number | string)
      if (managements && managements.data && managements.data.management) {
        dataValue.value = managements.data.management

        status.value = managements.data.management.status === 'active'
      }
    } catch (e) {
      loading.value = false
    }
    loading.value = false
  }
})


const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push({name: "reference-regional-directorates"});
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_REGIONAL(route.params.id as number | string)
    router.push('/reference-regional-directorates');
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


const changeStatus = () => {
  if (status.value) {
    dataValue.value.status = 'active'
  } else {
    dataValue.value.status = 'inactive'
  }
}

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      const payload = dataValue.value as DataValue

      if (route.params.id) {
        await store.UPDATE_REGIONAL({
          id: route.params.id as string | number,
          data: {
            name: payload.name,
            status: payload.status,
            responsible_position: payload.responsible_position,
          },
        })
      } else {
        await store.CREATE_REGIONAL(payload)
      }

      ElNotification({title: 'Success', type: 'success'});
      await router.push('/reference-regional-directorates')
    } catch (e) {
      ElNotification({title: 'Error', type: 'error'});
    }
  }
}

const activeBreadCrumbItemTitle = computed<string>(() => {
  switch (route.name) {
    case "reference-regional-directorates-add":
      return "Добавить";
    case "reference-regional-directorates-edit":
      return "Редактировать";
    case "reference-regional-directorates-view":
      return "Просмотр";
    default:
      return "";
  }
});

const isDisabled = computed(() => {
  return route.name === 'reference-regional-directorates-view'
})

watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});
</script>

<template>
  <div>
    <AppOverlay
        :loading="loading"
    >
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>
    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppForm
            :value="dataValue"
            @validation="setValidation"
        >
          <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
            <div class="flex items-center gap-4">
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
            </div>

            <div class="flex items-center gap-4">
              <app-input
                  v-model="dataValue.responsible_position"
                  label="Подчинение"
                  placeholder="Начальник управления"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-[50%]"
                  disabled
                  :disabled="isDisabled"
              />
<!--              required-->
<!--              prop="responsible_position"-->
            </div>

            <ElSwitch
                v-model="status"
                v-if="route.params.id && !route.query.type"
                @change="changeStatus"
                :active-text="status ? 'Активация' : 'Деактивация'"
                class="app-switch mt-auto"
            />
<!--            :before-change="switchChange"-->
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
            @click="router.push({name: 'reference-regional-directorates-edit', params: {id: 1}})"
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
    </AppOverlay>
  </div>
</template>

