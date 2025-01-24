<script
  setup
  lang="ts"
>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

interface Name {
  uz: string;
  ru: string;
}

interface DataValue {
  name: Name,
  is_active: boolean
}

const {t} = useI18n()
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
  is_active: true,
});

const loading = ref<boolean>(false);

onMounted(async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      const typeDoc = await store.GET_TYPE_PRODUCT_DETAIL(route.params.id as string | number);
      if (typeDoc && typeDoc.data && typeDoc.data.product_type) {
        dataValue.value = typeDoc.data.product_type;
      }
    } catch (e) {
      ElNotification({ title: e, type: "error" });
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
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Типы продуктов",
      to: { name: "reference-type-product" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_TYPE_PRODUCT(+route.params.id);
    router.push("/reference-type-product");
    ElNotification({ title: "Success", type: "success" });
  });
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push("/reference-type-product");
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

const handleSubmitProduct = async (): Promise<void> => {
  try {
    const payload = dataValue.value as DataValue;

    if (route.params.id) {
      await store.UPDATE_TYPE_PRODUCT({
        id: route.params.id as string | number,
        data: {
          is_active: +payload.is_active,
          name: payload.name,
        },
      });
    } else {
      await store.CREATE_TYPE_PRODUCT(payload);
    }

    ElNotification({ title: "Success", type: "success" });
    await router.push("/reference-type-product");
  } catch (error) {
    ElNotification({ title: "Error", type: "error" });
  }
}

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });
</script>

<template>
  <div>
    <AppOverlay
      :loading="loading"
    >
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>

      <div class="flex items-start mt-[24px]">
        <div class="grid grid-cols-2 border rounded-[24px] p-[24px] gap-5 h-[50vh] w-[70%]">
          <app-input
            v-model="dataValue.name.ru"
            label="Наименование (Рус)"
            placeholder="Введите"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <app-input
            v-model="dataValue.name.uz"
            :label="$t('Наименование (Ўзб)')"
            :placeholder="$t('form.enter')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <el-switch
            v-model="dataValue.is_active"
            class="mt-auto"
            :active-text="dataValue.is_active ? $t('status.activation') : $t('status.deactivation')"
            v-if="route.name === 'reference-type-product-edit-id'"
          />
          <!--        :before-change="switchChange"-->
        </div>

        <button
          @click="router.push(`/reference-type-product-edit/${route.params.id}`)"
          v-if="route.name === 'reference-type-product-view-id'"
          class="custom-light-btn flex items-center ml-[24px]"
        >
          <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
          />
          {{$t('method.edit')}}
        </button>
      </div>

      <div class="flex items-start justify-between mt-[24px] w-[70%]">
        <button
          v-if="$can('delete', 'Button')"
          class="custom-danger-btn"
          v-show="route.name === 'reference-type-product-edit-id'"
          @click="deleteFn"
        >
          {{$t('method.delete')}}
        </button>

        <div class="flex items-start justify-end ml-auto">
          <button
            class="custom-cancel-btn"
            @click="cancelFn"
          >
            {{ $t('method.cancel') }}
          </button>

          <button
            class="custom-apply-btn ml-[8px]"
            @click="handleSubmitProduct"
          >
            {{ route.name === "reference-type-product-edit-id" ? $t('method.save') : $t('method.add') }}
          </button>
        </div>
      </div>
    </AppOverlay>
  </div>
</template>