<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();
const router = useRouter();

const value1 = ref<boolean>(false);
const user_photo_new = ref<string>("");

const previewImage = (event: any) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input?.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      user_photo_new.value = e.target.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

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

watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="border rounded-[24px] p-[24px] w-[90%]">
        <div>
          <div v-if="user_photo_new && user_photo_new.length" class="relative group">
            <img :src="user_photo_new" alt="user_photo_new" class="w-[60%] !h-[400px] object-contain m-auto" />

            <button
              @click="user_photo_new = ''"
              class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 edit__btn transition-opacity duration-300 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Изменить фото
            </button>
          </div>

          <template v-else>
            <input type="file" class="hidden" id="fileInput" @change="previewImage" />
            <label for="fileInput"
                   class="cursor-pointer bg-[#F8F9FC] rounded-[16px] border-dashed border border-gray-300 flex flex-col items-center justify-center p-10">
              <img src="../../../../../../assets/images/icons/upload.svg" alt="upload" />

              <p class="text-gray-700 text-sm mt-[24px]">Перетащите фотографию для загрузки</p>
              <p class="text-gray-400 text-xs mb-[24px]">Максимальный размер фотографии 10 МБ</p>

              <div class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Выбрать фото
              </div>
            </label>
          </template>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-[24px]">
          <app-input
            :disabled="route.name === 'reference-vid-view-id'"
            label="Наименование (RU)" label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />

          <app-input
            :disabled="route.name === 'reference-vid-view-id'"
            label="Наименование (RU)" label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите" />

          <app-select
            :disabled="route.name === 'reference-vid-view-id'"
            label="Тип продукта" label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />

          <app-select
            :disabled="route.name === 'reference-vid-view-id'"
            label="Единица измерения" label-class="text-[#A8AAAE] text-[12px]"
            placeholder="Введите"
          />
        </div>

        <el-switch v-model="value1" active-text="Деактивация" v-if="route.name === 'reference-vid-edit-id'" />
      </div>

      <button
        class="custom-cancel-btn flex items-center ml-[24px]"
        @click="router.push(`/reference-vid-edit/${route.params.id}`)"
        v-if="route.name === 'reference-vid-view-id'"
      >
        <img src="../../../../../../assets/images/icons/edit.svg" alt="edit" class="mr-[12px]" />
        Редактировать
      </button>
    </div>

    <div
      class="flex items-center justify-between mt-[24px] w-[90%]"
      v-if="route.name === 'reference-vid-add' || route.name === 'reference-vid-edit-id'"
    >
      <button class="custom-danger-btn" v-if="route.name === 'reference-vid-edit-id'">Удалить</button>

      <div class="flex items-center ml-auto">
        <button class="custom-cancel-btn" @click="router.go(-1)">Отменить</button>
        <button class="custom-apply-btn ml-[8px]">Добавить</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>