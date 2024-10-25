<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import {ValidationType} from "@/components/ui/form/app-form/app-form.type";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

interface DataValue {
  name?: string;
  address?: string;
  oked?: string;
  tin?: string;
  license?: string;
  sertificate?: string;
  sert_end_date?: string;
  director?: string;
  phone?: string;
  status?: string;
}

const store = useSettingsStore()
const route = useRoute();
const router = useRouter();
const {confirm} = useConfirm();
const {setBreadCrumb} = useBreadcrumb();
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
      label: "Поставщики и организации",
      to: {name: "reference"},
    },

    {
      label: "Поставщики",
      to: {name: "reference-suppliers"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const loading = ref<boolean>(false)
const dataValue = ref<DataValue>({
  name: '',
  address: '',
  oked: '',
  tin: '',
  license: '',
  sertificate: '',
  sert_end_date: '',
  director: '',
  phone: '',
})

onMounted(async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      const providerData: DataValue = await store.GET_PROVIDERS_DETAIL(route.params.id as string | number);
      if (providerData && providerData.provider) {
        dataValue.value = providerData.provider;
      }
    } catch (e) {
      loading.value = false
    }
    loading.value = false
  }
});

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push({name: "reference-suppliers"});
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_PROVIDERS(route.params.id as string | number)
    router.push('/reference-suppliers');
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

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      const payload = dataValue.value as any

      if (route.params.id) {
        await store.UPDATE_PROVIDERS({
          id: route.params.id as string | number,
          data: payload,
        })
      } else {
        await store.CREATE_PROVIDERS(payload)
      }

      ElNotification({title: 'Success', type: 'success'});
      await router.push('/reference-suppliers')
    } catch (e) {
      ElNotification({title: 'Error', type: 'error'});
    }
  }
}


const isDisabled = computed(() => {
  return route.name === 'reference-suppliers-view'
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
            class="mt-6"
        >
          <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
            <div class="grid grid-cols-3 gap-4">
              <app-input
                  v-model="dataValue.name"
                  label="Наименование"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="name"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.address"
                  label="Юр. адрес"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="address"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.oked"
                  label="ОКЭД"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="oked"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.tin"
                  label="ИНН"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="tin"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.license"
                  label="Номер лицензии"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="license"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.sertificate"
                  label="Сертификат"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="sertificate"
                  :disabled="isDisabled"
              />

              <app-date-picker
                  v-model="dataValue.sert_end_date"
                  label="Срок сертификата"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  format="DD-MM-YYYY"
                  value-format="DD-MM-YYYY"
                  required
                  prop="sert_end_date"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.director"
                  label="Руководитель"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="director"
                  :disabled="isDisabled"
              />

              <app-input
                  v-model="dataValue.phone"
                  label="Контакты"
                  placeholder="Введите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                  class="w-full"
                  required
                  prop="phone"
                  :disabled="isDisabled"
              />
            </div>

            <ElSwitch
                v-if="route.params.id && !route.query.type"
                active-text="Деактивация"
                class="app-switch mt-auto"
                v-model="dataValue.status"
                :before-change="switchChange"
            />
          </div>
        </AppForm>

        <div v-if="!route.query.type" class="flex items-center mt-[24px] "
             :class="!route.params.id ? 'justify-end' : 'justify-between'">
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
            @click="router.push({name: 'reference-suppliers-edit', params: {id: 1}})"
            v-if="route.query.type == 'view'"
            class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <li :style="{
                  maskImage: 'url(/icons/edit.svg)',
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          />
          Редактировать
        </button>
      </div>
    </div>
    </AppOverlay>
  </div>
</template>

