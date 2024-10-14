<script
  setup
  lang="ts"
>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

interface Name {
  uz: string;
  ru: string;
}

interface DataValue {
  name: Name,
  is_active: boolean
}

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();

const dataValue = ref<DataValue>({
  name: {
    uz: "",
    ru: "",
  },
  is_active: true,
});

const { setBreadCrumb } = useBreadcrumb();

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
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

const deleteFn = () => {
  confirm.delete().then(response => {
    console.log("delete");
    router.push({ name: "reference-vid-product" });
  });
};

const cancelFn = () => {
  confirm.cancel().then(response => {
    console.log("edit");
    router.push({ name: "reference-vid-product" });
  });
};

const showConfirmFn = async () => {
  confirm.show().then(response => {
    // dataValue.value.is_active = !dataValue.value.is_active;
  });
};

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="grid grid-cols-2 border rounded-[24px] p-[24px] gap-5 h-[50vh] w-[70%]">
        <app-input
          :disabled="route.name === 'reference-type-product-view'"
          v-model="dataValue.name.ru"
          label="Наименование (RU)"
          placeholder="Введите"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          :disabled="route.name === 'reference-type-product-view'"
          v-model="dataValue.name.uz"
          label="Наименование (UZ)"
          placeholder="Введите"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <el-switch
          :disabled="route.name === 'reference-type-product-view' as any"
          v-model="dataValue.is_active"
          class="mt-auto"
          active-text="Деактивация"
          v-if="route.name === 'reference-type-product-edit-id'"
          :before-change="showConfirmFn"
        />
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
        Редактировать
      </button>
    </div>

    <div
      class="flex items-start justify-between mt-[24px] w-[70%]"
      v-if="route.name === 'reference-type-product-edit-id' || route.name === 'reference-type-product-create'"
    >
      <button
        class="custom-danger-btn"
        v-if="route.name === 'reference-type-product-edit-id'"
        @click="deleteFn"
      >
        Удалить
      </button>

      <div class="flex items-start justify-end ml-auto">
        <button
          class="custom-cancel-btn"
          @click="cancelFn"
        >Отменить
        </button>
        <button class="custom-apply-btn ml-[8px]">
          {{ route.name === "reference-type-product-edit-id" ? "Сохранить" : "Добавить" }}
        </button>
      </div>
    </div>
  </div>
</template>