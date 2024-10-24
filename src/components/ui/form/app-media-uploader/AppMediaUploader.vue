<script setup lang="ts">
import {
  AppMediaUploaderPropsType,
  AppMediaUploaderValueType,
} from "@/components/ui/form/app-media-uploader/app-media-uploader.type";
import { computed, ref, useTemplateRef, watch } from "vue";
import { generateRandomID } from "@/utils/helper";
import UploadIcon from "@/assets/images/icons/upload.svg";

const id = generateRandomID();

const model = defineModel<AppMediaUploaderValueType>({
  default: "",
});

const props = withDefaults(defineProps<AppMediaUploaderPropsType>(), {
  height: 224,
  loading: false,
});

const computedHeight = computed(() => {
  if (typeof props.height === "string") return props.height;
  return `${props.height}px`;
});

const emit = defineEmits<{
  (event: "clear"): void;
}>();

const inputFile = useTemplateRef<HTMLInputElement>("input-file");
const fileType = ref<string>("");

const uploadImage = async (event: Event) => {
  const target = event.target as HTMLInputElement | null;

  if (!target || !target.files || !target.files[0]) return;

  const file: File = target.files[0];

  fileType.value = file.type.split("/")[0];

  await readImage(file);
};

const readImage = async (file: File) => {
  if (file instanceof File) {
    const reader = new FileReader();

    model.value = await new Promise<string | ArrayBuffer | null>(
      (resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }
    );
  }
};

const clear = () => {
  model.value = null;
  if (inputFile.value) {
    inputFile.value.value = "";
  }
  emit("clear");
};

watch(
  () => props.value,
  newValue => {
    if (newValue) {
      model.value = newValue;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="app-media-uploader">
    <input
      :id
      ref="input-file"
      type="file"
      accept="image/png, image/jpeg"
      class="app-media-uploader__input absolute left-0 top-0 opacity-0 invisible"
      @input="uploadImage"
    />
    <label
      :for="id"
      :class="[
        'bg-white-blue rounded-2xl border-dashed border border-gray-300 overflow-y-hidden flex items-center justify-center',
        { 'cursor-pointer': !model },
      ]"
      :style="{ height: computedHeight }"
    >
      <ElProgress
        v-if="loading"
        type="circle"
        :stroke-width="5"
        :percentage="30"
        status="success"
        :show-text="false"
        :indeterminate="true"
        :duration="1"
      />
      <span
        v-if="model"
        class="relative cursor-pointer z-1 group w-full"
      >
        <img
          :src="model as string"
          alt="file img"
          :class="['w-full rounded-2xl object-contain h-full p-2']"
          :style="{ 'max-height': computedHeight }"
        />
        <button
          class="cursor-pointer pointer-events-none absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Изменить фото
        </button>
      </span>
      <span
        v-else-if="!model && !loading"
        class="flex flex-col items-center justify-center p-6"
      >
        <span class="bg-white rounded-2xl p-4">
          <svg
            :data-src="UploadIcon"
            class="size-6"
          />
        </span>
        <span class="text-gray-700 text-sm mt-6">
          Перетащите фотографию для загрузки
        </span>
        <span class="text-gray-400 text-xs mt-1">
          Максимальный размер фотографии 10 МБ
        </span>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-6 pointer-events-none"
        >
          Выбрать фото
        </button>
      </span>
    </label>
  </div>
</template>
