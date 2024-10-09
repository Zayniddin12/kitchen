<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface TableData {
  id: string;
  type: string;
  vid: string;
  count: string;
  count2: string;
}

const route = useRoute();
const router = useRouter()

const user_photo_new = ref<string>("");
const repeater = ref<[]>([{}]);
const tableData = ref<TableData[]>([
  {
    id: "Картофель",
    type: "Овощи",
    vid: "Картофель",
    count: "0.1",
    count2: "кг",
  },
  {
    id: "Говядина",
    type: "Мясные",
    vid: "Говядина",
    count: "0.1",
    count2: "кг",
  },
  {
    id: "Горох",
    type: "Зерновые",
    vid: "Горох",
    count: "0.1",
    count2: "кг",
  },
  {
    id: "Картофель",
    type: "Овощи",
    vid: "Морковь",
    count: "0.1",
    count2: "кг",
  }
])

const previewImage = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user_photo_new.value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const repeaterAgain = () => {
  repeater.value.push({});
};

const handleDelete = (index: number) => {
  if (repeater.value.length > 1) {
    repeater.value.splice(index, 1);
  }
}

const { setBreadCrumb } = useBreadcrumb();

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
      label: "Рационы и блюда",
      to: { name: "reference" },
    },
    {
      label: "Блюда",
      to: {name: "reference-dish"},
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

    <div class="mt-[24px] flex items-start">
      <div class="w-[90%]">
        <div class="border rounded-[24px] p-[24px]">
          <div class="rounded-[24px] py-[32px] px-[24px] w-[50%] flex justify-center m-auto relative group" v-if="user_photo_new">
            <img :src="user_photo_new" alt="#" />

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
                   class="cursor-pointer bg-[#F8F9FC] rounded-[16px] border-dashed border border-gray-300 flex flex-col items-center justify-center p-10 h-[224px]">
              <img src="@/assets/images/icons/upload.svg" alt="upload" />

              <span class="text-gray-700 text-sm mt-[24px]">Перетащите фотографию для загрузки</span>
              <span class="text-gray-400 text-xs mb-[24px]">Максимальный размер фотографии 10 МБ</span>

              <span class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Выбрать фото
              </span>
            </label>
          </template>

          <div class="mt-[24px] grid grid-cols-2 gap-5">
            <app-input label="Наименование (RU)" placeholder="Введите" label-class="text-[#A8AAAE] text-[12px]" />

            <app-input label="Наименование (UZ)" placeholder="Введите" label-class="text-[#A8AAAE] text-[12px]" />

            <app-input label="Уникальный номер рациона" placeholder="Введите" label-class="text-[#A8AAAE] text-[12px]" />

            <app-select label="Ед. измерения" placeholder="Выберите" label-class="text-[#A8AAAE] text-[12px]" />
          </div>

          <template v-if="route.name === 'reference-view-id'">
            <el-table :data="tableData" class="custom-element-table mt-[40px]">
              <el-table-column prop="id" label="Состав" />
              <el-table-column prop="type" label="Тип продукта" />
              <el-table-column prop="vid" label="Вид продукта" />
              <el-table-column prop="count" label="Количество" />
              <el-table-column prop="count2" label="Ед. измерения" />
            </el-table>
          </template>

          <template v-else>
            <div class="mt-[24px]">
              <h1 class="text-[#000D24] text-[18px] font-medium">Состав рациона</h1>

              <div class="bg-[#F8F9FC] rounded-[16px] p-[16px] mt-[24px]">
                <div class="grid grid-cols-4 gap-4 border-b mt-[16px]" v-for="(item, index) in repeater" :key="index">
                  <app-select label="Тип продукта" label-class="text-[#A8AAAE] text-[12px]" placeholder="Выберите" />

                  <app-select label="Вид продукта" label-class="text-[#A8AAAE] text-[12px]" placeholder="Выберите" />

                  <app-input label="Количество" label-class="text-[#A8AAAE] text-[12px]" placeholder="0.0" />

                  <div class="flex items-center">
                    <app-input label="Ед. измерения" label-class="text-[#A8AAAE] text-[12px]" placeholder="кг" />
                    <button class="custom-cancel-btn ml-[16px] mt-2" @click="handleDelete(index)">
                      <img src="@/assets/images/icons/delete.svg" alt="delete" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                v-if="route.name === 'reference-create' || route.name === 'reference-dish-id'"
                class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[12px]"
                @click="repeaterAgain"
              >
                <img src="@/assets/images/icons/plus2.svg" class="mr-[4px]" alt="plus" />
                Добавить еще
              </button>
            </div>
          </template>
        </div>

        <div class="flex items-center justify-between mt-[24px]" v-if="route.name === 'reference-dish-create' || route.name === 'reference-dish-id'">
          <button class="custom-danger-btn" v-if="route.name === 'reference-dish-id'">Удалить</button>

          <div class="flex items-center justify-end ml-auto">
            <button class="custom-cancel-btn" @click="router.go(-1)">Отменить</button>
            <button class="custom-apply-btn ml-[8px]">Сохранить</button>
          </div>
        </div>
      </div>

      <button class="custom-cancel-btn flex items-center ml-[24px]" v-if="route.name === 'reference-view-id'">
        <img src="@/assets/images/icons/edit.svg" alt="edit" class="mr-[12px]" />
        Редактировать
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>