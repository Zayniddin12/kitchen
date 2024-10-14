<script
  setup
  lang="ts"
>
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const route = useRoute();
const router = useRouter();

const value1 = ref<boolean>(false);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Виды продуктов",
      to: { name: "reference-vid-product" },
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

const { confirm } = useConfirm();

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "reference-vid-product" });
  });
};

const deleteFn = () => {
  confirm.delete().then(response => {
    router.push({ name: "reference-vid-product" });
  });
};

const switchChange = () => {
  confirm.show().then(response => {
    // value1.value = !value1.value;
  });
};

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="border rounded-[24px] p-[24px] w-[70%]  h-[65vh]">
        <AppMediaUploader />

        <div class="grid grid-cols-2 gap-4 mt-[24px]">
          <app-input
            :disabled="route.name === 'reference-vid-view-id'"
            label="Наименование (RU)"
            label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />

          <app-input
            :disabled="route.name === 'reference-vid-view-id'"
            label="Наименование (UZ)"
            label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />

          <app-select
            :disabled="route.name === 'reference-vid-view-id'"
            label="Тип продукта"
            label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />

          <app-select
            :disabled="route.name === 'reference-vid-view-id'"
            label="Единица измерения"
            label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />
        </div>

        <el-switch
          v-model="value1"
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

    <div
      class="flex items-center justify-between mt-[24px] w-[70%]"
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
        <button
          class="custom-cancel-btn"
          @click="cancelFn"
        >
          Отменить
        </button>
        <button class="custom-apply-btn ml-[8px]">
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