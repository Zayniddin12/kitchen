<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {useSettingsStore} from "@/modules/Settings/store";
import {ElNotification} from "element-plus";

interface Name {
  uz: string;
  ru: string;
}

interface DataValue {
  name: Name;
  is_active: boolean | string;
  units: string
}

const store = useSettingsStore()
const route = useRoute();
const router = useRouter();
const {confirm} = useConfirm();
const {setBreadCrumb} = useBreadcrumb();

const dataValue = ref<DataValue>({
  name: {
    uz: '',
    ru: ''
  },
  units: '',
  is_active: true
})

onMounted(() => {
  store.GET_UNITS()
  store.GET_TYPE_PRODUCT()
})


const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: {name: "reference"},
    },
    {
      label: "Виды продуктов",
      to: {name: "reference-vid-product"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push('/reference-vid-product');
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    router.push('/reference-vid-product');
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

const handleClick = async () => {
  try {
    const payload = dataValue.value as DataValue;
    if (route.params.id) {
      await store.UPDATE_VID_PRODUCT({
        id: route.params.id as string | number,
        data: payload
      })
    } else {
      await store.CREATE_VID_PRODUCT(payload)
    }
    ElNotification({title: 'Success', type: 'success'});
    await router.push('/reference-vid-product')
  } catch (e) {
    ElNotification({title: 'Error', type: 'error'});
  }
}

const isDisabled = computed(() => {
  return route.name === 'reference-vid-view-id'
})

watchEffect(() => {
  setBreadCrumbFn();
});
</script>

<template>
  <div>
    <pre>{{ dataValue }}</pre>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="border rounded-[24px] p-[24px] w-[70%]  min-h-[65vh]">
        <AppMediaUploader/>

        <div class="grid grid-cols-2 gap-4 mt-[24px]">
          <app-input
              v-model="dataValue.name.ru"
              :disabled="isDisabled"
              label="Наименование (RU)"
              label-class="text-[#A8AAAE] text-[12px]"
              placeholder="Введите"
          />

          <app-input
              v-model="dataValue.name.uz"
              :disabled="isDisabled"
              label="Наименование (UZ)"
              label-class="text-[#A8AAAE] text-[12px]"
              placeholder="Введите"
          />

          <app-select
              :disabled="isDisabled"
              label="Тип продукта"
              label-class="text-[#A8AAAE] text-[12px]"
              placeholder="Введите"
              itemValue="id"
              itemLabel="name"
              :items="store.typeProduct.product_categories"
          />

          <app-select
              v-model="dataValue.units"
              :disabled="isDisabled"
              label="Единица измерения"
              label-class="text-[#A8AAAE] text-[12px]"
              placeholder="Введите"
              itemValue="id"
              itemLabel="name"
              :items="store.units.units"
          />
        </div>

        <el-switch
            v-model="dataValue.is_active"
            active-text="Деактивация"
            v-if="route.name === 'reference-vid-edit-id'"
            :before-change="switchChange"
        />
      </div>

      <button
          class="custom-light-btn flex items-center ml-[24px]"
          @click="router.push(`/reference-vid-edit/${route.params.id}`)"
          v-if="route.name === 'reference-vid-view-id'"
      >
        <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
            class="mr-[12px]"
        />
        Редактировать
      </button>
    </div>

    <div class="flex items-center justify-between mt-[24px] w-[70%]"
         v-if="route.name === 'reference-vid-add' || route.name === 'reference-vid-edit-id'"
    >
      <button
          class="custom-danger-btn"
          v-if="route.name === 'reference-vid-edit-id'"
          @click="deleteFn"
      >
        Удалить
      </button>

      <div class="flex items-center ml-auto">
        <button class="custom-cancel-btn" @click="cancelFn">
          Отменить
        </button>

        <button class="custom-apply-btn ml-[8px]" @click="handleClick">
          {{ route.name === "reference-vid-edit-id" ? "Сохранить" : "Добавить" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>